import type MsgData from '@/lib/MsgData'
import { createServer } from 'http'
import next from 'next'
import { Server } from 'socket.io'
import { fetchChatsUserBelongsTo } from '@/actions/chat'


const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

	const io = new Server(httpServer, {
		path: '/api/socket',
		cors: {
			origin: true,
		}
	});

	io.on('disconnect', (socket: any) => {
		console.log("DISCONNECTED " + socket.id)
	})

  io.on("connection", async (socket: any) => {
		console.log("CONNECTED " + socket.id)


		socket.join(1)
		socket.join(2)

		const userID = 238492384   // random int
		const chatsToJoin = await fetchChatsUserBelongsTo(userID)
		if (chatsToJoin.statusSuccess) {
			for (let chat of chatsToJoin.data) {
				socket.join(chat)
			}
		}

		socket.on('chat-msg', (msgData: MsgData) => {
			io.in(msgData.chatID.toString()).emit('chat-msg', msgData)
		})
  });

  httpServer
    .once("error", (err: any) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

