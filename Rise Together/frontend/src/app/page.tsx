"use client"

import FAQ from '@/components/home/Faq'
import FeatureThree from '@/components/home/Features'
import StepsComponent from '@/components/home/Process'
import TeamsTwo from '@/components/home/Team'
import { Paper, Typography, Grid, Box, Button } from '@mui/material'
import { SendIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { useRouter } from 'next/navigation'

const styles = {
    paper: {
        p: 4,
        backgroundColor: '#ffffff', // White background
        textAlign: 'center', // Center-align content
        border: 'none', // Remove default border
        boxShadow: 'none', // Remove default shadow
    },
    imageContainer: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: 8, // Add border radius to the image container
        overflow: 'hidden', // Hide overflowing content
    },
    image: {
        width: '100%', // Ensure the image covers the container
        height: '100%', // Ensure the image covers the container
        objectFit: 'cover', // Cover the container while maintaining aspect ratio
    },
    heading: {
        textTransform: 'none', // Don't convert text to uppercase
        fontSize: '3rem', // Adjust font size for a slightly smaller heading
        fontFamily: 'Arial, sans-serif', // Change font family
        fontWeight: 'bold', // Adjust font weight for better readability
    },
}


const DefaultPage = () => {
    const router = useRouter()
    return (
        <div>
            <Paper sx={styles.paper}>
                <Grid container spacing={4} alignItems="center" justifyContent="center" > {/* Center-align the Grid container */}
                    <Grid item xs={12} md={6}>
                        <Box sx={styles.imageContainer}>
                            <img
                                src="/hero.jpg"
                                alt="Image"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h1" sx={styles.heading} gutterBottom>
                            Revolutionizing Crowdfunding through Blockchain
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            RiseTogether is a pioneering crowdfunding platform that harnesses the power of blockchain technology. By utilizing decentralized ledgers and smart contracts, it ensures transparency and security in every fundraising endeavor. Creators can easily launch projects, while backers can support them with confidence, knowing their contributions are protected by blockchain's immutable ledger. Together, we're redefining crowdfunding, empowering creators and backers to drive positive change and innovation globally. Join RiseTogether today and be part of the future of crowdfunding.
                        </Typography>
                        <Button variant="contained" style={{ marginTop: "10px", backgroundColor: "#ED117F" }} onClick={() => router.push("/explore")}>
                            Explore Campaigns
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <StepsComponent />
            <FeatureThree />
            <FAQ />
        </div>
    )
}

export default DefaultPage
