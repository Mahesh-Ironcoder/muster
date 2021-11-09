import { useState, useEffect } from 'react';

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
	const [socket, setSocket] = useState<WebSocket | null>(null);
	useEffect(() => {
		const { options: opt } = props;
		let soc = null;
		try {
			soc = new WebSocket(props.url);
			console.log('from hook');
			if (opt.onopen) soc.onopen = opt.onopen;
			if (opt.onmessage) soc.onmessage = opt.onmessage;
			if (opt.onclose) soc.onclose = opt.onclose;
			if (opt.onerror) soc.onerror = opt.onerror;
		} catch (e) {
			console.error(e);
		}
		if (soc) {
			setSocket(soc);
		}
	}, [props]);

	function send(data: any) {
		if (socket) {
			socket.send(JSON.stringify(data));
		}
	}
	return { socket, send };
}

export default useWebSockets;
