import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import PasswordTwoToneIcon from '@mui/icons-material/PasswordTwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import { Box, Button, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { AppInput } from './AppInput';
import { SignUpCreds } from '../contexts/FirebaseContext';
import '../css/signupcomp.css';

interface SignUpProps {
	onSignUp: (c: SignUpCreds) => void;
}

export function SignUpComp(props: SignUpProps) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	return (
		<Box className={clsx('signup-container', 'container')}>
			<Typography variant='h5' gutterBottom className={'container'}>
				Create an account
			</Typography>
			<AppInput
				value={username}
				placeholder='Name'
				inputIcon={<PersonTwoToneIcon color='info' />}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<AppInput
				placeholder='Email'
				type='email'
				inputIcon={<EmailTwoToneIcon color='info' />}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<AppInput
				placeholder='Password'
				type='password'
				inputIcon={<PasswordTwoToneIcon color='info' />}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Button
				variant='contained'
				onClick={(e) => {
					props.onSignUp({ email, password, username });
				}}>
				Sign Up
			</Button>
		</Box>
	);
}
