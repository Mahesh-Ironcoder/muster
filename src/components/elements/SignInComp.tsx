import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import PasswordTwoToneIcon from '@mui/icons-material/PasswordTwoTone';
import { Box, Button, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { AppInput } from './AppInput';
import { LoginCreds } from '../contexts/FirebaseContext';
import '../css/signincomp.css';

interface SignInProps {
	onSignIn: (c: LoginCreds) => void;
}

export function SignInComp(props: SignInProps) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	return (
		<Box className={clsx('container', 'signin-container')}>
			<Typography variant='h5' gutterBottom className={'container'}>
				Sign in to Muster
			</Typography>
			<AppInput
				value={username}
				placeholder='Username/Email'
				inputIcon={<EmailTwoToneIcon color='info' />}
				onChange={(e) => {
					setUsername(e.target.value);
				}}
			/>
			<AppInput
				value={password}
				placeholder='Password'
				type='password'
				inputIcon={<PasswordTwoToneIcon color='info' />}
				onChange={(e) => {
					setPassword(e.target.value);
				}}
			/>
			<Button
				variant='contained'
				onClick={(e) => {
					props.onSignIn({ username, password });
				}}>
				Sign in
			</Button>
		</Box>
	);
}
