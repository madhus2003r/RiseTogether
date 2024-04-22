"use client"

import { useContract } from '@/components/ContractProvider'
import FullScreenLoading from '@/components/Loading'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

const layout = ({ children }: { children: React.ReactNode }) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const { isConnected, address } = useAccount()
    const { open } = useWeb3Modal()
    const router = useRouter()
    const { crowdFundindContract, executeContractRead, executeContractWrite } = useContract()

    const handleGetData = async () => {
        try {
            const result: any = (await executeContractRead({
                address: crowdFundindContract.address,
                abi: crowdFundindContract.abi,
                functionName: 'admin',
                args: [],
            }));

            if (result !== address) {
                router.push("/")
                setIsAdmin(false)
            }else{
                setIsAdmin(true)
            }
        } catch (e) {
            setIsAdmin(false)
            console.error(e)
        }
    }
    useEffect(() => {
        async function GetData() {
            try {
                if (!isConnected) return open().finally(() => router.push(`/`))
                setLoading(true)
                await handleGetData()
                setLoading(false)
            } catch (e) {
                setLoading(false)
                console.error(e)
            }
        }
        GetData()
    }, [])
    return (
        <>{(loading || !isAdmin) ? <FullScreenLoading /> : <div>{children}</div>}</>
    )
}

export default layout