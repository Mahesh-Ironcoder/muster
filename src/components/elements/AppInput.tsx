import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../css/appinput.css';

type AppInputProps = TextFieldProps & {
	value: string;
	placeholder: string;
	size?: string;
	inputIcon?: React.ReactElement;
};

export function AppInput(props: AppInputProps) {
	const [appProps, setAppProps] = useState<AppInputProps>({} as AppInputProps);
	const [inputRemProps, setInputRemProps] = useState<TextFieldProps>(
		{} as TextFieldProps
	);
	const [value, setValue] = useState('');

	useEffect(() => {
		let { value, placeholder, size, inputIcon, ...remprops } = props;
		setAppProps({ value, placeholder, size, inputIcon });
		setInputRemProps(remprops);
		setValue(value);
	}, [props]);

	return (
		<TextField
			className={'app-input'}
			type='text'
			size='small'
			placeholder={appProps.placeholder}
			InputProps={
				appProps.inputIcon && {
					startAdornment: (
						<InputAdornment position='start'>{appProps.inputIcon}</InputAdornment>
					),
				}
			}
			inputProps={{}}
			value={value}
			{...inputRemProps}
		/>
	);
}
