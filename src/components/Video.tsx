import React, { useEffect, useRef, useState } from 'react';
// import { MeetingContext, MeetingContextType } from './Meetings';
import MicTwoToneIcon from '@mui/icons-material/MicTwoTone';
import MicOffTwoToneIcon from '@mui/icons-material/MicOffTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import VideocamOffTwoToneIcon from '@mui/icons-material/VideocamOffTwoTone';
// import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { Option } from './Option';
import { makeStyles } from '@mui/styles';

interface VideoProps {
	localStream: MediaStream | null;
	showOptions?: boolean;
	style?: React.CSSProperties;
	vidStyle?: React.CSSProperties;
}

const useVidStyles = makeStyles({
	opt: {
		'display': 'flex',
		'flexDirection': 'row',
		'justifyContent': 'center',
		'alignItems': 'baseline',
		'position': 'relative',
		'bottom': '5rem',
		'background': 'rgba(0,0,0, 0.7)',
		'width': '50%',
		'height': 'fit-content',
		'margin': 'auto',
		'borderRadius': '20px',
		'& > *': {
			margin: '0.5rem 2rem',
		},
	},
});

function Video(props: VideoProps) {
	const { localStream: mediaStream, showOptions = true } = props;

	const [vidState, setVidState] = useState(true);
	const [micState, setMicState] = useState(true);
	const vidRef = useRef<HTMLVideoElement | null>(null);

	const classes = useVidStyles();

	useEffect(() => {
		const vidEle = vidRef.current;
		// console.log('length: ', mediaStream.getVideoTracks().length);

		if (!mediaStream) {
			console.log('Mediastream: ', mediaStream);
			setVidState(false);
		} else {
			if (mediaStream?.getVideoTracks().length > 0)
				setVidState(mediaStream?.getVideoTracks()[0].enabled);
			if (mediaStream?.getAudioTracks().length > 0) {
				setMicState(mediaStream?.getAudioTracks()[0].enabled);
			}
		}

		console.log('Effect on video...!');

		if (vidEle) {
			vidEle.srcObject = mediaStream;
		}
		return () => {
			console.log('Cleaning the video...!');
			if (vidEle) vidEle.srcObject = null;
		};
	}, [mediaStream]);

	return (
		<div id='videoContainer' style={props.style && { ...props.style }}>
			{/* {vidState ? (
				<video ref={vidRef} autoPlay width={180} />
			) : (
				<AccountCircleTwoToneIcon color='primary' fontSize='large' />
			)} */}
			<video
				ref={vidRef}
				autoPlay
				// width={180}
				style={props.vidStyle && { ...props.vidStyle }}
			/>
			{showOptions && (
				<div className={classes.opt}>
					<Option
						name='mic'
						icon={<MicTwoToneIcon />}
						offIcon={<MicOffTwoToneIcon />}
						onClick={() => {
							mediaStream?.getAudioTracks().forEach((track: MediaStreamTrack) => {
								track.enabled = !micState;
								setMicState(!micState);
							});
						}}
					/>
					<Option
						name='Video'
						icon={<VideocamTwoToneIcon />}
						offIcon={<VideocamOffTwoToneIcon />}
						onClick={() => {
							mediaStream?.getVideoTracks().forEach((track: MediaStreamTrack) => {
								track.enabled = !vidState;
								setVidState(!vidState);
							});
						}}
					/>
				</div>
			)}
		</div>
	);
}

export default Video;
