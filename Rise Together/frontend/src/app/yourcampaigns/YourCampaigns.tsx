"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardMedia, LinearProgress, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useRouter } from 'next/navigation';
import { useContract } from '@/components/ContractProvider';
import FullScreenLoading from '@/components/Loading';
import Web3 from 'web3';

const YourCampaigns = () => {
    const [filter, setFilter] = useState('all');
    const [campaigns, setCampaign] = useState<any>([
        {
            id: 1,
            name: '',
            details: '',
            thumbnailUrl: 'https://via.placeholder.com/150',
            amounts: [0, 0, 0],
            totalFunds: 0,
            whichStage: '',
            stage1Completed: false,
            stage2Completed: false,
            creator: '0',
            adminApproved: true,
            documentsLinks: ['0', '0'],
            campaignExpiry: 1672531200, // Unix timestamp for April 30, 2023, 12:00:00 (GMT)
        },
    ])

    const [loading, setLoading] = useState(false)

    const handleChange = (event: any) => {
        setFilter(event.target.value);
    };

    const { crowdFundindContract, executeContractRead, executeContractWrite } = useContract()

    const { address } = useAccount()

    const handleGetData = async () => {
        try {
            const result: any = (await executeContractRead({
                address: crowdFundindContract.address,
                abi: crowdFundindContract.abi,
                functionName: 'getDataByCreator',
                args: [address]
            }))
            console.log(result)
            setCampaign(result)
            setLoading(false)
        } catch (e) {
            setCampaign([])
            setLoading(false)
            console.error(e)
        }
    }

    const { isConnected } = useAccount()
    const { open } = useWeb3Modal()
    const router = useRouter()

    useEffect(() => {
        async function GetData() {
            try {
                setLoading(true)
                if (!isConnected) return open().finally(() => router.push(`${isConnected ? "/yourcampaigns" : "/"}`))
                handleGetData()
            } catch (e) {
                setLoading(false)
                console.error(e)
            }
        }
        GetData()
    }, [])

    const filteredCampaigns = campaigns.filter((campaign: any) => {
        const currentDate = new Date().getTime() / 1000; // Current time in Unix timestamp
        const expiryDate = campaign.campaignExpiry;

        if (filter === "all") {
            return true;
        }

        if (campaign.stage1Completed && campaign.stage2Completed) {
            // If campaign is completed, only show in 'Completed' filter
            return filter === 'completed';
        } else if (expiryDate < currentDate && !campaign.stage1Completed && !campaign.stage2Completed) {
            // If campaign is expired and not completed, only show in 'Expired' filter
            return filter === 'expired';
        } else if (!campaign.whichStage && !campaign.adminApproved) {
            return filter === 'pendingreview';
        } else if (campaign.whichStage === "Admin Rejected") {
            return filter === 'adminrejected';
        } else if (!campaign.whichStage) {
            return filter === 'notstarted';
        }
        else {
            // Show campaigns in specific stage if selected, excluding completed campaigns
            return campaign.whichStage === filter;
        }
    });

    const CheckStatus = (campaign: any) => {
        const currentDate = new Date().getTime() / 1000; // Current time in Unix timestamp
        const expiryDate = campaign.campaignExpiry;

        if (campaign.stage1Completed && campaign.stage2Completed) {
            // If campaign is completed, only show in 'Completed' filter
            return 'Completed';
        } else if (expiryDate < currentDate && !campaign.stage1Completed && !campaign.stage2Completed) {
            // If campaign is expired and not completed, only show in 'Expired' filter
            return 'Expired';
        } else if (!campaign.whichStage && !campaign.adminApproved) {
            return 'Pending Review';
        } else if (!campaign.whichStage) {
            return 'Not Started';
        }
        else {
            // Show campaigns in specific stage if selected, excluding completed campaigns
            return campaign.whichStage.charAt(0).toUpperCase() + campaign.whichStage.slice(1);

        }
    }

    function formatDateString(dateString: any): string {
        const date = new Date(dateString * 1000);
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        };
        return date.toLocaleString("en-US", options);
    }


    function checkVoting(campaign: any) {
        let stageAmount;
        if (campaign.whichStage === "stage1") {
            stageAmount = campaign.amounts[1];
        } else {
            stageAmount = campaign.amounts[0]; // 5000000000000000000
        }

        if (campaign.totalFunds === stageAmount) return "Voting Started For Current Stage"
        else return "Voting Not Started For Current Stage"
    }

    const initialState = {
        numStage1: 0,
        numStage2: 0,
        numCompleted: 0,
        numExpired: 0,
        numAdminApproved: 0,
        numPending: 0,
        numRejected: 0,
        numBanned: 0
    };

    const [counts, setCounts] = useState(initialState);

    const clearCounts = () => {
        setCounts(initialState);
    };

    useEffect(() => {
        clearCounts()
        const currentDate = new Date().getTime() / 1000; // Current time in Unix timestamp
        campaigns.forEach((campaign: any) => {
            if (campaign.whichStage === 'stage1') {
                setCounts(prev => ({ ...prev, numStage1: prev.numStage1 + 1 }));
            } else if (campaign.whichStage === 'stage2') {
                setCounts(prev => ({ ...prev, numStage2: prev.numStage2 + 1 }));
            }

            if (campaign.stage1Completed && campaign.stage2Completed) {
                setCounts(prev => ({ ...prev, numCompleted: prev.numCompleted + 1 }));
            }

            const expiryDate = Number(campaign.campaignExpiry);
            if (expiryDate < currentDate &&
                !campaign.stage1Completed &&
                !campaign.stage2Completed) {
                setCounts(prev => ({ ...prev, numExpired: prev.numExpired + 1 }));
            }

            if (campaign.adminApproved) {
                setCounts(prev => ({ ...prev, numAdminApproved: prev.numAdminApproved + 1 }));
            }

            if (campaign.whichStage === '' && !campaign.adminApproved) {
                setCounts(prev => ({ ...prev, numPending: prev.numPending + 1 }));
            }
            if (campaign.whichStage === "Admin Rejected") {
                setCounts(prev => ({ ...prev, numRejected: prev.numRejected + 1 }));

            }
            if (campaign.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin")) {
                setCounts(prev => ({ ...prev, numBanned: prev.numBanned + 1 }));
            }
        });
    }, [campaigns])


    return (
        <>
            {!loading ? <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "30px" }}>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', marginRight: '1rem', fontFamily: "sans-serif" }}>Your Campaigns</span>
                    </div>
                    <div>
                        <Link href="/createcampaign" style={{ backgroundColor: '#007bff', color: '#fff', padding: '8px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', fontSize: '1rem', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}>
                            Create Campaign
                        </Link>
                    </div>
                </div>
                <div>
                    <Typography variant="h5" gutterBottom>Campaign Details</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                        <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>Total Campaigns</Typography>
                            <Typography>{campaigns.length}</Typography>
                        </Box>
                        <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>Stage 1 Campaigns</Typography>
                            <Typography>{counts.numStage1}</Typography>
                        </Box>
                        <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>Stage 2 Campaigns</Typography>
                            <Typography>{counts.numStage2}</Typography>
                        </Box>
                        <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>Completed Campaigns</Typography>
                            <Typography>{counts.numCompleted}</Typography>
                        </Box>
                        <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>Expired Campaigns</Typography>
                            <Typography>{counts.numExpired}</Typography>
                        </Box>
                        <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>Admin Approved Campaigns</Typography>
                            <Typography>{counts.numAdminApproved}</Typography>
                        </Box>
                        <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>Pending Review</Typography>
                            <Typography>{counts.numPending}</Typography>
                        </Box>
                        <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>Admin Rejected</Typography>
                            <Typography>{counts.numRejected}</Typography>
                        </Box>
                        <Box sx={{ width: '200px', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <Typography variant="h6" gutterBottom>Campaign Banned (Force Stopped)</Typography>
                            <Typography>{counts.numBanned}</Typography>
                        </Box>
                    </Box>
                </div>

                <div style={{ marginTop: "2rem", marginBottom: "8px" }}>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', marginRight: '1rem', fontFamily: "sans-serif" }}>Campaigns List</span>
                </div>
                <FormControl style={{ margin: '8px', minWidth: '120px', width: '100%' }}>

                    <InputLabel
                        id="filter-label"
                        style={{ marginBottom: '4px', backgroundColor: '#fff', paddingLeft: '4px', paddingRight: '4px' }}
                    >
                        Filter
                    </InputLabel>
                    <Select
                        labelId="filter-label"
                        id="filter-select"
                        value={filter}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="stage1">Stage 1</MenuItem>
                        <MenuItem value="stage2">Stage 2</MenuItem>
                        <MenuItem value="expired">Expired</MenuItem>
                        <MenuItem value="pendingreview">Pending Review</MenuItem>
                        <MenuItem value="notstarted">Not Started</MenuItem>
                        <MenuItem value="adminrejected">Admin Rejected</MenuItem>
                    </Select>
                </FormControl>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {filteredCampaigns.map((campaign: any, index: any) => (
                        <Card sx={{ maxWidth: 400, position: 'relative' }} key={index}>
                            <Typography
                                variant="body2"
                                color="#fff"
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    fontWeight: 'bolder',
                                    backgroundColor: CheckStatus(campaign) === 'Completed' ? 'green' :
                                        CheckStatus(campaign) === 'Expired' ? 'red' : CheckStatus(campaign) === 'Not Started' ? 'orange' : CheckStatus(campaign) === 'Pending Review' ? 'blue' : CheckStatus(campaign) === 'Admin Rejected' ? 'red' : campaign.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin") ? "red" : '#000000',
                                    padding: '4px 8px', // Add padding for better readability
                                    borderRadius: '4px', // Rounded corners
                                }}
                            >
                                {CheckStatus(campaign)}
                            </Typography>
                            <CardMedia
                                component="img"
                                height="140"
                                image={campaign.thumbnailUrl}
                                alt="Campaign Thumbnail"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {campaign.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}>
                                    Details: {campaign.details}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Last Donation Date: {formatDateString(Number(campaign.campaignExpiry))}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Target Amount (stage 1 + stage 2): {Web3.utils.fromWei(Number(campaign.amounts[0]), 'ether')} (ETH)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Contribution Received: {Web3.utils.fromWei(Number(campaign.totalFunds), 'ether')} (ETH)
                                </Typography>

                                <Typography variant="body2" color="text.secondary" mt={2}>
                                    Current Stage Progess:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {campaign.whichStage === "stage1" ?
                                        <>
                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                <LinearProgress variant="determinate" value={(Number(campaign.totalFunds) / Number(campaign.amounts[0])) * 100} />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {(Number(campaign.totalFunds) / Number(campaign.amounts[0])) * 100}%
                                            </Typography>
                                        </>
                                        :
                                        <>
                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                <LinearProgress variant="determinate" value={(Number(campaign.totalFunds) / Number(campaign.amounts[0])) * 100} />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {(Number(campaign.totalFunds) / Number(campaign.amounts[0])) * 100}%
                                            </Typography>
                                        </>
                                    }
                                </Box>
                                <Typography variant="body2" color="text.secondary" mt={2}>
                                    Creator ETH Address: {campaign.creator}
                                </Typography>
                                <Typography variant="body2" style={{ color: campaign.adminApproved ? "green" : "red" }} mt={2}>
                                    Admin Approved: {campaign.adminApproved ? "Yes" : "No"}
                                </Typography>
                                {campaign.whichStage !== "" && <Typography variant="body2" style={{ color: "blue" }} mt={2}>
                                    {checkVoting(campaign)}
                                </Typography>}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Typography variant="body2" style={{ color: "red" }} mt={5}>
                    * If  the campaign is not approved by an admin within 24hrs, it will be removed from the platform after a certain time.
                </Typography>
                <Typography variant="body2" style={{ color: "red" }}>
                    * Stages, including actions like withdrawals and starting votes, are automated and controlled by the admin. As a creator, you do not have access to them.
                </Typography>
            </> : <FullScreenLoading />}
        </>
    );
};

export default YourCampaigns;
