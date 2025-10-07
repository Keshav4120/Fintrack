import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect to dashboard
import Tesseract from 'tesseract.js'; // OCR library
import './LoanApp.css'; // Ensure the CSS is specific to LoanApp
import ChatBotComponent from './ChatBotComponent'; // Import chatbot

const LoanApp = () => {
    const [loanType, setLoanType] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [tenure, setTenure] = useState('');
    const [emiResult, setEmiResult] = useState('');
    const [eligibilityResult, setEligibilityResult] = useState('');
    const [approvalResult, setApprovalResult] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [maxLoanAmount, setMaxLoanAmount] = useState(''); // New state for max loan amount
    const [canTakeLoan, setCanTakeLoan] = useState(false); // State for enabling/disabling the "Take Loan" button
    const [imageFile, setImageFile] = useState(null); // State for uploaded image
    const [isProcessingImage, setIsProcessingImage] = useState(false); // State to show image processing status
    const navigate = useNavigate(); // React Router hook for navigation

    const handleLoanTypeChange = (event) => {
        setLoanType(event.target.value);
        setInputValue('');
        setLoanAmount('');
        setTenure('');
        setEmiResult('');
        setEligibilityResult('');
        setApprovalResult('');
        setIsSubmitted(false);
        setMaxLoanAmount(''); // Reset max loan amount on loan type change
        setCanTakeLoan(false); // Disable the "Take Loan" button on loan type change
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);

        // Calculate the maximum loan amount based on the input
        let calculatedMaxLoan = 0;
        if (loanType === 'portfolio') {
            calculatedMaxLoan = event.target.value * 10; // 10 times the portfolio size
        } else if (loanType === 'income') {
            calculatedMaxLoan = event.target.value * 10; // 10 times the income
        }
        setMaxLoanAmount(calculatedMaxLoan);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        setImageFile(file);

        if (file) {
            setIsProcessingImage(true);

            // Perform OCR using Tesseract.js
            Tesseract.recognize(file, 'eng', {
                logger: (info) => console.log(info), // Logs OCR progress
            })
                .then(({ data: { text } }) => {
                    const extractedValue = text.match(/\d+/); // Extract numbers from the text
                    if (extractedValue) {
                        const numericValue = extractedValue[0];
                        setInputValue(numericValue); // Set the extracted value to input field
                        handleInputChange({ target: { value: numericValue } }); // Update state and max loan
                    } else {
                        alert('No valid number found in the image.');
                    }
                })
                .catch((error) => {
                    console.error('Error during OCR:', error);
                    alert('Failed to process the image. Please try again.');
                })
                .finally(() => {
                    setIsProcessingImage(false);
                });
        }
    };

    const handleLoanAmountChange = (event) => {
        setLoanAmount(event.target.value);
    };

    const handleTenureChange = (event) => {
        setTenure(event.target.value);
    };

    const calculateEMI = (amount, tenure, interestRate) => {
        const monthlyInterestRate = interestRate / 12 / 100;
        const emi =
            (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure)) /
            (Math.pow(1 + monthlyInterestRate, tenure) - 1);
        return emi;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitted(true); // Set isSubmitted to true
        setCanTakeLoan(true); // Enable the "Take Loan" button after submission

        let interestRate;

        if (loanType === 'portfolio') {
            interestRate = 12; // 12% interest for portfolio-based loans
        } else if (loanType === 'income') {
            interestRate = 14; // 14% interest for income-based loans
        }

        if (loanAmount <= maxLoanAmount) {
            if (loanAmount < 5000 && tenure <= 3) {
                interestRate = 0; // No interest for small loans under ₹5000 with a tenure of 3 months or less
            }

            const emi = calculateEMI(loanAmount, tenure, interestRate);
            setEmiResult(
                `Your EMI is ₹${emi.toFixed(2)} for a loan of ₹${loanAmount} over ${tenure} months at ${interestRate}% interest rate.`
            );
            setEligibilityResult(`You are eligible for a loan of ₹${loanAmount}`);

            // Call API to approve loan
            const loanDetails = {
                loanType,
                portfolioOrIncome: inputValue,
                loanAmount,
                tenure,
            };

            try {
                const response = await fetch('http://localhost:5000/api/loans/approve', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loanDetails),
                });

                if (response.ok) {
                    setApprovalResult('Loan Approved');
                } else {
                    const data = await response.json();
                    setApprovalResult(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error approving loan:', error);
                setApprovalResult('Status of your loan.');
            }
        } else {
            setEligibilityResult('Loan amount exceeds your eligible limit.');
            setEmiResult('');
            setApprovalResult('');
            setCanTakeLoan(false); // Disable "Take Loan" if ineligible
        }
    };

    const handleTakeLoanClick = () => {
        if (canTakeLoan) {
            navigate('/dashboard'); // Redirect to the dashboard page
        }
    };

    return (
        <div className="loan-app-container">
            <header>
                <h1>Loan Application</h1>
            </header>
            <div className="container">
                <form id="loan-form" onSubmit={handleSubmit}>
                    <label htmlFor="loanType">Choose Loan Type:</label>
                    <select id="loanType" name="loanType" value={loanType} onChange={handleLoanTypeChange} required>
                        <option value="">Select...</option>
                        <option value="portfolio">Based on Portfolio</option>
                        <option value="income">Based on Income</option>
                    </select>

                    {loanType && (
                        <>
                            <label htmlFor="inputValue">
                                {loanType === 'portfolio' ? 'Portfolio Size:' : 'Monthly Income:'}
                            </label>
                            {(loanType === 'portfolio' || loanType === 'income') && (
                                <div>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                                    {isProcessingImage && <p>Processing image...</p>}
                                </div>
                            )}
                            <input
                                type="number"
                                id="inputValue"
                                name="inputValue"
                                value={inputValue}
                                onChange={handleInputChange}
                                required
                                disabled={(loanType === 'portfolio' || loanType === 'income') && !!imageFile}
                            />

                            {/* Display the maximum loan amount in a box */}
                            <div className="max-loan-box">
                                <p>Maximum Loan Amount: ₹{maxLoanAmount}</p>
                            </div>

                            <label htmlFor="loanAmount">Loan Amount:</label>
                            <input
                                type="number"
                                id="loanAmount"
                                name="loanAmount"
                                value={loanAmount}
                                onChange={handleLoanAmountChange}
                                required
                            />

                            <label htmlFor="tenure">Tenure (months):</label>
                            <input
                                type="number"
                                id="tenure"
                                name="tenure"
                                value={tenure}
                                onChange={handleTenureChange}
                                required
                            />

                            <button type="submit">Submit</button>
                        </>
                    )}

                    {isSubmitted && (
                        <>
                            <div id="eligibility-result" className="result">{eligibilityResult}</div>
                            <div id="emi-result" className="result">{emiResult}</div>
                            <div id="approval-result" className="result">{approvalResult}</div>
                        </>
                    )}
                </form>

                {/* Take Loan Button */}
                <button
                    className="take-loan-button"
                    style={{
                        backgroundColor: canTakeLoan ? 'green' : 'gray',
                        cursor: canTakeLoan ? 'pointer' : 'not-allowed',
                    }}
                    onClick={handleTakeLoanClick}
                    disabled={!canTakeLoan}
                >
                    Take Loan
                </button>
            </div>
            
            {/* Chatbot */}
            <ChatBotComponent />
        </div>
    );
};

export default LoanApp;
