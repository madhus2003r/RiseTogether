import { Accordion, AccordionDetails, AccordionSummary, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { blue } from '@mui/material/colors';

const FAQ = () => {
    const faqs = [
        { question: 'How can I fund my project on RiseTogether?', answer: 'To fund your project on RiseTogether, simply create a campaign detailing your goals and funding requirements. Backers can then support your project by contributing securely through our platform.' },
        { question: 'Is RiseTogether compatible with private funding sources?', answer: 'Yes, RiseTogether is compatible with various funding sources, including private backers and investors. Our platform provides a secure and transparent environment for all funding activities.' },
        { question: 'Do I need special permissions to start a campaign?', answer: 'No special permissions are required to start a campaign on RiseTogether. Simply sign up, create your project, and begin fundraising!' },
        { question: 'What are the operating hours for RiseTogether?', answer: 'RiseTogether operates around the clock, providing support and accessibility to creators and backers worldwide.' },
        { question: 'What should I expect after launching my campaign?', answer: 'After launching your campaign on RiseTogether, you can expect to engage with backers, provide updates on your project\'s progress, and work towards achieving your funding goals.Our platform offers resources and support to help you every step of the way.' },
    ];

    const accordionStyle = {
        marginBottom: '2rem',
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
    };

    const questionStyle = {
        fontWeight: 'bold',
        color: "#333",
    };

    const answerStyle = {
        color: "#555",
    };

    const iconStyle = {
        width: '24px',
        height: '24px',
        fill: blue[500],
    };

    return (
        <section>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
                <Box textAlign="center">
                    <Typography variant="h3" mt={6} mb={2} fontWeight="bold" color="black" lineHeight={1}>
                        Frequently asked questions
                    </Typography>
                    <Typography variant="body1" mt={0} color="textSecondary">
                        Empowering Transparency, Security, and Accountability in Fundraising
                    </Typography>
                </Box>
                <div style={{ marginTop: '28px' }}>
                    {faqs.map((faq, index) => (
                        <Accordion key={index} style={accordionStyle} defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon style={iconStyle} />}
                                aria-controls={`panel${index + 1}a-content`}
                                id={`panel${index + 1}a-header`}
                            >
                                <Typography variant="h6" component="h2" style={questionStyle}>{faq.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body1" style={answerStyle}>{faq.answer}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
