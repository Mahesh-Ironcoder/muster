import React, { createContext } from 'react';
import './App.css';
import CreateMeeting from './components/CreateMeeting';
import MeetingRoom from './components/Meetings';
// import useWebSockets from './hooks/useWebSockets';

export const MeetingCreationContext = createContext({});

export type MeetingContextPropsType = {
	roomId: number;
	hostName: string;
	roomName: string;
	signaling: WebSocket;
	handleCreation: (roomName: string, hostName: string) => void;
	handleRoomNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleHostNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

// var signaling: WebSocket | null = null;

function App() {
	const [roomId, setRoomId] = React.useState<number | null>(null);
	const [roomName, setRoomName] = React.useState<string>('');
	const [hostName, setHostName] = React.useState<string>('');

	const [localmedia, setLocalmedia] = React.useState<MediaStream | null>(null);

	React.useEffect(() => {
		getLocalMedia();
	}, []);

	async function getLocalMedia() {
		const media = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: { height: { ideal: 240 } },
		});
		setLocalmedia(media);
	}

	const handleCreation = (roomName: string, hostName: string) => {
		setRoomId(Date.now());
		setHostName(hostName);
		setRoomName(roomName);
		// signaling = new WebSocket();
	};
	return (
		<div className='App'>
			<MeetingCreationContext.Provider
				value={{
					roomId,
					hostName,
					roomName,
					handleCreation,
					signaling: null,
					localStream: localmedia,
				}}>
				{roomId ? (
					<MeetingRoom localMedia={localmedia} />
				) : (
					<CreateMeeting localMedia={localmedia} />
				)}
			</MeetingCreationContext.Provider>
		</div>
	);
}

export default App;
