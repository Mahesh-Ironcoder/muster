const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

type candidateResp = {
	type: string;
	from: number;
	to: number;
	candidate: RTCIceCandidate | null;
};

class PeerConnection {
	pc: RTCPeerConnection;
	id: number;
	// stream: MediaStream;
	signaling!: WebSocket;
	remoteId!: number;
	remoteStream!: MediaStream;

	constructor(signaling: WebSocket | null, localId?: number | null) {
		localId ? (this.id = localId) : (this.id = Date.now());
		this.pc = new RTCPeerConnection(config);
		if (signaling) this.signaling = signaling;
		this.remoteStream = new MediaStream();
		// this.stream = stream;
	}

	start(stream: MediaStream | null, remoteId: number) {
		if (!this.signaling) {
			console.log('No signaling server...!');
			return;
		}
		this.remoteId = remoteId;
		this.pc.onicecandidate = this.handleIceCandidate;
		this.pc.onnegotiationneeded = this.negotiate;
		this.pc.ontrack = this.handletracks;
		stream?.getTracks().forEach((track) => {
			this.pc.addTrack(track, stream);
		});

		this.pc.onsignalingstatechange = async (e: Event) => {
			if (this.pc.signalingState === 'have-local-offer') {
				let data = {
					type: 'offer',
					from: this.id,
					to: this.remoteId,
					offer: this.pc.localDescription,
				};
				this.signaling.send(JSON.stringify(data));
			} else if (this.pc.signalingState === 'have-remote-offer') {
				const answer = await this.pc.createAnswer();
				await this.pc.setLocalDescription(answer);
				let data = {
					type: 'answer',
					from: this.id,
					to: this.remoteId,
					answer: this.pc.localDescription,
				};
				this.signaling.send(JSON.stringify(data));
			}
		};
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
				`localid_${this.id} - Error negotiating with remote_${this.remoteId} ${e}`
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
		let data: candidateResp = {
			type: 'candidate',
			from: this.id,
			to: this.remoteId,
			candidate: candidate.candidate,
		};
		this.signaling.send(JSON.stringify(data));
	}

	handletracks({ track }: RTCTrackEvent) {
		// this.remoteTracks.push(track);
		this.remoteStream.addTrack(track);
	}

	/*
	 *	Getters and setters
	 */

	getRemoteStream() {
		return this.remoteStream;
	}
}

export default PeerConnection;
