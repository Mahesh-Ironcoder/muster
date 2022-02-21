import {
	Card,
	CardActionArea,
	CardContent,
	Chip,
	Container,
	Grid,
	Typography,
	Box,
} from '@mui/material';
import React from 'react';
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone';

const cubicles = [
	{ name: 'Cubicle 1', id: 12345, manager: 'ABC', participants: 10 },
	{ name: 'Cubicle 2', id: 12345, manager: 'BCA', participants: 40 },
	{ name: 'Cubicle 3', id: 12345, manager: 'CAB', participants: 25 },
	{ name: 'Cubicle 4', id: 12345, manager: 'ACB', participants: 36 },
	{ name: 'Cubicle 5', id: 12345, manager: 'BAC', participants: 39 },
	{ name: 'Cubicle 6', id: 12345, manager: 'CBA', participants: 27 },
];

function Home() {
	return (
		<Container sx={{ marginTop: '2.5rem' }} maxWidth='lg'>
			<Box display='flex' margin={2}>
				<Typography variant='h5' flex={2}>
					My Spaces
				</Typography>
				<Chip label='Filters here' />
			</Box>
			<Grid container justifyContent='flex-start' spacing={1}>
				{cubicles.map((cub, idx) => {
					return (
						<Grid item key={idx} xs={12} sm={6} md={3}>
							<Card variant='elevation' sx={{ maxWidth: 275 }}>
								<CardActionArea>
									<CardContent>
										<Typography variant='h4'>{cub.name}</Typography>
										<Chip
											icon={
												<PeopleOutlineTwoToneIcon fontSize='small' color='primary' />
											}
											label={cub.participants}
										/>

										<Typography variant='h6'>Manager:</Typography>
										{cub.manager}
									</CardContent>
								</CardActionArea>
							</Card>
						</Grid>
					);
				})}
			</Grid>
		</Container>
	);
}

export default Home;
