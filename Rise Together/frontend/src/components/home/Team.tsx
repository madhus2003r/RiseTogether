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
          <Paper elevation={0} sx={{ p: 2 }}>
            <Box sx={{ position: 'relative', height: 342, width: '100%', overflow: 'hidden', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="/1.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box sx={{ position: 'absolute', bottom: 20, left: 20, textAlign: 'left' }}>
                <Typography variant="h6" color="white" fontWeight="bold">
                  Madhu S
                </Typography>
                <Typography variant="subtitle1" color="white">
                  Frontend Developer
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={0} sx={{ p: 2 }}>
            <Box sx={{ position: 'relative', height: 342, width: '100%', overflow: 'hidden', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="./2.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box sx={{ position: 'absolute', bottom: 20, left: 20, textAlign: 'left' }}>
                <Typography variant="h6" color="white" fontWeight="bold">
                  Santhosh P
                </Typography>
                <Typography variant="subtitle1" color="white">
                  Backend Developer
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={0} sx={{ p: 2 }}>
            <Box sx={{ position: 'relative', height: 342, width: '100%', overflow: 'hidden', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="./3.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box sx={{ position: 'absolute', bottom: 20, left: 20, textAlign: 'left' }}>
                <Typography variant="h6" color="white" fontWeight="bold">
                  N Deepak
                </Typography>
                <Typography variant="subtitle1" color="white">
                  Full Stack Developer
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={0} sx={{ p: 2 }}>
            <Box sx={{ position: 'relative', height: 342, width: '100%', overflow: 'hidden', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="./4.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Box sx={{ position: 'absolute', bottom: 20, left: 20, textAlign: 'left' }}>
                <Typography variant="h6" color="white" fontWeight="bold">
                  Bhavana S K
                </Typography>
                <Typography variant="subtitle1" color="white">
                  Frontend Developer
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TeamsTwo;
