import { Box, Link, Typography, IconButton } from '@mui/material'
import { grey } from '@mui/material/colors'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'

const styles = {
    wrap: {
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '150px', // Increased height for additional content
        backgroundColor: '#ffffff', // White background
        boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)', // Shadow effect
    },
    socialLinks: {
        display: 'flex',
        gap: '12px', // Adjust the gap between social links
        mt: '12px', // Add margin top to separate from the text
    },
    socialIcon: {
        color: grey[900], // Set the color of social icons to dark grey
    },
    copyright: {
        mt: '12px', // Add margin top to separate from social links
        mb: '25px', // Add margin top to separate from social links
        color: grey[900], // Set the color of the copyright text to dark grey
    },
	socialText: {
        mt: '12px', // Add margin top to separate from social links
        color: grey[900], // Set the color of the copyright text to dark grey
    },
};

const AppFooter = () => {
    return (
        <Box sx={styles.wrap}>
            <Typography sx={styles.socialText}>
                Connect with us on social media:
            </Typography>
            <Box sx={styles.socialLinks}>
                <IconButton sx={styles.socialIcon} aria-label="Facebook">
                    <FacebookIcon />
                </IconButton>
                <IconButton sx={styles.socialIcon} aria-label="Twitter">
                    <TwitterIcon />
                </IconButton>
                <IconButton sx={styles.socialIcon} aria-label="Instagram">
                    <InstagramIcon />
                </IconButton>
            </Box>
            <Typography variant="body2" sx={styles.copyright}>
                &copy;{new Date().getFullYear()}&nbsp;|&nbsp;All rights reserved.
            </Typography>
        </Box>
    )
}

export default AppFooter
