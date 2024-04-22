'use client' // Tradeoff, for the benefit of having <WagmiConfig> in one place and "globally"
import './globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { ThemeProvider } from '@mui/material'
import { WagmiConfig } from 'wagmi'

import { ContractProvider } from '@/components/ContractProvider'
import PrimaryLayout from '@/components/layouts/PrimaryLayout'
import muiTheme from '@/lib/muiTheme'
import wagmiConfig from '@/lib/wagmiConfig'

import NextTopLoader from 'nextjs-toploader';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic'

const MainLayout = dynamic(() => import('./MainLayout'), { ssr: false });



// Primarily to hold all context providers
// For the layout, see '/src/components/layouts/PrimaryLayout.tsx'
const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body style={{ backgroundColor: '#ffffff' }}>
				<NextTopLoader />
				<WagmiConfig config={wagmiConfig}>
					<ContractProvider>
						<ThemeProvider theme={muiTheme}>
							<MainLayout children={children} />
						</ThemeProvider>
					</ContractProvider>
				</WagmiConfig>
				<ToastContainer />
			</body>
		</html>
	)
}

export default RootLayout
