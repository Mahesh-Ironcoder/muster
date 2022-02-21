const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

type candidateResp = {
	type: string;
	from: string;
	to: string;
	candidate: RTCIceCandidate | null;
};

class PeerConnection {
	pc: RTCPeerConnection;
	localId!: string;
	signaling: WebSocket;
	remoteId: string;
	remoteStream!: MediaStream;
	senders!: RTCRtpSender[];
	onremote!: (trck: MediaStreamTrack) => void;

	constructor(signaling: WebSocket | undefined, remoteId: string, id: string) {
		// localId ? (this.id = localId) : (this.id = Date.now());
		if (!signaling) {
			console.log('No signaling server...!');
			throw new Error('No signaling server');
		}
		this.remoteId = remoteId;
		this.pc = new RTCPeerConnection(config);
		this.signaling = signaling;
		this.remoteStream = new MediaStream();
		this.localId = id;
		this.senders = [];
		// console.log('Peer conn: ', this.pc);

		// Get all defined class methods
		const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));

		// Bind all methods
		methods
			.filter((method) => method !== 'constructor')
			.forEach((method) => {
				//@ts-ignore
				this[method] = this[method].bind(this);
			});
	}

	init(stream: MediaStream | null) {
		// console.log('Signaling in pc: ', this.signaling, this.pc);
		if (!this.signaling) {
			console.log('No signaling server...!');
			throw new Error('No signaling server');
		}
		this.pc.onicecandidate = this.handleIceCandidate;
		this.pc.onnegotiationneeded = this.negotiate;
		this.pc.ontrack = this.handletracks;
		this.pc.onsignalingstatechange = async (e: Event) => {
			if (this.pc.signalingState === 'have-local-offer') {
				console.log('Had a local offer: ');
				let data = {
					type: 'offer',
					to: this.remoteId,
					from: this.localId,
					offer: this.pc.localDescription,
				};
				this.signaling.send(JSON.stringify(data));
			} else if (this.pc.signalingState === 'have-remote-offer') {
				console.log('Had a remote offer...creating local answer');

				const answer = await this.pc.createAnswer();
				await this.pc.setLocalDescription(answer);
				let data = {
					type: 'answer',
					to: this.remoteId,
					from: this.localId,
					answer: this.pc.localDescription,
				};
				this.signaling.send(JSON.stringify(data));
			}
		};
		// if (stream) this.setLocalStream(stream);
	}

	setLocalStream(stream: MediaStream) {
		stream.getTracks().forEach((track) => {
			this.senders.push(this.pc.addTrack(track, stream));
		});
	}

	removeStream() {
		this.senders.forEach((sender) => {
			this.pc.removeTrack(sender);
		});
		this.senders = [];
	}

	stop() {
		this.pc.close();
	}

	async negotiate() {
		try {
			const offer = await this.pc.createOffer();
			await this.pc.setLocalDescription(offer);
		} catch (e) {
			console.log(
				`localid_${this.localId} - Error negotiating with remote_${this.remoteId} ${e}`
			);
		}
	}

	async setAnswer(answer: RTCSessionDescription) {
		await this.pc.setRemoteDescription(answer);
	}

	async addIceCand(candidate: RTCIceCandidate) {
		await this.pc.addIceCandidate(candidate);
	}

	async setOffer(offer: RTCSessionDescription) {
		await this.pc.setRemoteDescription(offer);
	}

	/*
	 *	Handlers and utilites
	 */

	handleIceCandidate(candidate: RTCPeerConnectionIceEvent) {
		console.log('ICE candidate: ', candidate.candidate);
		let data: candidateResp = {
			type: 'ice',
			to: this.remoteId,
			from: this.localId,
			candidate: candidate.candidate,
		};
		this.signaling.send(JSON.stringify(data));
	}

	handletracks({ track }: RTCTrackEvent) {
		// this.remoteStream.addTrack(track);
		this.onremote(track);
	}

	/*
	 *	Getters and setters
	 */

	getRemoteStream() {
		return this.remoteStream;
	}
}

export default PeerConnection;
