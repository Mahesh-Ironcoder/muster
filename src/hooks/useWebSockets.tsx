import { useState, useEffect, useCallback } from 'react';

type useWebSocketsProps = {
	url: string;
	options: {
		onopen?: ((this: WebSocket, ev: Event) => any) | null;
		onmessage?: ((this: WebSocket, ev: MessageEvent) => any) | null;
		onclose?: ((this: WebSocket, ev: Event) => any) | null;
		onerror?: ((this: WebSocket, ev: Event) => any) | null;
	};
};

function useWebSockets(props: useWebSocketsProps) {
	const [socket, setSocket] = useState<WebSocket>(new WebSocket(props.url));
	useEffect(() => {
		if (socket) {
			const { options: opt } = props;
			console.log('from hook', props);
			if (opt.onopen) socket.onopen = opt.onopen;
			if (opt.onmessage) socket.onmessage = opt.onmessage;
			if (opt.onclose) socket.onclose = opt.onclose;
			else
				socket.onclose = (ev: CloseEvent) => {
					console.log('Closing wesocket connection', ev);
				};
			if (opt.onerror) socket.onerror = opt.onerror;
		}

		return () => {
			if (socket != null && socket.OPEN) {
				console.log('Closing the socket');
				socket.close();
			}
		};
	}, [props, socket]);

	function send(data: any) {
		socket.send(JSON.stringify(data));
	}
	return { socket, send };
}

export default useWebSockets;
