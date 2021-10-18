import React, { useEffect, useRef, useContext, useState } from 'react';
import { MeetingContext, MeetingContextType } from './Meetings';

function Video(props: any) {
	const [isVideoOn, setIsVideoOn] = useState(true);
	// const [mediaStream, setMediaStrem] = useState(props.ms);
	const vidRef = useRef<HTMLVideoElement | null>(null);

	const { localStream: mediaStream } = useContext(
		MeetingContext
	) as MeetingContextType;

	// useEffect(() => {
	// 	if (props.ms) setMediaStrem(props.ms);
	// }, [props]);

	useEffect(() => {
		const vidEle = vidRef.current;
		// console.log('length: ', mediaStream.getVideoTracks().length);

		if (!mediaStream) {
			console.log('Mediastream: ', mediaStream);
			setIsVideoOn(false);
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
		<div className='VideoStyles'>
			{/* {isVideoOn ? (
				<video ref={vidRef} autoPlay width={360} />
			) : (
				<span className='material-icons-two-tone'>account_circle</span>
			)} */}
			<video ref={vidRef} autoPlay width='180' height='180' />
		</div>
	);
}

export default Video;
