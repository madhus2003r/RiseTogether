"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardMedia, LinearProgress, Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid } from '@mui/material';
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
      contributorData: {
        votedFor: 0,
        votedAgainst: 0,
        numberOfContributors: 0,
        voted: false
      }
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
        functionName: 'getData',
        args: []
      }))
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
      setCampaign(UpdatedResult.reverse())
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredCampaigns = campaigns.filter((campaign: any) => {
    const currentDate = new Date().getTime() / 1000; // Current time in Unix timestamp
    const expiryDate = campaign.campaignExpiry;

    // Check if the campaign matches the filter
    const filterCondition =
      filter === 'all' ||
      (filter === 'completed' && campaign.stage1Completed && campaign.stage2Completed) ||
      (filter === 'expired' && expiryDate < currentDate && !campaign.stage1Completed && !campaign.stage2Completed) ||
      (filter === 'pendingreview' && !campaign.whichStage && !campaign.adminApproved) ||
      (filter === 'adminrejected' && campaign.whichStage === 'Admin Rejected') ||
      (filter === 'notstarted' && !campaign.whichStage) ||
      (filter === 'stopped' && campaign.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin")) ||
      campaign.whichStage === filter;

    // Check if the campaign matches the search query
    const searchCondition =
      searchQuery === '' || // Return true if search query is empty
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Check if campaign name matches search query
      campaign.creator.toLowerCase().includes(searchQuery.toLowerCase()) || // Check if campaign name matches search query
      campaign.details.toLowerCase().includes(searchQuery.toLowerCase()); // Check if campaign details match search query

    // Return true only if both filter and search conditions are met
    return filterCondition && searchCondition;
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

  const forceStop = async (campaign: any) => {
    const result = window.confirm("Froce Stopped campaign can't be started again")
    if (result) {
      console.log(campaign.id)
      const result: any = (await executeContractWrite({
        address: crowdFundindContract.address,
        abi: crowdFundindContract.abi,
        functionName: 'froceStopCampaign',
        args: [Number(campaign.id)]
      }))
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
      router.refresh()
    }
  }


  return (
    <>
      {!loading ? <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "30px" }}>
          <div>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', marginRight: '1rem', fontFamily: "sans-serif" }}>Admin Panel</span>
          </div>
        </div>
        <div>
          <Typography variant="h5" gutterBottom>All Campaigns Details</Typography>
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
        <TextField
          id="search"
          label="Search Campaigns"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ margin: '8px', width: '100%' }}
        />
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
            <MenuItem value="stopped">Stopped</MenuItem>
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
                {!campaign.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin") && <Typography variant="body2" style={{ color: campaign.adminApproved ? "green" : "red" }} mt={2}>
                  Admin Approved: {campaign.adminApproved ? "Yes" : "No"}
                </Typography>}
                {(!campaign.stage1Completed || !campaign.stage2Completed) &&
                  <>
                    {!campaign.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin") && <Box>
                      <Typography variant="body2" color="text.secondary" mt={2}>
                        {Number(campaign.contributorData.votedFor) + Number(campaign.contributorData.votedAgainst)} contributor voted out of {Number(campaign.contributorData
                          .numberOfContributors)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Number(campaign.contributorData
                          .votedFor)} contributors approved
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Number(campaign.contributorData
                          .votedAgainst)} contributors rejected
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Required votes for decision: {Math.ceil((Number(campaign.contributorData
                          .numberOfContributors) * 0.5) - (Number(campaign.contributorData
                            .votedFor) + Number(campaign.contributorData
                              .votedAgainst)))}
                      </Typography>
                    </Box>}
                  </>
                }
              </CardContent>

              <Button variant="contained" color="primary" style={{ marginBottom: "20px", width: "100%" }}>
                <Link href={`/campaign/${campaign.id}`} passHref target='_blank'>
                  Visit Campaign
                </Link>
              </Button>
              {(!campaign.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin") && (!campaign.stage1Completed || !campaign.stage2Completed)) &&
                <>
                  {(campaign.whichStage === "stage1" && !campaign.stage1Completed) &&
                    <Button variant="contained" color="primary" style={{ width: "100%", backgroundColor: "red" }} onClick={() => forceStop(campaign)}>
                      Force Stop
                    </Button>
                  }
                  {(campaign.whichStage === "stage2" && !campaign.stage2Completed) &&
                    <Button variant="contained" color="primary" style={{ width: "100%", backgroundColor: "red" }} onClick={() => forceStop(campaign)}>
                      Force Stop
                    </Button>
                  }
                </>
              }
            </Card>
          ))}
        </div>
      </> : <FullScreenLoading />}
    </>
  );
};

export default Admin;
