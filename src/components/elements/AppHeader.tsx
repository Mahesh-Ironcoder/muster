import { Logout, Settings } from '@mui/icons-material';
import NotificationsTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import AddIcon from '@mui/icons-material/Add';
import CreateTwoToneIcon from '@mui/icons-material/CreateTwoTone';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';
import {
	AppBar,
	Avatar,
	Badge,
	Box,
	Button,
	Chip,
	Divider,
	Icon,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { FirebaseCtxt } from '../contexts/FirebaseContext';
import '../css/appheader.css';

function AppLogo() {
	return (
		<div className='applogo'>
			<img src='/res/ICONS/muster logo blue.png' alt='Muster_logo' />
			<Typography variant='h5' color={'WindowText'}>
				Muster
			</Typography>
		</div>
	);
}

function NewCubicle() {
	const [anchor, setAnchor] = useState<HTMLElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setAnchor(null);
	};

	const open = Boolean(anchor);
	return (
		<>
			<Chip
				icon={<AddIcon color='primary' />}
				label='New Space'
				color='primary'
				style={{ cursor: 'pointer' }}
				onClick={handleClick}
			/>
			<Menu
				open={open}
				anchorEl={anchor}
				PaperProps={{
					elevation: 0,
					sx: {
						'overflow': 'visible',
						'filter': 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						'mt': 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				onClick={handleClose}
				onClose={handleClose}>
				<MenuItem>
					<ListItemIcon>
						<CreateTwoToneIcon color='primary' fontSize='small' />
					</ListItemIcon>
					Create Space
				</MenuItem>
				<MenuItem>
					<ListItemIcon>
						<AddCircleOutlineTwoToneIcon color='primary' fontSize='small' />
					</ListItemIcon>
					Join Space
				</MenuItem>
			</Menu>
		</>
	);
}

function AppNotification() {
	return (
		<Tooltip title='Notifications' sx={{ cursor: 'pointer' }}>
			<Badge max={10} aria-haspopup='true'>
				<NotificationsTwoToneIcon fontSize='medium' color='info' />
			</Badge>
		</Tooltip>
	);
}

function AccountMenu() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const { currUser, logout } = useContext(FirebaseCtxt);

	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<Box>
			<Tooltip title='Account'>
				<IconButton
					onClick={handleClick}
					size='small'
					sx={{ ml: 2 }}
					aria-controls={open ? 'account-menu' : undefined}
					aria-haspopup='true'
					aria-expanded={open ? 'true' : undefined}>
					<Avatar
						sx={{ width: 32, height: 32 }}
						// alt={currUser ? currUser.displayName : 'G'}
						// src={currUser ? currUser.photoURL : ''}
					/>
				</IconButton>
			</Tooltip>
			<Menu
				anchorEl={anchorEl}
				id='account-menu'
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						'overflow': 'visible',
						'filter': 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						'mt': 1.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
				<MenuItem>Profile</MenuItem>
				<Divider />
				<MenuItem>
					<ListItemIcon>
						<Settings fontSize='small' />
					</ListItemIcon>
					Preferences
				</MenuItem>
				<MenuItem
					onClick={(e) => {
						logout();
					}}>
					<ListItemIcon>
						<Logout fontSize='small' />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</Box>
	);
}

function AppHeader() {
	return (
		<AppBar className='header' position='static'>
			<AppLogo />
			<Box
				display='flex'
				marginRight='1em'
				flexDirection='row'
				justifyContent='flex-end'
				alignItems='center'
				gap='0.75em'
				flex={2}>
				<NewCubicle />
				<AppNotification />
			</Box>
			<Divider variant='middle' orientation='vertical' flexItem />
			<AccountMenu />
		</AppBar>
	);
}

export default AppHeader;
