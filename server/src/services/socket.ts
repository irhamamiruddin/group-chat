import { Server, Socket } from 'socket.io';

export const initSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("join_group", (groupId: string) => {
            socket.join(groupId);
            console.log(`User joined group ${groupId}`);
        });

        socket.on("send_message", ({ groupId, message }: { groupId: string; message: string }) => {
            io.to(groupId).emit("receive_message", message);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};