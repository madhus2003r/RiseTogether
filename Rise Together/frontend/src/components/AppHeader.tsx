'use client'
import MenuIcon from '@mui/icons-material/Menu'
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	Hidden,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

import formatAddress from '@/utils/formatAddress'

import ConnectWalletButton from './ConnectWalletButton'
import { useRouter } from 'next/navigation'
import { useContract } from './ContractProvider'

const styles = {
	appBar: {
		backgroundColor: '#ffffff', // White background
		boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow effect
	},
	navigationMobileWrap: { display: { xs: 'flex', md: 'none' }, flexGrow: 1, alignItems: 'center', mr: 1 },
	navigationMobileMenu: { display: { xs: 'block', md: 'none' } },
	navigationDesktopWrap: { display: { xs: 'none', md: 'flex' }, flexGrow: 1, alignItems: 'center' },
	logoMobile: {
		mx: 2,
		display: { xs: 'flex', md: 'none' },
		fontFamily: 'monospace',
		fontWeight: 700,
		letterSpacing: '.3rem',
		color: grey[900], // Adjusted text color for dark theme
		textDecoration: 'none',
	},
	logoDesktop: {
		mr: 2,
		display: { xs: 'none', md: 'flex' },
		fontFamily: 'monospace',
		fontWeight: 700,
		letterSpacing: '.3rem',
		color: grey[900], // Adjusted text color for dark theme
		textDecoration: 'none',
	},
	navigationLink: { my: 2, color: grey[900], display: 'block' }, // Adjusted text color for dark theme
	userConnectedButton: { px: 2, py: 0.75 },
	userAvatar: { ml: 1, width: '24px', height: '24px', flexGrow: 0, fontSize: '12px' },
	userMenuWrap: { flexGrow: 0 },
	userMenu: { mt: '45px' },
}

const AppHeader = () => {
	// App Title
	const dappTitleText = 'RiseTogether'

	// Navigation Pages
	const pages = [
		{
			text: 'Home',
			href: '/',
		},
		{
			text: 'Explore Campaigns',
			href: '/explore',
		},
		{
			text: 'About Us',
			href: '/about',
		},
		{
			text: 'Contact Us',
			href: '/contact',
		},
	]
	const userMenuItems = ['Switch Network', 'Switch Wallet', 'Disconnect']

	// State
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

	// Hooks
	const { address, isConnected, status } = useAccount()
	const { disconnect } = useDisconnect()
	const { data: ensName } = useEnsName({ address })
	const { data: ensAvatar } = useEnsAvatar({ name: ensName })
	const { open } = useWeb3Modal()

	// Handlers
	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget)
	}
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget)
	}

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	const handleCloseUserMenu = (setting: string) => {
		if (setting === 'Switch Network') open({ view: 'Networks' })
		if (setting === 'Switch Wallet') open()
		if (setting === 'Disconnect') disconnect()
		setAnchorElUser(null)
	}

	// Components
	const MenuNavigationItems = pages.map(page => (
		<Link key={page.text} href={page.href} style={{ color: "#000000" }}>
			<MenuItem onClick={handleCloseNavMenu}>
				<Typography textAlign="center">{page.text}</Typography>
			</MenuItem>
		</Link>
	))

	const [isAdmin, setIsAdmin] = useState(false)

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
			console.log(result)
			console.log(address)
			if (result.toString() !== (address || "").toString()) {
				setIsAdmin(false)
			} else {
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
				if (isConnected) {
					await handleGetData()
				}
			} catch (e) {
				console.error(e)
			}
		}
		GetData()
	}, [status])


	return (
		<AppBar position="static" elevation={0} sx={styles.appBar}>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					{/* Mobile Navigation */}
					<Box sx={styles.navigationMobileWrap}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="primary"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							sx={styles.navigationMobileMenu}
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
						>
							{MenuNavigationItems}
						</Menu>
						{/* <Link href="/">
							<Typography variant="h5" noWrap sx={styles.logoMobile}>
								{dappTitleText}
							</Typography>
						</Link> */}
					</Box>

					{/* Desktop Navigation */}
					<Box sx={styles.navigationDesktopWrap}>
						<Link href="/">
							<Typography variant="h5" noWrap sx={styles.logoDesktop} >
								<img
									src="/logo.png" // Replace with actual image path
									alt="Dapp Logo"
									style={{ maxWidth: '100px', maxHeight: '100px' }} // Adjust size as needed
								/>
							</Typography>
						</Link>
						{MenuNavigationItems}
					</Box>

					{/* User Menu */}
					<Box sx={styles.userMenuWrap}>
						{isConnected ? (
							<>
								<Tooltip title="Open settings">
									<Button variant="outlined" onClick={handleOpenUserMenu} sx={styles.userConnectedButton}>
										<Typography variant="caption">{ensName || formatAddress(address)}</Typography>
										<Avatar alt="User ENS Avatar" src={`${ensAvatar}`} sx={styles.userAvatar} />
									</Button>
								</Tooltip>
								<Menu
									sx={styles.userMenu}
									id="menu-appbar"
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									{userMenuItems.map(item => (
										<MenuItem key={item} onClick={() => handleCloseUserMenu(item)}>
											<Typography textAlign="center">{item}</Typography>
										</MenuItem>
									))}
								</Menu>
							</>
						) : (
							<ConnectWalletButton />
						)}
					</Box>
				</Toolbar>
			</Container>
			{isConnected &&
				<AppBar position="static" style={{ backgroundColor: "#fff", boxShadow: "0 0 0 0", width: "100%", display: 'flex', alignItems: 'flex-end', color: "#000000" }}>
					<Toolbar>
						<Link
							href="/yourcontribution"
							style={{
								color: 'inherit',
								textDecoration: 'none',
								padding: '8px 16px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								background: 'transparent',
								cursor: 'pointer',
								marginRight: "8px"
							}}
						>
							Your Contribution
						</Link>
						<Link
							href="/yourcampaigns"
							style={{
								color: 'inherit',
								textDecoration: 'none',
								padding: '8px 16px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								background: 'transparent',
								cursor: 'pointer'
							}}
						>
							Your Campaigns
						</Link>
					</Toolbar>
				</AppBar>}
			{(isAdmin && isConnected) && (
				<>
					<AppBar position="static" style={{ backgroundColor: "#fff", boxShadow: "0 0 0 0.2", width: "100%", display: 'flex', alignItems: 'flex-end', color: "#000000", marginTop: "2px", borderRadius: "10px" }}>
						<Toolbar>
							{/* Hidden text for large screens */}
							<Hidden smDown>
								<Typography variant="body1" style={{ marginRight: '16px', color: "#000000" }}>
									(Admin View)
								</Typography>
							</Hidden>
							<Link
								href="/admin"
								style={{
									color: 'inherit',
									textDecoration: 'none',
									padding: '8px 16px',
									border: '1px solid #ccc',
									borderRadius: '4px',
									background: 'transparent',
									cursor: 'pointer',
									marginRight: "8px"
								}}
							>
								All Campaigns
							</Link>
							<Link
								href="/admin/actions"
								style={{
									color: 'inherit',
									textDecoration: 'none',
									padding: '8px 16px',
									border: '1px solid red',
									borderRadius: '4px',
									background: 'transparent',
									cursor: 'pointer',
									marginRight: "8px"
								}}
							>
								Campaigns Required Actions
							</Link>
						</Toolbar>
					</AppBar>
				</>
			)}
		</AppBar>
	)
}

export default AppHeader
