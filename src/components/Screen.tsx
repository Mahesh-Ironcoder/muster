// import CallEndTwoToneIcon from '@mui/icons-material/CallEndTwoTone';
// import MicTwoToneIcon from '@mui/icons-material/MicTwoTone';
// import MicOffTwoToneIcon from '@mui/icons-material/MicOffTwoTone';
// import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
// import VideocamOffTwoToneIcon from '@mui/icons-material/VideocamOffTwoTone';

import React from 'react';

// import { MeetingContext, MeetingContextType } from './Meetings';
// import { OptionsBar } from './Option';
import Video from './Video';

const Screen = React.forwardRef((props: any, ref) => {
	const [vidp, setVidp] = React.useState<boolean>(false);
	const [ls, setLs] = React.useState<MediaStream>(props.userMedia);
	const [ds, setDs] = React.useState<MediaStream>(props.displayMedia);

	React.useEffect(() => {
		setVidp(props.vidPause);
		setLs(props.userMedia);
		setDs(props.displayMedia);
	}, [props]);
	/* const options = [
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
	]; */

	return (
		<div className='ScreenStyles'>
			{vidp && (
				<Video
					localStream={ls}
					showOptions={false}
					style={{
						position: 'absolute',
						top: '0.25rem',
						right: '0.25rem',
						display: 'flex',
						justifyContent: 'center',
						/* margin: auto; */
						flex: 4,
					}}
					vidStyle={{
						width: '10rem',
						height: '10rem',
						display: vidp ? 'block' : 'none',
					}}
				/>
			)}
			<Video
				localStream={ds}
				showOptions={false}
				style={{ width: '98%' }}
				vidStyle={{ borderRadius: '0' }}
			/>
			{/* <OptionsBar options={options} /> */}
		</div>
	);
});

export default Screen;
