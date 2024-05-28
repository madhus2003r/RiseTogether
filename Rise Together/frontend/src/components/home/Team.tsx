import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';

function TeamsTwo() {
  return (
    <Box mx="auto" maxWidth="7xl" px={{ xs: 2, md: 0 }} mt={10}>
      <Box my={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold" gutterBottom color="black">
          Meet Our Team
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Get to Know Our Team of Dedicated and Experienced Professionals
        </Typography>
      </Box>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={3} sx={{ borderRadius: '20px', backgroundColor: '#FF5722', color: '#FFF' }}>
            <Box sx={{ position: 'relative', height: 342, width: '100%', overflow: 'hidden', borderRadius: '20px' }}>
              <img
                src="/1.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
              />
              <Box sx={{ position: 'absolute', bottom: 20, left: 20, textAlign: 'left', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px', borderRadius: '5px' }}>
                <Typography variant="h6" fontWeight="bold" color="white">
                  Madhu S
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={3} sx={{ borderRadius: '20px', backgroundColor: '#03A9F4', color: '#FFF' }}>
            <Box sx={{ position: 'relative', height: 342, width: '100%', overflow: 'hidden', borderRadius: '20px' }}>
              <img
                src="./2.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
              />
              <Box sx={{ position: 'absolute', bottom: 20, left: 20, textAlign: 'left', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px', borderRadius: '5px' }}>
                <Typography variant="h6" fontWeight="bold" color="white">
                  Santhosh P
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={3} sx={{ borderRadius: '20px', backgroundColor: '#4CAF50', color: '#FFF' }}>
            <Box sx={{ position: 'relative', height: 342, width: '100%', overflow: 'hidden', borderRadius: '20px' }}>
              <img
                src="./3.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
              />
              <Box sx={{ position: 'absolute', bottom: 20, left: 20, textAlign: 'left', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px', borderRadius: '5px' }}>
                <Typography variant="h6" fontWeight="bold" color="white">
                  N Deepak
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={3} sx={{ borderRadius: '20px', backgroundColor: '#FFC107', color: '#FFF' }}>
            <Box sx={{ position: 'relative', height: 342, width: '100%', overflow: 'hidden', borderRadius: '20px' }}>
              <img
                src="./4.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
              />
              <Box sx={{ position: 'absolute', bottom: 20, left: 20, textAlign: 'left', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px', borderRadius: '5px' }}>
                <Typography variant="h6" fontWeight="bold" color="white">
                  Bhavana S K
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TeamsTwo
