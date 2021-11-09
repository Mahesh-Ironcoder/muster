import { useEffect, useState, createContext, useContext, useRef } from 'react';
import Screen from './Screen';

import { OptionsBar } from './Option';
import AttendeeList from './Attendees';

import CallEndTwoToneIcon from '@mui/icons-material/CallEndTwoTone';
import MicTwoToneIcon from '@mui/icons-material/MicTwoTone';
import MicOffTwoToneIcon from '@mui/icons-material/MicOffTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import VideocamOffTwoToneIcon from '@mui/icons-material/VideocamOffTwoTone';
import ScreenShareTwoToneIcon from '@mui/icons-material/ScreenShareTwoTone';
import StopScreenShareTwoToneIcon from '@mui/icons-material/StopScreenShareTwoTone';
import { makeStyles } from '@mui/styles';
import PeerConnection from '../utils/peerconnection';
import useWebSockets from '../hooks/useWebSockets';

export interface MeetingContextType {
	localStream: MediaStream;
	setMute: (st: boolean) => void;
	setPause: (st: boolean) => void;
}

interface MeetingRoomProps {
	localMedia: MediaStream | null;
}
const useMeetingStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		height: '100vh',
	},
});

export const MeetingContext = createContext({});

// const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
// const constraints = { audio: true, video: true };

function MeetingRoom(props: MeetingRoomProps) {
	const [peerConns, setPeerConns] = useState<PeerConnection[]>([]);
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);

	const [displayMedia, setDisplayMedia] = useState<MediaStream | null>(null);

	const [self, setSelf] = useState<PeerConnection | null>(null);
	const [mute, setMute] = useState<boolean>(false);
	const [pause, setPause] = useState<boolean>(false);

	const classes = useMeetingStyles();

	useEffect(() => {
		if (localStream) {
			setMute(localStream.getAudioTracks()[0].enabled);
			setPause(localStream.getVideoTracks()[0].enabled);
		}
		// const conn = new PeerConnection(signaling);
		// setSelf(conn);
	}, [localStream]);
	useEffect(() => {
		if (localStream) {
			localStream.getAudioTracks().forEach((track) => {
				track.enabled = mute;
			});
			// localStream.getVideoTracks().forEach((track) => {
			// });
		}
	}, [localStream, mute]);

	useEffect(() => {
		if (localStream) {
			localStream.getVideoTracks().forEach((track) => {
				track.enabled = pause;
			});
		}
	}, [localStream, pause]);

	useEffect(() => {
		setLocalStream(props.localMedia);
	}, [props]);

	useEffect(() => {
		return () => {
			if (displayMedia) stopDisplayCapture();
		};
	}, []);

	const { socket: signaling } = useWebSockets({
		url: '',
		options: {
			onopen: handleConnOpen,
			onmessage: handleRecvMsg,
			onerror: handleConnError,
		},
	});

	async function getDisplayMedia() {
		const gdmOptions = {
			// audio: {
			// 	echoCancellation: true,
			// 	noiseSuppression: true,
			// },
			audio: false,
			video: true,
		};
		// @ts-ignore
		const media = await navigator.mediaDevices.getDisplayMedia(gdmOptions);

		media.onremovetrack = (e: MediaStreamTrackEvent) => {
			console.log('removing track........................!', e);
		};
		media.getVideoTracks()[0].onended = () => {
			stopDisplayCapture();
		};

		setDisplayMedia(media);
	}

	function stopDisplayCapture() {
		displayMedia?.getTracks().forEach((track) => {
			track.stop();
		});
		setDisplayMedia(null);
	}

	function handleConnOpen(e: Event) {
		console.log('Opened connection to #url');
		const conn = new PeerConnection(signaling);
		const data = {
			type: 'newConn',
			from: conn.id,
			//id, room
		};
		signaling?.send(JSON.stringify(data));
		setPeerConns([...peerConns, conn]);
	}

	function handleRecvMsg(e: MessageEvent) {
		console.log('Recieving message from connection to ws://localhost:8080/');
		const msg = e.data;
		switch (msg.type) {
			case 'offer':
				handleOffer(msg);
				break;
			case 'answer':
				handleAnswer(msg);
				break;
			case 'newConn':
				handleNewConn(msg);
				break;
			case 'ice':
				handleNewIce(msg);
				break;
			default:
				break;
		}
	}

	function handleConnError(e: Event) {
		console.log('Error in connceting to url');
	}

	const handleNewConn = (data: any) => {
		const lid = self ? self.id : null;
		const peer = new PeerConnection(signaling, lid);
		peer.start(localStream, data['from']);
		setPeerConns([...peerConns, peer]);
	};

	const handleOffer = (data: any) => {
		let peer = peerConns.filter((conn) => {
			return conn.id === data['to'];
		})[0];
		peer.setOffer(data['offer']);
	};

	const handleAnswer = (data: any) => {
		let peer = peerConns.filter((conn) => {
			return conn.id === data['to'];
		})[0];
		peer.setAnswer(data['answer']);
	};

	const handleNewIce = (data: any) => {
		let peer = peerConns.filter((conn) => {
			return conn.id === data['to'];
		})[0];
		peer.addIceCand(data['candidate']);
	};

	const options = [
		{
			name: 'mic',
			icon: <MicTwoToneIcon color='primary' />,
			offIcon: <MicOffTwoToneIcon color='action' />,
			onclick: () => {
				console.log('Mute toggle');
				setMute(!mute);
				// setIsMute(!isMute);
			},
		},
		{
			name: 'pause',
			icon: <VideocamTwoToneIcon color='primary' />,
			offIcon: <VideocamOffTwoToneIcon color='action' />,
			onclick: () => {
				console.log('Videocam toggle');
				setPause(!pause);
				// setIsPause(!isPause);
			},
		},
		{
			name: 'Screen Share',
			icon: <ScreenShareTwoToneIcon color='primary' />,
			offIcon: <StopScreenShareTwoToneIcon color='action' />,
			onclick: () => {
				if (displayMedia === null) getDisplayMedia();
				else {
					stopDisplayCapture();
				}
			},
		},
		{
			name: 'End',
			icon: <CallEndTwoToneIcon color='primary' />,
			onclick: () => {
				// document.close();/
				window.close();
			},
		},
	];

	return (
		<div className={classes.root}>
			{displayMedia ? (
				<Screen
					displayMedia={displayMedia}
					userMedia={localStream}
					vidPause={pause}
				/>
			) : (
				<AttendeeList
					attendees={[
						'Mahesh',
						'Teja',
						'Sushma',
						'some',
						'lorem',
						'ipsum',
						'some',
						'more',
					]}
				/>
			)}
			<OptionsBar options={options} />
		</div>
	);
}

export default MeetingRoom;
