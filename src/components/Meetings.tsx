import { useEffect, useState, createContext, useContext, useRef } from 'react';
import Video from './Video';
import Screen from './Screen';
import ChatBox from './ChatBox';
import { MeetingContextPropsType, MeetingCreationContext } from '../App';
import { Grid } from '@mui/material';

export interface MeetingContextType {
	localStream: MediaStream;
	setMute: (st: boolean) => void;
	setPause: (st: boolean) => void;
}

export const MeetingContext = createContext({});

const pcConf = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const constraints = { audio: true, video: true };

function Meetings() {
	const { signaling } = useContext(
		MeetingCreationContext
	) as MeetingContextPropsType;
	const [peer, setPeer] = useState(new RTCPeerConnection(pcConf));
	const [mute, setMute] = useState(true);
	const [pause, setPause] = useState(true);
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

	useEffect(() => {
		// const sv = selfView.current;
		addCameraMic();
		// return () => {
		// 	if (sv) sv.srcObject = null;
		// };
	}, []);

	useEffect(() => {
		if (localStream) {
			localStream.getAudioTracks().forEach((track) => {
				track.enabled = mute;
			});
		}
	}, [localStream, mute]);

	useEffect(() => {
		if (localStream) {
			localStream.getVideoTracks().forEach((track) => {
				track.enabled = pause;
			});
		}
	}, [localStream, pause]);
	// useEffect(() => {
	// 	if (!signaling.OPEN || !peer) {
	// 		console.log('NO signaling server or peer connection found');
	// 		return;
	// 	}
	// 	peer.onicecandidate = ({ candidate }) => {
	// 		const ice = JSON.stringify({ iceCandidate: candidate });
	// 		signaling.send(ice);
	// 	};
	// 	peer.onnegotiationneeded = async (event) => {
	// 		try {
	// 			await peer.setLocalDescription();
	// 			// send the offer to the other peer
	// 			const desc = JSON.stringify({ description: peer.localDescription });
	// 			signaling.send(desc);
	// 		} catch (err) {
	// 			console.error(err);
	// 		}
	// 	};
	// 	peer.ontrack = ({ track, streams }) => {
	// 		// once media for a remote track arrives, show it in the remote video element
	// 		// track.onunmute = () => {
	// 		// 	// don't set srcObject again if it is already set.
	// 		// 	// if (remoteView.srcObject) return;
	// 		// 	// remoteView.srcObject = streams[0];
	// 		// };
	// 		setRemoteStream(streams[0]);
	// 	};
	// }, [peer, signaling]);

	async function addCameraMic() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			for (const track of stream.getTracks()) {
				peer.addTrack(track, stream);
			}
			// if (selfView.current) selfView.current.srcObject = stream;
			setLocalStream(stream);
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<MeetingContext.Provider value={{ setMute, setPause, localStream }}>
			{/* <Grid container className='meetingStyles' width='100%' height='80vh'>
				<Grid item xs={6}>
					<Video ms={localStream} />
				</Grid>
				<Grid item xs={6}>
					<Video ms={remoteStream} />
				</Grid>
			</Grid> */}
			<Screen />
		</MeetingContext.Provider>
	);
}

export default Meetings;

// style={{ display: 'flex', height: '99.8vh', border: '0.5px solid black' }}
