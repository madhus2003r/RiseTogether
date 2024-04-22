import { Container, Typography, Grid, Divider, Link, Box } from '@mui/material';

const ContactUsPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Contact Us
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Address
          </Typography>
          <Typography>
            RGC Campus <br />
            Bengaluru, Karnataka, 560092 <br />
            India
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Phone
          </Typography>
          <Typography>
            <Link href="tel:+123456789">+91 9876543211</Link> <br />
            <Link href="tel:+987654321">+91 7189999999</Link>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Social Media
          </Typography>
          <Typography>
            Facebook: <Link href="https://www.facebook.com/">https://www.facebook.com/</Link> <br />
            Twitter: <Link href="https://www.twitter.com/">https://www.twitter.com/</Link> <br />
            Instagram: <Link href="https://www.instagram.com/">https://www.instagram.com/</Link>
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Email
          </Typography>
          <Typography>
            <Link href="mailto:info@example.com">info@vtu.com</Link> <br />
            <Link href="mailto:support@example.com">support@vtu.com</Link>
          </Typography>
          {/* Google Maps location outside the grid */}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Location
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <iframe
          title="Google Maps"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8687935473677!2d77.50315067527086!3d12.980242714688337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3c374e992a57%3A0x1e7275166db90431!2sVisvesvaraya%20Technological%20University%20Regional%20Center%20Bengaluru!5e0!3m2!1sen!2sin!4v1711960287686!5m2!1sen!2sin"
          width="600"
          height="450"
          style={{ border: 0, borderRadius: '5px' }}
          loading="lazy"
        ></iframe>
      </Box>
    </Container>
  );
};

export default ContactUsPage;
