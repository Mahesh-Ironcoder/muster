import { Card, CardContent, CardMedia, Grid } from '@mui/material';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import React from 'react';

interface AttendeesListProps {
	attendees: String[];
}

function Attendee(props: any) {
	return (
		<Card
			sx={{
				minWidth: 350,
				minHeight: 215,
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<CardMedia>{props.icon}</CardMedia>
			<CardContent>{props.name}</CardContent>
		</Card>
	);
}

function AttendeeList(props: AttendeesListProps) {
	const { attendees } = props;
	return (
		<Grid container wrap='wrap' width='100%' height='90vh'>
			{attendees.map((attend: any, idx: any) => {
				return (
					<Grid key={idx} item md={4}>
						<Attendee
							icon={<AccountCircleTwoToneIcon fontSize='large' />}
							name={attend}
						/>
					</Grid>
				);
			})}
		</Grid>
	);
}

export default AttendeeList;
