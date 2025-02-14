import { useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

const Chat: React.FC = () => {
	const { user, logout } = useAuth();

	useEffect(() => {
		console.log(user);
	}, [user]);

	return (
		<div>
			<h2>Welcome, {user?.username}!</h2>
			<button onClick={logout}>Logout</button>
		</div>
	);

	const { messages, sendMessage, joinGroup } = useChat();
	const [message, setMessage] = useState("");

	return (
		<div className="chat-container">
			<h2>Group Chat</h2>
			<button onClick={() => joinGroup("your_group_id")}>Join Group</button>
			<div className="messages">
				{messages.map((msg, index) => (
					<div key={index}>
						<strong>{msg.sender}: </strong>
						{msg.content}
					</div>
				))}
			</div>
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				placeholder="Type a message..."
			/>
			<button
				onClick={() => {
					sendMessage(message);
					setMessage("");
				}}
			>
				Send
			</button>
		</div>
	);
};

export default Chat;
