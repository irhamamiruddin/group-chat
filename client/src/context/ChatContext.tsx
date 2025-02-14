import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../utils/websocket";

interface Message {
	sender: string;
	content: string;
	createdAt: string;
}

interface ChatContextType {
	messages: Message[];
	sendMessage: (content: string) => void;
	joinGroup: (groupId: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const groupId = "TEMP_GROUP_ID";

	useEffect(() => {
		socket.connect();
		socket.on("receive_message", (message: Message) => {
			setMessages((prev) => [...prev, message]);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const sendMessage = (content: string) => {
		socket.emit("send_message", { groupId, senderId: "user_id", content });
	};

	const joinGroup = (groupId: string) => {
		socket.emit("join_group", groupId);
	};

	return (
		<ChatContext.Provider value={{ messages, sendMessage, joinGroup }}>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => {
	const context = useContext(ChatContext);
	if (!context) throw new Error("useChat must be used within a ChatProvider");
	return context;
};
