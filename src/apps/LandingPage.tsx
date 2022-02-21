import React from 'react';

function LandingPage() {
	return (
		<div style={{ height: '95vh' }}>
			<img
				src='/res/ICONS/8401.jpg'
				alt='Wrok in progress'
				width='100%'
				height='100%'
				style={{ objectFit: 'fill' }}
			/>
			<p style={{ position: 'absolute', top: '0px', padding: '0.5rem' }}>
				<h3>Landing page - Work in progress</h3>
			</p>
			<a
				href='https://www.freepik.com/vectors/people'
				style={{
					fontSize: '2px',
					// opacity: 0.1,
					position: 'relative',
					bottom: '32px',
				}}>
				People vector created by pch.vector - www.freepik.com
			</a>
		</div>
	);
}

export default LandingPage;
