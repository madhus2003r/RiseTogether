"use client"

import React, { useEffect, useState } from 'react';
import YourCampaigns from './YourCampaigns';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

const Page = () => {
    const { isConnected } = useAccount();
    const router = useRouter();

    useEffect(() => {
        // If wallet is not connected, redirect to '/'
        if (!isConnected) {
            router.push('/');
        }
    }, [isConnected]);

    return (
        <div>
            {isConnected && <YourCampaigns />}
        </div>
    );
};

export default Page;
