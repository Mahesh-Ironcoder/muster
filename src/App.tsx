import React, { createContext } from 'react';
import './App.css';
import CreateMeeting from './components/CreateMeeting';
import Meetings from './components/Meetings';
import SignalingServer from './utils/signaling';

export const MeetingCreationContext = createContext({});

export type MeetingContextPropsType = {
	roomId: number;
	hostName: string;
	roomName: string;
	signaling: WebSocket;
	handleCreation: () => void;
	handleRoomIdChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleHostNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

var signaling: WebSocket | null = null;

function App() {
	const [roomId, setRoomId] = React.useState<number | null>(null);
	const [roomName, setRoomName] = React.useState<string | null>(null);
	const [hostName, setHostName] = React.useState<string | null>(null);

	const handleCreation = () => {
		setRoomId(Date.now());
		signaling = new WebSocket('ws://localhost:8080/');
		// signaling_server
	};

	const handleRoomIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRoomName(event.target.value);
	};

	const handleHostNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setHostName(event.target.value);
	};

	return (
		<div className='App'>
			<MeetingCreationContext.Provider
				value={{
					roomId,
					hostName,
					roomName,
					handleCreation,
					handleRoomIdChange,
					handleHostNameChange,
					signaling,
				}}>
				{roomId ? <Meetings /> : <CreateMeeting />}
			</MeetingCreationContext.Provider>
		</div>
	);
}

export default App;
