"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardMedia, LinearProgress, Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useRouter } from 'next/navigation';
import { useContract } from '@/components/ContractProvider';
import FullScreenLoading from '@/components/Loading';
import Web3 from 'web3';

const Admin = () => {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
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

    function checkVoting(campaign: any) {
        let stageAmount;
        if (campaign.whichStage === "stage1") {
            stageAmount = campaign.amounts[1];
        } else {
            stageAmount = campaign.amounts[0]; // 5000000000000000000
        }

        console.log(Math.ceil((Number(campaign.contributorData.numberOfContributors) * 0.5) - (Number(campaign.contributorData.votedFor) + Number(campaign.contributorData.votedAgainst))) <= (Number(campaign.contributorData.votedFor) + Number(campaign.contributorData.votedAgainst)));
        console.log(Math.ceil((Number(campaign.contributorData.numberOfContributors) * 0.5) - (Number(campaign.contributorData.votedFor) + Number(campaign.contributorData.votedAgainst))));
        console.log((Number(campaign.contributorData.votedFor) + Number(campaign.contributorData.votedAgainst)));
        if (campaign.totalFunds === stageAmount) {
            if (Math.ceil((Number(campaign.contributorData.numberOfContributors) * 0.5) - (Number(campaign.contributorData.votedFor) + Number(campaign.contributorData.votedAgainst))) <= (Number(campaign.contributorData.votedFor) + Number(campaign.contributorData.votedAgainst))) {
                return true
            }
        }
        return false;
    }

    const handleGetData = async () => {
        try {
            const result: any = (await executeContractRead({
                address: crowdFundindContract.address,
                abi: crowdFundindContract.abi,
                functionName: 'getData',
                args: []
            }));

            const UpdatedResult = await Promise.all(result.map(async (campaign: any) => {
                let updatedCampaign = { ...campaign }; // Create a copy of the campaign object

                // Filter conditions remain the same

                // Make a call to getCampaignsByContributor for each campaign index
                let contributorData: any = await executeContractRead({
                    address: crowdFundindContract.address,
                    abi: crowdFundindContract.abi,
                    functionName: 'getCampaignsByContributor',
                    args: [address, campaign.id] // Assuming campaign id is used as index
                });

                // Append contributor data to the campaign object
                updatedCampaign.contributorData = contributorData[0];

                return updatedCampaign;
            }));

            console.log(UpdatedResult)

            const filteredResult = UpdatedResult.filter((campaign: any) => {
                return (
                    !campaign.adminApproved ||
                    (campaign.adminApproved && campaign.whichStage === "") ||
                    (campaign.adminApproved && campaign.whichStage === "stage1" && (campaign.totalFunds === campaign.amounts[1] && !campaign.stage1Completed && checkVoting(campaign))) ||
                    (campaign.adminApproved && campaign.whichStage === "stage1" && campaign.stage1Completed) ||
                    (campaign.adminApproved && campaign.whichStage === "stage2" && (campaign.totalFunds === campaign.amounts[0] && !campaign.stage2Completed && checkVoting(campaign)))
                );
            });

            console.log(filteredResult);
            setCampaign(filteredResult.reverse());
            setLoading(false);
        } catch (e) {
            setCampaign([]);
            setLoading(false);
            console.error(e);
        }
    };


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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredCampaigns = campaigns.filter((campaign: any) => {
        if (searchQuery === '') {
            return true; // If search query is empty, return all campaigns
        } else {
            // Check if campaign name or details contain the search query
            return campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) || campaign.details.toLowerCase().includes(searchQuery.toLowerCase());
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


    const approveCampaign = async (campaign: any) => {
        const result = window.confirm("Are you sure about listing this campaign?")
        if (result) {
            setLoading(true)
            const result: any = (await executeContractWrite({
                address: crowdFundindContract.address,
                abi: crowdFundindContract.abi,
                functionName: 'approveCampaign',
                args: [campaign.id]
            }))
            console.log(result)
            await handleGetData()
            setLoading(false)
        }
    }

    const rejectCampaign = async (campaign: any) => {
        const result = window.confirm(`Are you sure about rejecting the campaign?`)
        if (result) {
            console.log(campaign.id)
            setLoading(true)
            const result: any = (await executeContractWrite({
                address: crowdFundindContract.address,
                abi: crowdFundindContract.abi,
                functionName: 'rejectCampaign',
                args: [campaign.id]
            }))
            console.log(result)
            await handleGetData()
            setLoading(false)
        }
    }

    const startStage = async (campaign: any) => {
        const result = window.confirm(`Are you sure about starting ${campaign.whichStage}?`)
        if (result) {
            setLoading(true)

            const result: any = (await executeContractWrite({
                address: crowdFundindContract.address,
                abi: crowdFundindContract.abi,
                functionName: 'startStage',
                args: [campaign.id]
            }))
            console.log(result)
            await handleGetData()
            setLoading(false)
        }
    }

    const endStageVoting = async (campaign: any) => {
        const result = window.confirm(`Are you sure about ending ${campaign.whichStage} and send money to creator?`)
        if (result) {
            setLoading(true)

            const result: any = (await executeContractWrite({
                address: crowdFundindContract.address,
                abi: crowdFundindContract.abi,
                functionName: 'endStageVoting',
                args: [campaign.id]
            }))
            console.log(result)
            await handleGetData()
            setLoading(false)

        }
    }

    const withdrawPlatformFee = async () => {
        setLoading(true)
        const result: any = (await executeContractWrite({
            address: crowdFundindContract.address,
            abi: crowdFundindContract.abi,
            functionName: 'withdrawPlatformFee',
            args: []
        }))
        console.log(result)
        await handleGetData()
        setLoading(false)
    }

    const renderButtons = (campaign: any) => {
        if (!campaign.adminApproved) {
            return (
                <>
                    <Button variant="contained" color="primary" style={{ width: "100%", backgroundColor: "green" }} onClick={() => approveCampaign(campaign)}>
                        Approve Campaign
                    </Button>
                    <Button variant="contained" color="primary" style={{ width: "100%", backgroundColor: "red", marginTop: "10px" }} onClick={() => rejectCampaign(campaign)}>
                        Reject Campaign
                    </Button>
                </>
            )
        } else if (campaign.stage1Completed && campaign.stage2Completed) {
            return (
                <>
                    <Button variant="contained" color="primary" style={{ width: "100%", backgroundColor: "green", color: "#fff" }} disabled>
                        Campaign Completed
                    </Button>
                </>
            )
        } else if (campaign.adminApproved && campaign.whichStage === "") {
            return (
                <>
                    <Button variant="contained" color="primary" style={{ width: "100%", backgroundColor: "green" }} onClick={() => startStage(campaign)}>
                        Begin Stage 1
                    </Button>
                </>
            )
        } else if (campaign.adminApproved && (campaign.whichStage === "stage1" && (campaign.totalFunds === campaign.amounts[1] && !campaign.stage1Completed))) {
            return (
                <>
                    <Button variant="contained" color="primary" style={{ width: "100%", backgroundColor: "green" }} onClick={() => endStageVoting(campaign)}>
                        End Stage 1
                    </Button>
                </>
            )
        } else if (campaign.adminApproved && (campaign.whichStage === "stage1" && campaign.stage1Completed)) {
            return (
                <>
                    <Button variant="contained" color="primary" style={{ width: "100%", backgroundColor: "green" }} onClick={() => startStage(campaign)}>
                        Begin Stage 2
                    </Button>
                </>
            )
        } else if (campaign.adminApproved && (campaign.whichStage === "stage2" && (campaign.totalFunds === campaign.amounts[0] && !campaign.stage2Completed))) {
            return (
                <>
                    <Button variant="contained" color="primary" style={{ width: "100%", backgroundColor: "green" }} onClick={() => endStageVoting(campaign)}>
                        End Stage 2
                    </Button>
                </>
            )
        }
    }


    return (
        <>
            {!loading ? <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "30px" }}>
                    <div>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold', marginRight: '1rem', fontFamily: "sans-serif" }}>Admin Panel</span>
                    </div>
                    <div>
                        <Button onClick={withdrawPlatformFee} style={{ backgroundColor: '#007bff', color: '#fff', padding: '8px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', fontSize: '1rem', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}>
                            Withdraw Platoform Fees
                        </Button>
                    </div>
                </div>

                <div style={{ marginTop: "2rem", marginBottom: "8px" }}>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', marginRight: '1rem', fontFamily: "sans-serif" }}>Actions Required Campaigns List</span>
                </div>
                <TextField
                    id="search"
                    label="Search Campaigns"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ margin: '8px', width: '100%' }}
                />

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

                                {!campaign.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin") && <><Typography variant="body2" color="text.secondary" mt={2}>
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
                                    </Box></>}
                                <Typography variant="body2" color="text.secondary" mt={2}>
                                    Creator ETH Address: {campaign.creator}
                                </Typography>
                            </CardContent>
                            <Button variant="contained" color="primary" style={{ marginBottom: "20px", width: "100%" }}>
                                <Link href={`/campaign/${campaign.id}`} passHref target='_blank'>
                                    Visit Campaign
                                </Link>
                            </Button>
                            {renderButtons(campaign)}
                        </Card>
                    ))}
                </div>
            </> : <FullScreenLoading />}
        </>
    );
};

export default Admin;
