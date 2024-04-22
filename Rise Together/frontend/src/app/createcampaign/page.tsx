"use client"

import { useContract } from '@/components/ContractProvider';
import FullScreenLoading from '@/components/Loading';
import { Button, Typography, Box } from '@mui/material';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

const CreateCampaignForm = () => {
  const [formData, setFormData] = useState<any>({
    name: '',
    details: '',
    thumbnailUrl: '',
    targetAmount: 0,
    stage1Amount: 0,
    stage2Amount: 0,
    documentsLinks: [""],
    campaignExpiryDate: '',
  });

  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddItem = (name: any) => {
    setFormData({ ...formData, [name]: [...formData[name], ""] });
  };

  const handleRemoveItem = (name: any, index: any) => {
    const updatedItems = [...formData[name]];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, [name]: updatedItems });
  };

  const [error, setError] = useState('');

  const handleItemChange = (name: any, index: any, value: any) => {
    const updatedItems = [...formData[name]];
    updatedItems[index] = value;
    setFormData({ ...formData, [name]: updatedItems });
  };

  const { crowdFundindContract, executeContractRead, executeContractWrite } = useContract()
  const { isConnected } = useAccount()
  const { open } = useWeb3Modal()

  const router = useRouter()

  useEffect(() => {
    // If wallet is not connected, redirect to '/'
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Validation
    if (
      !formData.name ||
      !formData.details ||
      !formData.thumbnailUrl ||
      !formData.targetAmount ||
      !formData.stage1Amount ||
      !formData.stage2Amount ||
      formData.documentsLinks.length < 2 ||
      !formData.campaignExpiryDate
    ) {
      setError('Please fill in all fields and add at least 2 document links.');
      return;
    }

    const isEmptyString = formData.documentsLinks.some((item: any) => item.trim() === '');

    if (isEmptyString) {
      setError('All Documents Links should not be empty strings.');
      return;
    }

    // Additional validation for campaign expiry date
    const today = new Date();
    const expiryDate = new Date(formData.campaignExpiryDate);
    const twoWeeksLater = new Date(today.setDate(today.getDate() + 14));

    if (expiryDate <= twoWeeksLater) {
      setError('Campaign expiry date must be at least 2 weeks from today.');
      return;
    }
    if ((parseFloat(formData.stage1Amount) + parseFloat(formData.stage2Amount)) !== parseFloat(formData.targetAmount)) {
      setError('Target Amount should be total of Stage1 Amount and Stage2 Amount');
      return;
    }
    const epoch_time = new Date(formData.campaignExpiryDate).getTime() / 1000;
    // All validations passed, continue with form submission

    try {
      if (!isConnected) return open()
      setLoading(true)

      const [result, hash] = await executeContractWrite({
        address: crowdFundindContract.address,
        abi: crowdFundindContract.abi,
        functionName: 'createCampaign',
        args: [formData.name, formData.details, formData.thumbnailUrl, [parseEther(`${formData.targetAmount}`), parseEther(`${formData.stage1Amount}`), parseEther(`${formData.stage2Amount}`)], epoch_time, formData.documentsLinks],
      })
      console.log({ result, hash })
      toast('Campaign created successfully', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      router.push("/yourcampaigns")
      setError('');
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      console.log(err.message.details)
    }
  };


  return (
    <>
      {!loading ?
        <Box mx="auto">
          <Box mx="auto" maxWidth="xl" textAlign="center">
            <Typography variant="h3" fontWeight="bold" color="black" lineHeight={1}>
              Launch Your Project: Create a Campaign on RiseTogether
            </Typography>
            <Typography variant="body1" mb={5} mt={2} color="textSecondary">
              Transform Your Vision into Reality with Our Intuitive Campaign Creation Process
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{ fontFamily: "sans-serif" }}>
            <label htmlFor="name" style={{ marginBottom: '5px', display: 'block' }}>Name:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} style={{ marginBottom: '10px', padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: "#fff", color: "#000000" }} required />

            <label htmlFor="details" style={{ marginBottom: '5px', display: 'block' }}>Details (Stage 1 and stage 2 objectives):</label>
            <textarea id="details" name="details" value={formData.details} onChange={handleChange} style={{ marginBottom: '10px', padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px', backgroundColor: "#fff", color: "#000000" }} required />

            <label htmlFor="thumbnailUrl" style={{ marginBottom: '5px', display: 'block' }}>Thumbnail URL:</label>
            <input type="text" id="thumbnailUrl" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} style={{ marginBottom: '10px', padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: "#fff", color: "#000000" }} required />

            <label htmlFor="stage1Amount" style={{ marginBottom: '5px', display: 'block' }}>Stage 1 Amount (In ETH):</label>
            <input type="number" id="stage1Amount" name="stage1Amount" value={formData.stage1Amount} onChange={handleChange} style={{ marginBottom: '10px', padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: "#fff", color: "#000000" }} required />

            <label htmlFor="stage2Amount" style={{ marginBottom: '5px', display: 'block' }}>Stage 2 Amount (In ETH):</label>
            <input type="number" id="stage2Amount" name="stage2Amount" value={formData.stage2Amount} onChange={handleChange} style={{ marginBottom: '10px', padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: "#fff", color: "#000000" }} required />

            <label htmlFor="targetAmount" style={{ marginBottom: '5px', display: 'block' }}>Target Amount:</label>
            <input type="number" id="targetAmount" name="targetAmount" value={formData.targetAmount} onChange={handleChange} style={{ marginBottom: '10px', padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: "#fff", color: "#000000" }} required />

            <label htmlFor="campaignExpiryDate" style={{ marginBottom: '5px', display: 'block' }}>Campaign Expiry Date:</label>
            <input
              type="datetime-local"
              id="campaignExpiryDate"
              name="campaignExpiryDate"
              value={formData.campaignExpiryDate}
              onChange={handleChange}
              style={{ marginBottom: '10px', padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: "#fff", color: "#000000" }}
              required
            />

            {/* Add similar styling for other form elements */}

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#F9FAFB', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', maxWidth: '30rem', marginTop: '1rem' }}>
                <label htmlFor="documentsLinks" style={{ fontSize: '1rem', fontWeight: '600', color: '#4B5563', marginBottom: '0.5rem' }}>
                  Documents Links
                </label>
                {formData.documentsLinks.map((detail: any, index: any) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                    <input
                      type="url"
                      value={detail}
                      onChange={(e) => handleItemChange("documentsLinks", index, e.target.value)}
                      style={{ marginTop: '0.125rem', width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '0.375rem', boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)', fontSize: '1rem', backgroundColor: "#fff", color: "#000000" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem("documentsLinks", index)}
                      style={{ marginLeft: '0.5rem', padding: '0.375rem 0.75rem', fontSize: '0.875rem', backgroundColor: '#EF4444', color: '#FFF', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddItem("documentsLinks")}
                  style={{ marginTop: '0.5rem', padding: '0.375rem 0.75rem', fontSize: '0.875rem', backgroundColor: '#3B82F6', color: '#FFF', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out' }}
                >
                  Add Link
                </button>
              </div>
            </div>

            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}


            <Button
              id="connect-wallet-button"
              variant="contained"
              color="success"
              size="small"
              // sx={styles.button}
              style={{ width: "100%", padding: "10px", display: "flex", color: "#fff" }}
              type='submit'
            >
              Create Campaign
            </Button>
            <p style={{ color: 'red', marginBottom: '1rem' }}>If details doesn't contain stage 1 and stage 2 motive and objectives campaign will be rejected by admin</p>
            {/* <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}>Create Campaign</button> */}
          </form>
        </Box>
        :
        <FullScreenLoading />
      }
    </>
  );
};

export default CreateCampaignForm;
