import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const ChatBotComponent = () => {
    const steps = [
        {
            id: '1',
            message: 'Welcome to Loan Assistant! How can I help you today?',
            trigger: '2',
        },
        {
            id: '2',
            options: [
                { value: 'loan_eligibility', label: 'Check Loan Eligibility', trigger: '3' },
                { value: 'emi_calculation', label: 'How is EMI calculated?', trigger: '4' },
                { value: 'interest_rates', label: 'What are the interest rates?', trigger: '5' },
            ],
        },
        {
            id: '3',
            message: 'To check loan eligibility, please choose your loan type and provide your details in the form above.',
            trigger: '6',
        },
        {
            id: '4',
            message: 'EMI is calculated using the formula: EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]. Where P is principal, r is monthly interest rate, and n is tenure in months.',
            trigger: '6',
        },
        {
            id: '5',
            message: 'Interest rates are 12% for portfolio-based loans and 14% for income-based loans. Small loans under ₹5000 with a tenure of 3 months or less have no interest.',
            trigger: '6',
        },
        {
            id: '6',
            message: 'Would you like to return to the main questions or end the chat?',
            trigger: '7',
        },
        {
            id: '7',
            options: [
                { value: 'return_to_main', label: 'Return to Main Questions', trigger: '2' },
                { value: 'end_chat', label: 'End Chat', trigger: '8' },
            ],
        },
        {
            id: '8',
            message: 'Thank you for using Loan Assistant! Have a great day!',
            end: true,
        },
    ];

    const theme = {
        background: '#f5f8fb',
        fontFamily: 'Arial, Helvetica, sans-serif',
        headerBgColor: '#00bcd4',
        headerFontColor: '#fff',
        headerFontSize: '15px',
        botBubbleColor: '#00bcd4',
        botFontColor: '#fff',
        userBubbleColor: '#fff',
        userFontColor: '#4a4a4a',
    };

    return (
        <ThemeProvider theme={theme}>
            <div>
                <ChatBot
                    steps={steps}
                    headerTitle="Loan Assistant"
                    floating={true} // Keep this for floating button functionality
                />
            </div>
        </ThemeProvider>
    );
};

export default ChatBotComponent;
