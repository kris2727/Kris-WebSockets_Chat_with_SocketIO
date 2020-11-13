var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

io.on('connection', (socket) => {
   // io.emit('chat message', "A User connected");
    socket.on('chat message', (msg) => {
      //io.emit('chat message', msg);
      socket.broadcast.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        io.emit('chat message',"A user left the chat");
      });
  });

http.listen(3003, () => {
    console.log('listening on *:3003');
});