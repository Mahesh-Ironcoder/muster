import { Button, Grid, Paper, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { makeStyles } from '@mui/styles';
import React, { useContext } from 'react';
import { MeetingContextPropsType, MeetingCreationContext } from '../App';

interface CreateMeetingProps {
	onCreation?: (d: any) => void;
}

const useCMStyles = makeStyles({
	paperComp: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		margin: 'auto',
		padding: '0.8rem',
	},
});

function CreateMeeting(props: CreateMeetingProps) {
	const classes = useCMStyles();

	const {
		roomName,
		hostName,
		handleRoomIdChange,
		handleHostNameChange,
		handleCreation,
	} = useContext(MeetingCreationContext) as MeetingContextPropsType;

	const handleSubmit = (event: any) => {
		handleCreation();
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
			<Grid container xs={4}>
				<Paper elevation={10} variant='elevation' className={classes.paperComp}>
					<TextField
						value={roomName}
						onChange={handleRoomIdChange}
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
