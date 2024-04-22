"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardMedia, LinearProgress, Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

import { useContract } from '@/components/ContractProvider'
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Web3 from 'web3';

const CampaignCard = () => {
    // State for filters and search
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // State for campaigns
    const [campaigns, setCampaigns] = useState([
        {
            id: 1,
            name: 'gfdsgdfsgdfsgsdfgdsffdsafdsafsadfasdf gdsfgdsfgdsfg dsfgdfsgdfsgd fsgdsfgdsfgd fdsfasfasfasd',
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
            campaignExpiry: 1972531200, // Unix timestamp for April 30, 2023, 12:00:00 (GMT)
        },
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
    ]);

    // Contract functions
    const { crowdFundindContract, executeContractRead, executeContractWrite } = useContract();

    // Web3 modal and account
    const { isConnected } = useAccount();
    const { open } = useWeb3Modal();
    const router = useRouter();

    // Fetch campaigns on component mount
    useEffect(() => {
        async function fetchData() {
            try {
                if (!isConnected) {
                    await open();
                    router.push(isConnected ? '/explore' : '/');
                } else {
                    await handleGetData();
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchData();
    }, []);

    // Function to fetch data from contract
    const handleGetData = async () => {
        try {
            const result: any = await executeContractRead({
                address: crowdFundindContract.address,
                abi: crowdFundindContract.abi,
                functionName: 'getData',
                args: [],
            });

            // Filter out campaigns based on conditions
            const filteredCampaigns = result.filter((campaign: any) => {
                return campaign.whichStage || campaign.adminApproved;
            });

            const adminRejectedCampaigns = filteredCampaigns.filter((campaign: any) => {
                return campaign.whichStage !== 'Admin Rejected';
            });

            // Set the filtered campaigns
            setCampaigns(adminRejectedCampaigns.reverse());
        } catch (e) {
            console.error(e);
        }
    };

    // Function to handle filter change
    const handleChange = (event: any) => {
        setFilter(event.target.value);
    };

    // Function to handle search input change
    const handleSearchChange = (event: any) => {
        setSearchQuery(event.target.value);
    };

    // Function to format date string
    const formatDateString = (dateString: any) => {
        const currentDate = new Date();
        const expiryDate = new Date(dateString * 1000);
        const timeDifference = expiryDate.getTime() - currentDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

        if (daysDifference > 0) {
            return `${daysDifference} day${daysDifference === 1 ? '' : 's'} left`;
        } else if (daysDifference === 0) {
            return 'Today';
        } else {
            return 'Expired';
        }
    };

    // Function to check campaign status
    const CheckStatus = (campaign: any) => {
        const currentDate = new Date().getTime() / 1000;
        const expiryDate = campaign.campaignExpiry;

        if (campaign.stage1Completed && campaign.stage2Completed) {
            return 'Completed';
        } else if (expiryDate < currentDate && !campaign.stage1Completed && !campaign.stage2Completed) {
            return 'Expired';
        } else if (!campaign.whichStage && !campaign.adminApproved) {
            return 'Pending Review';
        } else if (!campaign.whichStage) {
            return 'Not Started';
        } else {
            return campaign.whichStage.charAt(0).toUpperCase() + campaign.whichStage.slice(1);
        }
    };

    // Filter campaigns based on filter and search conditions
    const filteredCampaigns = campaigns.filter((campaign) => {
        const currentDate = new Date().getTime() / 1000;
        const expiryDate = campaign.campaignExpiry;

        const filterCondition =
            filter === 'all' ||
            (filter === 'completed' && campaign.stage1Completed && campaign.stage2Completed) ||
            (filter === 'expired' && expiryDate < currentDate && !campaign.stage1Completed && !campaign.stage2Completed) ||
            (filter === 'pendingreview' && !campaign.whichStage && !campaign.adminApproved) ||
            (filter === 'adminrejected' && campaign.whichStage === 'Admin Rejected') ||
            (filter === 'notstarted' && !campaign.whichStage) ||
            (filter === 'stopped' && campaign.whichStage.includes('Forced Stopped and Collected Money Refunded by Admin')) ||
            campaign.whichStage === filter;

        const searchCondition =
            searchQuery === '' ||
            campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.details.toLowerCase().includes(searchQuery.toLowerCase());

        return filterCondition && searchCondition;
    });

    return (
        <div >
            {/* Filter and search section */}
            <div>
                <TextField
                    id="search"
                    label="Search Campaigns"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ margin: '8px', width: '100%' }}
                />
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: "30%" }}>
                    {isConnected ? (
                        <>
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
                                    <MenuItem value="notstarted">Not Started</MenuItem>
                                    <MenuItem value="stage1">Stage 1</MenuItem>
                                    <MenuItem value="stage2">Stage 2</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="expired">Expired</MenuItem>
                                    <MenuItem value="stopped">Admin Banned</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    ) : (
                        <Typography variant="body1">Please connect your wallet</Typography>
                    )}
                </div>

                {/* Campaign cards section */}
                {filteredCampaigns.length > 0 ?
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: "100%" }}>
                        {filteredCampaigns.map((campaign, index) => (
                            <Link href={`/campaign/${campaign.id}`} key={index} style={{ textDecoration: 'none', minHeight: "320px" }}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { xs: 'column', md: 'row' },
                                        // justifyContent: 'space-between',
                                        // alignItems: 'center',
                                        position: 'relative',
                                        cursor: 'pointer',
                                        overflow: 'hidden', // Hide overflow to prevent border from affecting layout
                                    }}
                                >
                                    <div style={{ width: "30%",backgroundColor: "gray", display: "flex", alignItems: "center", justifyItems: "center" }}>
                                        {/* Card Media (Image) */}
                                        <CardMedia component="img" image={campaign.thumbnailUrl} alt="Campaign Thumbnail" style={{ objectFit: "contain" }} />
                                    </div>
                                    {/* Card Content */}
                                    <CardContent style={{ width: "50%" }}>
                                        {/* Status Badge */}
                                        <Typography
                                            variant="body2"
                                            color="#fff"
                                            sx={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                fontWeight: 'bolder',
                                                backgroundColor:
                                                    CheckStatus(campaign) === 'Completed'
                                                        ? 'green'
                                                        : CheckStatus(campaign) === 'Expired'
                                                            ? 'red'
                                                            : CheckStatus(campaign) === 'Not Started'
                                                                ? 'orange'
                                                                : CheckStatus(campaign) === 'Pending Review'
                                                                    ? 'red'
                                                                    : campaign.whichStage.includes('Forced Stopped and Collected Money Refunded by Admin')
                                                                        ? 'red'
                                                                        : '#000000',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            {CheckStatus(campaign)}
                                        </Typography>


                                        {CheckStatus(campaign) !== 'Expired' && <Typography
                                            variant="body2"
                                            color="#fff"
                                            sx={{
                                                position: 'absolute',
                                                bottom: '8px',
                                                right: '8px',
                                                fontWeight: 'bolder',
                                                backgroundColor: 'green',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            {formatDateString(Number(campaign.campaignExpiry))}
                                        </Typography>}

                                        {/* Campaign Details */}
                                        <Typography variant="h6" gutterBottom mt={4}>
                                            {campaign.name || "Test"}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            Details: {campaign.details ? campaign.details.split(' ').slice(0, 15).join(' ') : 'No details available'}
                                            {campaign.details && campaign.details.split(' ').length > 15 ? '...' : ''}
                                        </Typography>
                                        {/* <Typography variant="body2" color="text.secondary">
                                            Target Amount: {Web3.utils.fromWei(Number(campaign.amounts[0]), 'ether')} (ETH)
                                        </Typography> */}
                                        {/* <Typography variant="body2" color="text.secondary">
                                            Target Amount (stage 1): {Web3.utils.fromWei(Number(campaign.amounts[1]), 'ether')} (ETH)
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Target Amount (stage 2): {Web3.utils.fromWei(Number(campaign.amounts[2]), 'ether')} (ETH)
                                        </Typography> */}


                                        {/* Total Contribution */}
                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                            Total Contribution Received: {Web3.utils.fromWei(Number(campaign.totalFunds), 'ether')} out of {Web3.utils.fromWei(Number(campaign.amounts[0]), 'ether')} (ETH)
                                        </Typography>

                                        {/* Creator Address */}
                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                            Creator ETH Address: {campaign.creator}
                                        </Typography>

                                        {/* Progress Bar */}
                                        <Typography variant="body2" color="text.secondary" mt={1}>
                                            Current Stage Progress:
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(Number(campaign.totalFunds) / Number(campaign.amounts[0])) * 100}
                                            sx={{ width: '100%' }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {(Number(campaign.totalFunds) / Number(campaign.amounts[0])) * 100}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div> : <div>No campaign found</div>}
            </div>

        </div>
    );
};

export default CampaignCard;
