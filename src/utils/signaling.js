
class SignalingServer extends WebSocket {
	// eslint-disable-next-line no-useless-constructor
	constructor(url) {
		super(url);
	}

	send(data) {
		super.send(JSON.stringify(data));
	}
}

export default SignalingServer;
