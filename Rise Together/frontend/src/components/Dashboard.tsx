'use client'
import { Button, Grid, Paper, Typography } from '@mui/material'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import { useContract } from '@/components/ContractProvider'

const styles = {
	paper: {
		p: 4,
		textAlign: 'center',
	},
	button: {
		display: 'block',
		my: 2,
		mx: 'auto',
	},
}

const Dashboard: React.FC = () => {
	// State
	const [nftName, setNftName] = useState<string>('')
	const [tokenUri, setTokenUri] = useState<string>('')

	// Hooks
	const { crowdFundindContract, executeContractRead, executeContractWrite } = useContract()
	const { isConnected } = useAccount()
	const { open } = useWeb3Modal()

	// Handlers
	const handleMint = async () => {
		try {
			if (!isConnected) return open()

			const [result, hash] = await executeContractWrite({
				address: crowdFundindContract.address,
				abi: crowdFundindContract.abi,
				functionName: 'mint',
				args: ['exampleTokenURI'],
			})

			console.log({ result, hash })
		} catch (e) {
			console.error(e)
		}
	}

	const handleGetName = async () => {
		try {
			setNftName('')
			const result = (await executeContractRead({ address: crowdFundindContract.address, abi: crowdFundindContract.abi, functionName: 'name' })) as string
			setNftName(result)
		} catch (e) {
			console.error(e)
		}
	}

	const handleGetTokenURI = async (number: any) => {
		try {
			setTokenUri('')
			const result = (await executeContractRead({
				address: crowdFundindContract.address,
				abi: crowdFundindContract.abi,
				functionName: 'getData',
				args: [],
			})) as string
			console.log(result)
			// setTokenUri(result)
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<>
			<Grid container spacing={4}>
				<Grid item xs={12} md={6}>
					<Paper sx={styles.paper}>
						<Typography variant="h4" gutterBottom>
							Your Dashboard
						</Typography>
						<Button onClick={handleMint} variant="outlined" sx={styles.button}>
							Mint crowdFundindContract
						</Button>
						{crowdFundindContract.address && (
							<>
								<Button onClick={handleGetName} variant="outlined" sx={styles.button}>
									Get crowdFundindContract Name
								</Button>

							</>
						)}
					</Paper>
					<Button onClick={() => handleGetTokenURI(0)} variant="outlined" sx={styles.button}>
						Get TokenURI
					</Button>
				</Grid>
				<Grid item xs={12} md={6}>
					<Paper sx={styles.paper}>
						<Typography variant="h4" gutterBottom>
							More Information
						</Typography>
						<Typography gutterBottom>crowdFundindContract Name: {nftName || 'n/a'}</Typography>
						<Typography gutterBottom>TokenURI: {tokenUri || 'n/a'}</Typography>
					</Paper>
				</Grid>
			</Grid>
		</>
	)
}

export default Dashboard
