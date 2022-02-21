import {
	useEffect,
	useState,
	createContext,
	useContext,
	useRef,
	useCallback,
} from 'react';
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
	close: () => void;
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

	const [displayLocalMedia, setDisplayLocalMedia] = useState<MediaStream | null>(
		null
	);
	const [displayRemoteMedia, setDisplayRemoteMedia] = useState<MediaStream | null>(
		null
	);
	const [socket, setSocket] = useState<WebSocket>();
	const [chId, setChId] = useState<string>('');

	const [mute, setMute] = useState<boolean>(false);
	const [pause, setPause] = useState<boolean>(false);
	const [srnShare, setSrnShare] = useState<boolean>(false);

	const classes = useMeetingStyles();

	const handleNewConn = useCallback(
		(data: any) => {
			// const lid = self ? self.localId : null;
			console.log('Got new peer request: ', data);
			const peer = new PeerConnection(socket, data['peerId'], data.selfId);
			peer.init(localStream);
			peer.onremote = (track: MediaStreamTrack) => {
				displayRemoteMedia?.addTrack(track);
			};
			setPeerConns([...peerConns, peer]);
		},
		[socket, localStream, peerConns, displayRemoteMedia]
	);

	const handleOffer = useCallback(
		(data: any) => {
			console.log('Got a new offer: ', data);

			const peer = new PeerConnection(socket, data.localId, data.remoteId);
			peer.init(localStream);
			peer.setOffer(data['offer']);
			peer.onremote = (track: MediaStreamTrack) => {
				displayRemoteMedia?.addTrack(track);
			};
			setPeerConns([...peerConns, peer]);
		},
		[socket, localStream, peerConns, displayRemoteMedia]
	);

	const handleAnswer = useCallback(
		(data: any) => {
			console.log('Got a new answer: ', data, peerConns);
			console.log('typeof: ', typeof data.localId);
			let peers = peerConns.filter((conn) => {
				return conn.remoteId === data.localId;
			});
			console.log('Answer for peers: ', peers);

			peers.forEach((peer, i) => peer.setAnswer(data.answer));
		},
		[peerConns]
	);

	const handleNewIce = useCallback(
		(data: any) => {
			let peers = peerConns.filter((conn) => {
				return conn.remoteId === data.localId;
			});
			console.log('Ice cands for peers: ', peers);
			peers.forEach((peer, i) => peer.addIceCand(data['candidate']));
		},
		[peerConns]
	);

	const stopDisplayCapture = useCallback(() => {
		displayLocalMedia?.getTracks().forEach((track) => {
			track.stop();
		});
		setDisplayLocalMedia(null);
	}, [displayLocalMedia]);

	const getDisplayMedia = async function () {
		try {
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
			setDisplayLocalMedia(media);
		} catch (e) {
			console.log('Error', e);
			setSrnShare(false);
		}
	};

	useEffect(() => {
		if (!socket) {
			console.log('from useEffect hook for socket');
			let soc = new WebSocket('ws://127.0.0.1:8000/signaling/ws/room/');
			setSocket(soc);
		}
		return () => {
			if (socket != null && socket.OPEN) {
				console.log('Closing the socket');
				socket.close();
				setSocket(undefined);
			}
			if (displayLocalMedia) setSrnShare(false);
			if (peerConns.length > 0) {
				peerConns.forEach((conn, i) => {
					console.log('Stopping peer connection - ', i + 1);
					conn.stop();
				});
			}
		};
	}, []);

	useEffect(() => {
		if (socket) {
			socket.onopen = handleConnOpen;
			socket.onmessage = function (e: MessageEvent) {
				console.log(
					'Recieving message from connection to ws://localhost:8080/',
					e,
					peerConns
				);
				const msg = JSON.parse(e.data);
				console.log(msg.type);

				switch (msg.type) {
					case 'offer':
						handleOffer(msg);
						break;
					case 'answer':
						handleAnswer(msg);
						break;
					case 'newpeer':
						handleNewConn(msg);
						break;
					case 'ice':
						handleNewIce(msg);
						break;
					case 'id':
						setChId(msg.id);
						break;
					default:
						console.log('No handler: ', msg);
						break;
				}
			};
			socket.onclose = (ev: CloseEvent) => {
				console.log('Closing wesocket connection', ev);
				setSocket(undefined);
			};
			socket.onerror = handleConnError;
		}
	}, [socket, peerConns, handleOffer, handleAnswer, handleNewConn, handleNewIce]);

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
		if (displayLocalMedia) {
			peerConns.forEach((conn, i) => {
				// if (conn.senders.length === 0) {
				conn.setLocalStream(displayLocalMedia);
				// }
			});
		}
	}, [displayLocalMedia, peerConns]);

	useEffect(() => {
		if (displayLocalMedia) {
			displayLocalMedia.onremovetrack = (e: MediaStreamTrackEvent) => {
				console.log('removing track........................!', e);
			};
			if (displayLocalMedia.getVideoTracks().length > 0)
				displayLocalMedia.getVideoTracks()[0].onended = () => {
					stopDisplayCapture();
				};
			let a = window.navigator.onLine;
		}
	}, [displayLocalMedia]);

	useEffect(() => {
		if (srnShare) {
			if (displayLocalMedia && displayLocalMedia.active) {
				stopDisplayCapture();
			}
			getDisplayMedia();
		} else {
			stopDisplayCapture();
		}
	}, [srnShare]);

	useEffect(() => {
		setLocalStream(props.localMedia);
	}, [props]);

	useEffect(() => {
		console.log('Rendering Meeting');
		return () => {
			console.log('Destroying Meeting');
		};
	});

	useEffect(() => {
		console.log('Peer conns changed');

		peerConns.forEach((conns, i) => {
			let rs = conns.getRemoteStream();
			if (rs) {
				setDisplayLocalMedia(new MediaStream(rs.getVideoTracks()));
			}
		});
	}, [peerConns]);

	function handleConnOpen(e: Event) {
		console.log('Opened connection to #url', e);
	}

	function handleConnError(e: Event) {
		console.log('Error in connceting to url');
	}

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
				console.log('screen toggle ', srnShare);
				setSrnShare(!srnShare);
			},
		},
		{
			name: 'End',
			icon: <CallEndTwoToneIcon color='primary' />,
			onclick: () => {
				// document.close();/
				window.close();
				// props.close();
			},
		},
	];

	return (
		<div className={classes.root}>
			{displayLocalMedia || displayRemoteMedia ? (
				<Screen
					displayMedia={displayLocalMedia ? displayLocalMedia : displayRemoteMedia}
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
