import { Grid, StyledEngineProvider } from '@mui/material';
import { SignUpComp } from './SignUpComp';
import { SignInComp } from './SignInComp';
import '../css/loginpage.css';
import { FirebaseCtxt, LoginCreds, SignUpCreds } from '../contexts/FirebaseContext';
import { useContext, useEffect } from 'react';
import { SignInMethod } from 'firebase/auth';
import { To, useLocation, useNavigate } from 'react-router-dom';

function LoginPage() {
	const authContext = useContext(FirebaseCtxt);
	const navigate = useNavigate();
	const location = useLocation();
	const handleSingin = (creds: LoginCreds) => {
		authContext
			.login(creds, SignInMethod.EMAIL_PASSWORD)
			.then((resp) => {
				// if (resp.status) {
				// 	navigate(location.state as To, { replace: true });
				// }
				console.log('Signed in: ', resp);
			})
			.catch((e) => {
				console.log('Error while signing in: ', e);
			});
	};

	const handleSignUp = (creds: SignUpCreds) => {
		authContext
			.signUp(creds)
			.then((resp) => {
				// if (resp.status) {
				// 	navigate(location.state as To, { replace: true });
				// }
				console.log('Signed up: ', resp);
			})
			.catch((e) => {
				console.log('Error while signing up: ', e);
			});
	};

	useEffect(() => {
		if (authContext.currUser) {
			navigate(location.state as To, { replace: true });
		}
	}, [authContext.currUser]);

	return (
		<StyledEngineProvider injectFirst>
			<img
				src='/res/ICONS/muster logo blue.png'
				alt='Logo'
				width='10%'
				style={{ top: '8%/100px', position: 'absolute', left: '45%' }}
			/>
			<Grid container justifyContent='center' alignItems='center' height='100vh'>
				<Grid
					container
					item
					lg={8}
					xs={11}
					className={'login-wrapper'}
					height={'80vh'}>
					<Grid item md={6} xs={12}>
						<SignInComp onSignIn={handleSingin} />
					</Grid>
					<Grid item md={6} xs={12}>
						<SignUpComp onSignUp={handleSignUp} />
					</Grid>
				</Grid>
			</Grid>
		</StyledEngineProvider>
	);
}

export default LoginPage;
