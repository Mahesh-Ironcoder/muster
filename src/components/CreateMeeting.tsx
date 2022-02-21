import { Button, Grid, Paper, TextField } from '@mui/material';
// import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import React, { useContext } from 'react';
import { MeetingContextPropsType, MeetingCreationContext } from '../apps/MeetingApp';
import Video from './Video';

interface CreateMeetingProps {
	localMedia: MediaStream | null;
	onCreation?: (d: any) => void;
}

const useCMStyles = makeStyles({
	paperComp: {
		// 'width': '50%',
		'display': 'flex',
		'flexDirection': 'row',
		'justifyContent': 'center',
		'alignItems': 'center',
		'margin': 'auto',
		'padding': '0.8rem',
		'flexWrap': 'wrap',
		'& #videoContainer': {
			flex: '0 0 100%',
			justifyItems: 'flex-start',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'center',
		},
		'&& #videoContainer > video': {
			borderRadius: '1%',
			border: '0.1px solid #3394CC',
			// marginLeft: '20px',
		},
	},
});

function CreateMeeting(props: CreateMeetingProps) {
	const [roomName, setRoomName] = React.useState<string>('');
	const [hostName, setHostName] = React.useState<string>('');

	const classes = useCMStyles();

	const { handleCreation } = useContext(
		MeetingCreationContext
	) as MeetingContextPropsType;

	const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRoomName(event.target.value);
	};

	const handleHostNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setHostName(event.target.value);
	};

	const handleSubmit = (event: any) => {
		handleCreation(roomName, hostName);
	};
	return (
		<Grid
			container
			// xl={1}
			direction='column'
			alignItems='center'
			justifyContent='center'
			width='100%'
			height='100vh'
			bgcolor='cyan'>
			<Grid container xs={6}>
				<Paper elevation={10} variant='elevation' className={classes.paperComp}>
					<Video localStream={props.localMedia} style={{ minHeight: '180px' }} />
					<TextField
						value={roomName}
						onChange={handleRoomNameChange}
						style={{ margin: '20px' }}
						placeholder='Room Name'
						size='small'
					/>
					<TextField
						value={hostName}
						onChange={handleHostNameChange}
						style={{ margin: '20px' }}
						placeholder='Display Name'
						size='small'
					/>
					<Button variant='contained' onClick={handleSubmit}>
						Create
					</Button>
				</Paper>
			</Grid>
		</Grid>
	);
}

export default CreateMeeting;
