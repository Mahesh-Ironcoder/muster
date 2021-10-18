import CallEndTwoToneIcon from '@mui/icons-material/CallEndTwoTone';
import MicTwoToneIcon from '@mui/icons-material/MicTwoTone';
import MicOffTwoToneIcon from '@mui/icons-material/MicOffTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import VideocamOffTwoToneIcon from '@mui/icons-material/VideocamOffTwoTone';

import React, { useContext, useState } from 'react';

import { MeetingContext, MeetingContextType } from './Meetings';
import { OptionsBar } from './Option';
import Video from './Video';

// interface ScreenProps {
// 	mediastream: any;
// 	children?: React.ReactNode;
// 	mute: boolean;
// 	setMute: (mute: boolean) => void;
// 	pause: boolean;
// 	setPause: (pause: boolean) => void;
// }

const Screen = React.forwardRef((props: any, ref) => {
	const [isMute, setIsMute] = useState(true);
	const [isPause, setIsPause] = useState(true);

	const { setMute, setPause } = useContext(MeetingContext) as MeetingContextType;

	const options = [
		{
			name: 'mic',
			icon: <MicTwoToneIcon color='primary' />,
			offIcon: <MicOffTwoToneIcon color='action' />,
			onclick: () => {
				console.log('Mute toggle');
				setMute(!isMute);
				setIsMute(!isMute);
			},
		},
		{
			name: 'pause',
			icon: <VideocamTwoToneIcon color='primary' />,
			offIcon: <VideocamOffTwoToneIcon color='action' />,
			onclick: () => {
				console.log('Videocam toggle');
				setPause(!isPause);
				setIsPause(!isPause);
			},
		},
		{
			name: 'End',
			icon: <CallEndTwoToneIcon color='primary' />,
			onclick: () => {
				// document.close();
				window.close();
			},
		},
	];

	return (
		<div className='ScreenStyles'>
			<Video />
			<OptionsBar options={options} />
		</div>
	);
});

export default Screen;

// /* 	const [mute, setMuted] = useState(false)
// 	const [close, setClose] = useState(false)
// 	const [audiomediastream, setAudioMediaStream] = useState<MediaStream>()
// 	const [videomediastream, setVideoMediaStream] = useState<MediaStream>()
// 	const vidRef = useRef<HTMLVideoElement | null>(null)
// 	const audRef = useRef<HTMLAudioElement | null>(null)

// 	const handleShare = async () => {
// 		/* @ts-ignore */
// 		let audiomediastream = await navigator.mediaDevices.getUserMedia({
// 			audio: true,
// 			// video: true,
// 		})

// 		/* @ts-ignore */
// 		let videomediastream = await navigator.mediaDevices.getUserMedia({
// 			video: true,
// 		})
// 		setAudioMediaStream(audiomediastream)
// 		setVideoMediaStream(videomediastream)

// 		if (vidRef.current) {
// 			vidRef.current.srcObject = videomediastream
// 		}

// 		if (audRef.current) {
// 			audRef.current.srcObject = audiomediastream
// 		}
// 		console.log(audiomediastream.getTracks())
// 	}

// 	const stopMediaStream = (stream: MediaStream | undefined) => {
// 		if (stream) {
// 			stream.getTracks().forEach((track) => {
// 				track.stop()
// 			})
// 		}
// 	}

// 	const handleStopSharing = () => {
// 		if (vidRef.current) {
// 			stopMediaStream(videomediastream)
// 			vidRef.current.srcObject = null
// 		}
// 		if (audRef.current) {
// 			stopMediaStream(audiomediastream)
// 			audRef.current.srcObject = null
// 		}
// 	}

// 	const handleMute = () => {
// 		audiomediastream?.getAudioTracks().forEach((track) => {
// 			track.enabled = mute
// 			// track.
// 		})
// 		setMuted(!mute)
// 		console.log(audiomediastream?.getTracks())
// 	}
// 	const handleClose = () => {
// 		videomediastream?.getVideoTracks().forEach((track) => {
// 			track.enabled = close
// 			// track.
// 		})
// 		setClose(!close)
// 	}

// 	return (
// 		<div style={ScreenStyles}>
// 			<video ref={vidRef} style={videoStyles} autoPlay playsInline />
// 			<audio ref={audRef} controls={true} autoPlay hidden />
// 			<MediaOptions onMute={handleMute} />
// 		</div>
// 	)
// const ScreenStyles: CSSProperties = {
// 	flexGrow: 5,
// 	border: '1px solid blue',
// 	display: 'flex',
// 	flexDirection: 'column',
// }

// const videoStyles: CSSProperties = {
// 	width: '100%',
// 	height: '85%',
// }
