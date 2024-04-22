"use client"

import React, { useEffect, useState } from 'react'
import { Container, Typography, Card, CardContent, CardHeader, Avatar, List, ListItem, ListItemAvatar, ListItemText, Grid, CardMedia, Box, LinearProgress, Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useContract } from '@/components/ContractProvider';
import FullScreenLoading from '@/components/Loading';
import Web3 from 'web3';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { parseEther } from 'viem';


const page = ({ params }: { params: { id: string } }) => {
  const { id } = params
  const [contributorsList, setcontributorsList] = useState<any>(["Contributor 1", "Contributor 2", "Contributor 3"]);
  const [campaignData, setCampaignData] = useState({
    name: "Campaign Name",
    details: "Campaign Details",
    thumbnailUrl: "https://via.placeholder.com/150",
    campaignExpiry: 1650320648,
    documentsLinks: ["Document 1", "Document 2"],
    amounts: [1000, 500, 500],
    totalFunds: 2000,
    status: "Active",
    whichStage: "stage1",
    stage1Completed: true,
    stage2Completed: false,
    creator: "Creator Address",
    adminApproved: true
  })

  const { crowdFundindContract, executeContractRead, executeContractWrite } = useContract()

  const handleGetData = async () => {
    try {
      const result: any = (await executeContractRead({
        address: crowdFundindContract.address,
        abi: crowdFundindContract.abi,
        functionName: 'getBasicCampaignData',
        args: [id],
      }));

      // Set the filtered campaigns
      setCampaignData(result);
      console.log(result)
      setLoading(false)
    } catch (e) {
      console.error(e)
    }
  }

  const getCampaignContributorsList = async () => {
    try {
      const result: any = (await executeContractRead({
        address: crowdFundindContract.address,
        abi: crowdFundindContract.abi,
        functionName: 'getCampaignContributorsList',
        args: [id],
      }));

      // Set the filtered campaigns
      setcontributorsList(result);
      console.log(result)
      setLoading(false)
    } catch (e) {
      console.error(e)
    }
  }

  const { isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function GetData() {
      try {
        if (!isConnected) return open().finally(() => router.push(`${isConnected ? `/campaign/${id}` : "/"}`))
        handleGetData()
        getCampaignContributorsList()
      } catch (e) {
        console.error(e)
      }
    }
    GetData()
  }, [])

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
    } else if (campaignData.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin")) {
      return campaignData.whichStage
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
  const [contributionAmount, setContributionAmount] = useState<any>(0.5);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContributionAmount(event.target.value);
  };

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

  const handleContribute = async () => {
    const amount = parseFloat(contributionAmount);
    if (amount >= 0.1) {
      if (campaignData.whichStage === "") {
        if (!toast.isActive("whichStage")) {
          return toast.info(
            "Campaign starting soon....", {
            position: "bottom-right",
            autoClose: 5000,
            toastId: "whichStage",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
      let stageAmount;
      let convertedAmount = parseEther(`${amount}`)
      if (campaignData.whichStage === "stage1") {
        stageAmount = campaignData.amounts[1];
      } else {
        stageAmount = campaignData.amounts[0]; // 5000000000000000000
      }
      console.log(convertedAmount)
      console.log(stageAmount)
      if (Number(convertedAmount) > Number(stageAmount)) {
        if (!toast.isActive("whichStage")) {
          return toast.info(
            "Amount exceeds the contribution amount", {
            position: "bottom-right",
            autoClose: 5000,
            toastId: "whichStage",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
      if (campaignData.stage1Completed && campaignData.stage2Completed) {
        if (!toast.isActive("Completed")) {
          return toast.error(
            "Campaign all stages completed", {
            position: "bottom-right",
            autoClose: 5000,
            toastId: "Completed",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
      if (checkVoting(campaignData)) {
        if (!toast.isActive("voting")) {
          return toast.error(
            "Current stage donation is over and voting started", {
            position: "bottom-right",
            autoClose: 5000,
            toastId: "voting",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
      const currentDate = new Date().getTime() / 1000; // Current time in Unix timestamp
      const expiryDate = Number(campaignData.campaignExpiry);
      if (expiryDate < currentDate) {
        if (!toast.isActive("expired")) {
          return toast.error(
            "Campaign expired before completion of donation", {
            position: "bottom-right",
            autoClose: 5000,
            toastId: "expired",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
      

      if (campaignData.whichStage === "Admin Rejected" || campaignData.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin") || !campaignData.adminApproved) {
        if (!toast.isActive("admin")) {
          return toast.error(
            "Campaign is not approved by admin", {
            position: "bottom-right",
            autoClose: 5000,
            toastId: "admin",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }
      if (!isConnected) return open()

      setLoading(true)
      try {
        const [result, hash] = await executeContractWrite({
          address: crowdFundindContract.address,
          abi: crowdFundindContract.abi,
          functionName: 'contribute',
          value: contributionAmount,
          args: [id],
        })
        console.log(result, hash)
        toast.success(
          "Thank you for your donation", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        router.push("/yourcontribution")
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error)
      }

    } else {
      if (!toast.isActive("Contribution")) {
        toast.error(
          "Contribution amount must be more than 0.1 ETH", {
          position: "bottom-right",
          autoClose: 5000,
          toastId: "Contribution",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }

  return (
    <> {!loading ?
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Hero section */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: "100%" }}>
              {campaignData.whichStage === "stage1" ?
                <>
                  <Typography variant="body2" color="text.secondary" className='textWrap'>
                    {Web3.utils.fromWei((Number(campaignData.amounts[0]) - Number(campaignData.totalFunds)), 'ether')} ETH Left
                  </Typography>
                  <Box sx={{ width: '100%', mr: 1, ml: 1 }}>
                    <LinearProgress sx={{ height: 10 }} color="success"
                      variant="determinate" value={(Number(campaignData.totalFunds) / Number(campaignData.amounts[0])) * 100} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" style={{ width: "" }} className='textWrap'>
                    {(Number(campaignData.totalFunds) / Number(campaignData.amounts[0])) * 100}% completed
                  </Typography>
                </>
                :
                <>
                  <Typography variant="body2" color="text.secondary" className='textWrap'>
                    {Web3.utils.fromWei((Number(campaignData.amounts[0]) - Number(campaignData.totalFunds)), 'ether')} ETH Left
                  </Typography>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress sx={{ height: 10 }}
                      variant="determinate" value={(Number(campaignData.totalFunds) / Number(campaignData.amounts[0])) * 100} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {(Number(campaignData.totalFunds) / Number(campaignData.amounts[0])) * 100}%
                  </Typography>
                </>
              }
            </Box>
            <Card sx={{ position: 'relative', mt: 2 }}>
              <Typography
                variant="body2"
                color="#fff"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  fontWeight: 'bolder',
                  backgroundColor: CheckStatus(campaignData) === 'Completed' ? 'green' :
                    CheckStatus(campaignData) === 'Expired' ? 'red' : CheckStatus(campaignData) === 'Not Started' ? 'orange' : CheckStatus(campaignData) === 'Admin Rejected' ? 'red' : CheckStatus(campaignData) === 'Pending Review' ? "red" : campaignData.whichStage.includes("Forced Stopped and Collected Money Refunded by Admin") ? "red" : '#000000',
                  padding: '4px 8px', // Add padding for better readability
                  borderRadius: '4px', // Rounded corners
                }}
              >
                {CheckStatus(campaignData)}
              </Typography>
              <CardMedia
                component="img"
                height="400"
                image={campaignData?.thumbnailUrl || "https://via.placeholder.com/800x400"}
                alt={campaignData.name}
              />
              <CardHeader
                title={campaignData.name}
                subheader={campaignData.details}
              />
              {(!campaignData.stage1Completed || !campaignData.stage2Completed) && <CardContent style={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  label="Amount (ETH)"
                  variant="outlined"
                  value={contributionAmount}
                  onChange={handleAmountChange}
                />
                <Button variant="contained" style={{ color: "#fff", backgroundColor: "green", marginTop: "5px" }} onClick={handleContribute}>
                  Contribute
                </Button>
                <Typography variant="body2" color="error" style={{ marginTop: '5px' }}>
                  Contribution amount must be more than 0.1 ETH
                </Typography>
              </CardContent>}
            </Card>
          </Grid>
          {/* Details section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Deatils
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {campaignData.details}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Campaign Expiry: {new Date(Number(campaignData.campaignExpiry) * 1000).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Creator: {campaignData.creator}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <div style={{ display: "flex", width: "100%", paddingTop: "32px", paddingLeft: "32px" }}>
            {/* Funds Details section */}
            <Grid item xs={12} width={"50%"} minHeight={"150px"}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Funds Details
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Target Amount: {Web3.utils.fromWei(Number(campaignData.amounts[0]), 'ether')} ETH - ({(Number(campaignData.totalFunds) / Number(campaignData.amounts[0])) * 100}% Collected)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Stage 1: {Web3.utils.fromWei(Number(campaignData.amounts[1]), 'ether')} ETH - ({campaignData.stage1Completed ? 100 : ((Number(campaignData.totalFunds) / Number(campaignData.amounts[1])) * 100)}% Collected)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Stage 2: {Web3.utils.fromWei(Number(campaignData.amounts[2]), 'ether')} ETH - ({!campaignData.stage2Completed ? 0 : (((Number(campaignData.totalFunds) - Number(campaignData.amounts[1])) / Number(campaignData.amounts[2])) * 100)}% Collected)
                  </Typography>
                  {/* Add details about funds here */}
                </CardContent>
              </Card>
            </Grid>
            {/* Stage Details section */}
            <Grid item xs={12} width={"50%"} style={{ marginLeft: "15px" }}>
              <Card>
                <CardContent >
                  <Typography variant="h5" gutterBottom>
                    Stage Details
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Stage 1 Completed: {campaignData.stage1Completed ? "YES" : "NO"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Stage 2 Completed: {campaignData.stage1Completed ? "YES" : "NO"}
                  </Typography>
                  {/* Add details about campaign stages here */}
                </CardContent>
              </Card>
            </Grid>
          </div>
          {/* Documents section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Documents
                </Typography>
                <List>
                  {campaignData.documentsLinks.map((document, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar>{index + 1}</Avatar>
                      </ListItemAvatar>
                      <Link href={document} target="_blank" style={{ cursor: "pointer" }}>
                        <ListItemText primary={`${document}`} />
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          {/* Contributors section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Contributors
                </Typography>
                <List>
                  {contributorsList.map((contributor: any, index: any) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar>{index + 1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={contributor} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container> : <FullScreenLoading />}
    </>
  )
}

export default page