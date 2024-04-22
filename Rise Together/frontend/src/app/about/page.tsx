import TeamsTwo from '@/components/home/Team';
import { Container, Grid, Typography, Button } from '@mui/material';
import Image from 'next/image';

const AboutUsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {/* Introduction Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Welcome to RiseTogether
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to RiseTogether, the pioneering platform revolutionizing crowdfunding through blockchain technology. Here, creators, entrepreneurs, and changemakers unite to bring their innovative ideas to life, supported by a global community of backers. With our commitment to transparency, security, and collaboration, RiseTogether empowers you to make a difference, one project at a time. Join us on this journey to reshape the future of crowdfunding and drive positive impact worldwide.
          </Typography>
        </Grid>
        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="About Us"
            width={500}
            height={300}
          />
        </Grid>

        {/* Mission Section */}
        <Grid item xs={12} md={6}>
          <Image
            src="https://images.unsplash.com/photo-1521316730702-829a8e30dfd0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Our Mission"
            width={500}
            height={300}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            At RiseTogether, our mission is clear: to democratize crowdfunding and empower creators worldwide. We believe in fostering a community where ideas flourish, innovation thrives, and positive change is realized. Through our platform, we aim to provide transparent, secure, and accessible crowdfunding opportunities for all, regardless of background or location. Together, we're on a mission to inspire and support the next generation of innovators and changemakers, driving progress and making a meaningful impact on a global scale.
          </Typography>
        </Grid>
      </Grid>


      <TeamsTwo />
    </Container>
  );
};

export default AboutUsPage;
