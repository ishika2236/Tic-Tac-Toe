# Backend:
## Server.js
### const app = express() : we create an express app 
### const server = http.createServer(app): we're manually creating http server that wraps around out express app, this gives more functionality when using additional features like web sockets
###  const io = socketIo(server): allows real-time communication between client and server and attaches Socket.io functionality to the server we just created. 