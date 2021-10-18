import React from 'react'

function ChatBox() {
	return <div style={chatboxStyles}>This is the chatbox</div>
}
const chatboxStyles: React.CSSProperties = {
	// height: '100%',
	flexGrow: 1,
	border: '1px solid blue',
}
export default ChatBox
