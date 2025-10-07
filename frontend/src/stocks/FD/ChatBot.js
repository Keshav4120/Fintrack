import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const FDChatBot = () => {
    const steps = [
        {
            id: '1',
            message: 'Welcome to FD Assistant! How can I help you today?',
            trigger: '2',
        },
        {
            id: '2',
            options: [
                { value: 'fd_types', label: 'What are the types of FDs available?', trigger: '3' },
                { value: 'fd_interest', label: 'What is the interest rate for FDs?', trigger: '4' },
                { value: 'fd_tenure', label: 'What is the minimum and maximum tenure for FDs?', trigger: '5' },
                { value: 'fd_premature', label: 'Can I withdraw my FD prematurely?', trigger: '6' },
                { value: 'fd_tax', label: 'Are FDs taxable?', trigger: '7' },
            ],
        },
        {
            id: '3',
            message: 'We offer Standard FDs, Tax-saving FDs, Senior Citizen FDs, and Flexi FDs. Each has its own benefits and interest rates.',
            trigger: '8',
        },
        {
            id: '4',
            message: 'Interest rates vary based on the tenure and amount. Currently, the rates range from 5% to 7.5%.',
            trigger: '8',
        },
        {
            id: '5',
            message: 'The minimum tenure for FDs is 7 days, and the maximum tenure is 10 years.',
            trigger: '8',
        },
        {
            id: '6',
            message: 'Yes, you can withdraw your FD prematurely. However, a penalty may apply based on the bank\'s policy.',
            trigger: '8',
        },
        {
            id: '7',
            message: 'Yes, FDs are taxable. The interest earned is added to your income and taxed as per your income tax slab.',
            trigger: '8',
        },
        {
            id: '8',
            message: 'Would you like to return to the main menu or end the chat?',
            trigger: '9',
        },
        {
            id: '9',
            options: [
                { value: 'return_to_main', label: 'Return to Main Questions', trigger: '2' },
                { value: 'end_chat', label: 'End Chat', trigger: '10' },
            ],
        },
        {
            id: '10',
            message: 'Thank you for using FD Assistant! Have a great day!',
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
                    headerTitle="FD Assistant"
                    floating={true}
                />
            </div>
        </ThemeProvider>
    );
};

export default FDChatBot;
