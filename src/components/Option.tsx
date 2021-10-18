import React, { useState } from 'react';

interface OptionProps {
	name: string;
	icon?: React.ReactNode;
	offIcon?: React.ReactNode;
	onClick?: () => void;
}

type optionType = {
	name: string;
	icon: React.ReactNode;
	offIcon?: React.ReactNode;
	onclick?: () => void;
};

interface OptionsBarProps {
	options: optionType[];
}

function Option(props: OptionProps) {
	const [state, setState] = useState<boolean>(true);
	return (
		<div
			style={{ backgroundColor: state ? '#E2D0FF' : '#FF725E' }}
			className='optionStyles'
			onClick={() => {
				setState(!state);
				props.onClick && props.onClick();
			}}>
			{state ? props.icon : props.offIcon}
		</div>
	);
}

export function OptionsBar(props: OptionsBarProps) {
	return (
		<div className='optionsbarStyles'>
			{props.options.map((option, idx) => {
				return (
					<Option
						key={idx}
						name={option.name}
						icon={option.icon}
						offIcon={option.offIcon}
						onClick={option.onclick}
					/>
				);
			})}
		</div>
	);
}

export default Option;
