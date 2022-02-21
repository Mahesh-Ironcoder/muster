import { useEffect, useState, useContext, ReactElement } from 'react';
import './App.css';
import AppOffline from './apps/AppOffline';
// import MeetingApp from './apps/MeetingApp';
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';
import MainApp from './apps/MainApp';
import LandingPage from './apps/LandingPage';
import Home from './components/elements/Home';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './frbconfig';
import FirebaseContextProvider, {
	FirebaseCtxt,
} from './components/contexts/FirebaseContext';
import LoginPage from './components/elements/LoginPage';
import Loading from './components/elements/Loading';
import { User } from 'firebase/auth';

// import useWebSockets from './hooks/useWebSockets';

type RequireAuthProps = {
	children: ReactElement;
	redirectTo: string;
};

function RequireAuth(props: RequireAuthProps) {
	const { currUser } = useContext(FirebaseCtxt);
	const location = useLocation();

	return (
		<div>
			{currUser ? (
				props.children
			) : (
				<Navigate state={location.pathname} to={props.redirectTo} replace={true} />
			)}
		</div>
	);
}

function App() {
	const [isOnline, setIsOnline] = useState(window.navigator.onLine);
	const [fapp, setFapp] = useState<FirebaseApp | null>(null);

	useEffect(() => {
		window.onoffline = (e) => {
			console.log('The app is offline...!');
			setIsOnline(false);
			setFapp(null);
		};
		window.ononline = (e) => {
			console.log('The app is Online...!');
			setIsOnline(true);
			let app = initializeApp(firebaseConfig);
			setFapp(app);
		};
		let app = initializeApp(firebaseConfig);
		setFapp(app);
	}, []);

	if (!isOnline) {
		return <AppOffline />;
	}

	return (
		<div>
			<BrowserRouter>
				<FirebaseContextProvider app={fapp}>
					<Routes>
						<Route path='/' element={<LandingPage />} />
						<Route path='/login' element={<LoginPage />} />
						<Route
							path='/app'
							element={
								<RequireAuth redirectTo='/login'>
									<MainApp />
								</RequireAuth>
							}>
							{/* <Route index element={<MainApp />} /> */}
							<Route index element={<Home />} />
						</Route>
						<Route path='*' element={<AppOffline />} />
					</Routes>
				</FirebaseContextProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
