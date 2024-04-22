import FullScreenLoading from '@/components/Loading'
import PrimaryLayout from '@/components/layouts/PrimaryLayout'
import React from 'react'
import { useAccount } from 'wagmi'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { isConnecting } = useAccount()
    return (
        <div>{!isConnecting ? <PrimaryLayout>{children}</PrimaryLayout> : <FullScreenLoading />}</div>
    )
}

export default MainLayout