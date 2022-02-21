import { Button } from '@mui/material';
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { FirebaseCtxt } from '../components/contexts/FirebaseContext';
import AppHeader from '../components/elements/AppHeader';

function MainApp() {
	// const classes = mainAppStyles();
	const { currUser, logout } = useContext(FirebaseCtxt);
	return (
		<div>
			<AppHeader />
			<Outlet />
		</div>
	);
}

export default MainApp;
