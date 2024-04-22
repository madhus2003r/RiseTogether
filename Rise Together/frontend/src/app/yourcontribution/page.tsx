"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardMedia, LinearProgress, Box, FormControl, InputLabel, Select, MenuItem, Grid, Button } from '@mui/material';
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
            const userCampaignIndices: any = await executeContractRead({
                address: crowdFundindContract.address,
                abi: crowdFundindContract.abi,
                functionName: 'getUserCampaignIndices',
                args: [address]
            });
            if (userCampaignIndices.length === 0) {
                // No campaigns found for the user
                setLoading(false);
                setCampaign([]);
                return;
            }

            const uniqueIndices = Array.from(new Set(userCampaignIndices.map((n: bigint) => Number(n))));


            let campaignData = [];

            // Loop through each campaign index
            for (let i = 0; i < uniqueIndices.length; i++) {
                const campaignIndex = uniqueIndices[i];

                // Fetch basic campaign data
                let basicCampaignData: any = await executeContractRead({
                    address: crowdFundindContract.address,
                    abi: crowdFundindContract.abi,
                    functionName: 'getBasicCampaignData',
                    args: [campaignIndex]
                });

                // Fetch contributor data for the campaign
                let contributorData: any = await executeContractRead({
                    address: crowdFundindContract.address,
                    abi: crowdFundindContract.abi,
                    functionName: 'getCampaignsByContributor',
                    args: [address, campaignIndex]
                });

                // Merge basic campaign data and contributor data
                let mergedCampaignData: any = { ...basicCampaignData, details: contributorData[0], id: campaignIndex };

                // Add merged campaign data to the array
                campaignData.push(mergedCampaignData);
            }

            console.log(campaignData);
            // Set the campaign data
            setCampaign(campaignData.reverse());
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setCampaign([]);
            console.error(e);
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

        if (campaign.totalFunds === stageAmount) return true
        else return false
    }

    const voteForContribution = async (index: any, vote: any) => {
        try {
            setLoading(true)
            const [result, hash] = await executeContractWrite({
                address: crowdFundindContract.address,
                abi: crowdFundindContract.abi,
                functionName: 'voteForStage',
                args: [index, vote],
            })
            await handleGetData()
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <>
            {!loading ? <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "30px" }}>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', marginRight: '1rem', fontFamily: "sans-serif" }}>Your Contributions</span>
                    </div>
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
                                        CheckStatus(campaign) === 'Expired' ? 'red' : CheckStatus(campaign) === 'Not Started' ? 'orange' : CheckStatus(campaign) === 'Pending Review' ? 'red' : campaign.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin") ? "red" : '#000000',
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
                                <Grid container spacing={2} justifyContent="end">
                                    <Grid item>
                                        <Button variant="contained" color="primary">
                                            <Link href={`/campaign/${campaign.id}`} passHref>
                                                Visit Campaign
                                            </Link>
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Typography gutterBottom variant="h5" component="div">
                                    {campaign.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Target Amount (stage 1 + stage 2): {Web3.utils.fromWei(Number(campaign.amounts[0]), 'ether')} (ETH)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Target Amount (stage 1): {Web3.utils.fromWei(Number(campaign.amounts[1]), 'ether')} (ETH)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Target Amount (stage 2): {Web3.utils.fromWei(Number(campaign.amounts[2]), 'ether')} (ETH)
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Total Contribution Received: {Web3.utils.fromWei(Number(campaign.totalFunds), 'ether')} (ETH)
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mt={2}>
                                    Creator ETH Address: {campaign.creator}
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
                                {/* {campaign.whichStage !== "" &&
                                    <Typography variant="body2" style={{ color: "blue" }} mt={2}>
                                        {checkVoting(campaign)}
                                    </Typography>
                                } */}
                                {(!campaign.stage1Completed || !campaign.stage2Completed) && <>
                                    {checkVoting(campaign) === true ?
                                        <>
                                            {!campaign.details.voted ?
                                                <>
                                                    <Grid container spacing={2} justifyContent="center" mt={1}>
                                                        <Grid item>
                                                            <Button variant="contained" color="success" style={{ color: "white" }} onClick={() => voteForContribution(campaign.id, true)}>
                                                                Approve ({(Number(campaign.details.votedFor) / (Number(campaign.details.votedFor) + Number(campaign.details.votedAgainst))) || 0 * 100}%)
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button variant="contained" color="error" onClick={() => voteForContribution(campaign.id, false)}>
                                                                Reject ({(Number(campaign.details.votedFor) / (Number(campaign.details.votedAgainst) + Number(campaign.details.votedAgainst))) || 0 * 100}%)
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" mt={2}>
                                                            {Number(campaign.details.votedFor) + Number(campaign.details.votedAgainst)} contributor voted out of {Number(campaign.details.numberOfContributors)}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {Number(campaign.details.votedFor)} contributors approved
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {Number(campaign.details.votedAgainst)} contributors rejected
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                                            Required votes for decision: {Math.ceil((Number(campaign.details.numberOfContributors) * 0.5) - (Number(campaign.details.votedFor) + Number(campaign.details.votedAgainst)))}
                                                        </Typography>
                                                    </Box>
                                                </>
                                                :
                                                <>
                                                    <Grid container spacing={2} justifyContent="center" mt={1}>
                                                        <Grid item>
                                                            <Button variant="contained" color="success" style={{ color: "white" }} disabled>
                                                                Already Voted
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" mt={2}>
                                                            {Number(campaign.details.votedFor) + Number(campaign.details.votedAgainst)} contributor voted out of {Number(campaign.details.numberOfContributors)}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {Number(campaign.details.votedFor)} contributors approved
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {Number(campaign.details.votedAgainst)} contributors rejected
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                                            Required votes for decision: {Math.ceil((Number(campaign.details.numberOfContributors) * 0.5) - (Number(campaign.details.votedFor) + Number(campaign.details.votedAgainst)))}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <Typography variant="body2" style={{ color: "blue", textAlign: "center" }} mt={2}>
                                                Voting Not Started
                                            </Typography>
                                        </>
                                    }
                                    {(Number(campaign.details.stage1donation) > 0 && Number(campaign.details.stage2donation) === 0) && <Typography variant="body2" color="text.secondary" mt={1}>
                                        You are stage 1 contributor in this campaign
                                    </Typography>}
                                    {(Number(campaign.details.stage2donation) > 0 && Number(campaign.details.stage1donation) == 0) && <Typography variant="body2" color="text.secondary" mt={1}>
                                        You are stage 2 contributor in this campaign
                                    </Typography>}
                                    {(Number(campaign.details.stage2donation) > 0 && Number(campaign.details.stage1donation) > 0) && <Typography variant="body2" color="text.secondary" mt={1}>
                                        You are stage 1 and stage 2 contributor in this campaign
                                    </Typography>}
                                </>}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Typography variant="body2" style={{ color: "red" }} mt={5}>
                    * If the campaign expires, any donations made at that stage will be sent to your wallet.
                </Typography>
                <Typography variant="body2" style={{ color: "red" }}>
                    * If the campaign is rejected by voters, any donations made at that stage will be sent to your wallet.
                </Typography>
            </> : <FullScreenLoading />}
        </>
    );
};

export default YourCampaigns;
