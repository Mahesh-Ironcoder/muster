import React, { createContext, useState, useEffect } from 'react';
import AppOffline from './AppOffline';
import CreateMeeting from '../components/CreateMeeting';
import MeetingRoom from '../components/Meetings';

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

function MeetingApp() {
	const [roomId, setRoomId] = useState<number | null>(null);
	const [roomName, setRoomName] = useState<string>('');
	const [hostName, setHostName] = useState<string>('');

	const [localmedia, setLocalmedia] = useState<MediaStream | null>(null);

	useEffect(() => {
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

	function CloseMeeting() {
		window.close();
	}
	return (
		<div className='App'>
			{!window.navigator.onLine ? (
				<AppOffline />
			) : (
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
						<MeetingRoom localMedia={localmedia} close={CloseMeeting} />
					) : (
						<CreateMeeting localMedia={localmedia} />
					)}
				</MeetingCreationContext.Provider>
			)}
		</div>
	);
}

export default MeetingApp;
