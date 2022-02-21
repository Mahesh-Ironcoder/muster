import { createContext, useState, useEffect, PropsWithChildren } from 'react';
import { FirebaseApp } from 'firebase/app';
import {
	User,
	getAuth,
	Auth,
	// SignInMethod,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

//***types and interfaces***
interface FirebaseContextInt {
	app: FirebaseApp | null;
}
interface FirebaseCtxtInterface {
	currUser: User | null | undefined;
	login: (c: LoginCreds, t: string) => Promise<FirebaseResp>;
	logout: () => Promise<void>;
	signUp: (c: SignUpCreds) => Promise<FirebaseResp>;
	getCurrentUser: () => User | null | undefined;
}
type FirebaseContextProps = PropsWithChildren<FirebaseContextInt>;
export type LoginCreds = {
	username: string;
	password: string;
};
export type SignUpCreds = {
	email: string;
	password: string;
	username: string;
};
export type FirebaseResp = {
	status: boolean;
	errorMsg: string | null;
	errorObj: Error | null;
};

//***contexts***
export const FirebaseCtxt = createContext({} as FirebaseCtxtInterface);

function FirebaseContextProvider(props: FirebaseContextProps) {
	const [app, setApp] = useState<FirebaseApp>();
	const [auth, setAuth] = useState<Auth>();
	const [user, setUser] = useState<User | null>();

	const navigate = useNavigate();
	const location = useLocation();
	useEffect(() => {
		if (props.app) {
			console.log('Setting the firebase app...');
			setApp(props.app);
		}
	}, [props.app]);

	useEffect(() => {
		if (app) {
			console.log('Setting up the auth...');
			let auth = getAuth(app);
			auth.onAuthStateChanged((user) => {
				if (user) {
					setUser(user);
					console.log('authstate change: ', user);
					let state: string = location.state as string;
					console.log('state in authchange: ', state);

					if (state) {
						if (state.startsWith('/')) {
							console.log('Path state: ', state);
							navigate(state, { replace: true });
						} else {
							navigate('/app', { replace: true });
						}
					}
				}
			});
			setAuth(auth);
			setUser(auth.currentUser);
			//TODO add observer for tokenid change
		}
	}, [app]);

	const getCurrentUser = () => {
		if (auth) {
			return user;
		}
		return null;
	};

	const login = async (creds: LoginCreds, type: string): Promise<FirebaseResp> => {
		//TODO handle for sign in types
		try {
			if (!auth) {
				throw new Error('No authorization server');
			}
			let userCred = await signInWithEmailAndPassword(
				auth,
				creds.username,
				creds.password
			);
			setUser(userCred.user);
			return { status: true } as FirebaseResp;
		} catch (e: any) {
			console.error('Firebase - SIGNIN:::', e);
			return { status: false, errorMsg: e.message, errorObj: e };
		}
	};

	const logout = (): Promise<void> => {
		if (!auth) {
			return Promise.reject();
		}
		setUser(null);
		return auth?.signOut();
	};

	const signUp = async (creds: SignUpCreds): Promise<FirebaseResp> => {
		//TODO handle for sign up types
		try {
			if (!auth) {
				throw Error('No authorization server');
			}
			let resp = await createUserWithEmailAndPassword(
				auth,
				creds.email,
				creds.password
			);
			setUser(resp.user);
			return { status: true } as FirebaseResp;
		} catch (e: any) {
			console.error('Firebase - SIGNUP:::', e);
			return { status: false, errorMsg: e.message, errorObj: e };
		}
	};

	return (
		<FirebaseCtxt.Provider
			value={{ currUser: user, login, logout, signUp, getCurrentUser }}>
			{props.children}
		</FirebaseCtxt.Provider>
	);
}

export default FirebaseContextProvider;
