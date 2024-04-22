import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { Book, ContrastIcon, DollarSign, KeyRoundIcon, Smartphone } from 'lucide-react'; // I removed other icons for simplicity

function FeatureThree() {
  return (
    <Box mx="auto" maxWidth="7xl" px={{ xs: 4, sm: 6, lg: 8 }} style={{ backgroundColor: '#f9fafb' }}>
      <Box style={{ padding: "30px", paddingBottom: "60px" }}>
        <Box mx="auto" maxWidth="xl" textAlign="center">
          <Typography
            variant="h3"
            mt={{ xs: 4, sm: 6 }}
            mb={{ xs: 1, sm: 2 }}
            fontWeight="bold"
            color="black"
            lineHeight={1}
            sx={{
              fontSize: {
                xs: '2rem',
                sm: '3rem'
              }
            }}
          >
            Innovative Features of RiseTogether
          </Typography>
          <Typography variant="body1" mt={0} color="textSecondary">
            Empowering Transparency, Security, and Accountability in Fundraising
          </Typography>
        </Box>
        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} sm={6}>
            <Box mx="auto" display="flex" alignItems="center" justifyContent="center" height={60} width={60} borderRadius="50%" bgcolor="#E5E7EB">
              <Book size={32} color="#4DA3DF" />
            </Box>
            <Typography variant="h5" mt={2} fontWeight="bold" color="black" align="center">
              Decentralized Ledger
            </Typography>
            <Typography variant="body2" mt={1} color="textSecondary" align="center">
              RiseTogether employs a decentralized ledger system, powered by blockchain technology, to ensure transparency and security in all transactions. This feature eliminates the need for intermediaries, providing users with direct control over their funds and project data.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box mx="auto" display="flex" alignItems="center" justifyContent="center" height={60} width={60} borderRadius="50%" bgcolor="#E5E7EB">
              <DollarSign size={32} color="#4DA3DF" />
            </Box>
            <Typography variant="h5" mt={2} fontWeight="bold" color="black" align="center">
              Cryptographic Verification
            </Typography>
            <Typography variant="body2" mt={1} color="textSecondary" align="center">
              RiseTogether utilizes cryptographic verification mechanisms to authenticate users and validate transactions. Through cryptographic algorithms, users can securely participate in crowdfunding campaigns, confident in the integrity and authenticity of the platform.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} mt={4}>
            <Box mx="auto" display="flex" alignItems="center" justifyContent="center" height={60} width={60} borderRadius="50%" bgcolor="#E5E7EB">
              <Smartphone size={32} color="#4DA3DF" />
            </Box>
            <Typography variant="h5" mt={2} fontWeight="bold" color="black" align="center">
              Smart Contracts
            </Typography>
            <Typography variant="body2" mt={1} color="textSecondary" align="center">
              Smart contracts on the RiseTogether platform automate and enforce the terms of agreements between project creators and backers. These contracts execute predefined actions when specific conditions are met, ensuring that funds are released only when project milestones are achieved, thereby enhancing trust and accountability.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} mt={4}>
            <Box mx="auto" display="flex" alignItems="center" justifyContent="center" height={60} width={60} borderRadius="50%" bgcolor="#E5E7EB">
              <KeyRoundIcon size={32} color="#4DA3DF" />
            </Box>
            <Typography variant="h5" mt={2} fontWeight="bold" color="black" align="center">
              Immutable Record-Keeping
            </Typography>
            <Typography variant="body2" mt={1} color="textSecondary" align="center">
              The immutable nature of blockchain technology ensures that all transactions and project-related data on RiseTogether are securely recorded and tamper-proof. This feature provides a transparent and auditable record of all activities, fostering trust and accountability within the crowdfunding ecosystem.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default FeatureThree;
