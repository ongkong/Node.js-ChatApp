var socket = require('socket.io'), guestlist = {}, userlist = [], io;

exports.attach = function(server){
  io = socket(server);
  io.sockets.on('connection', function(socket){
    handlesetup(socket);
    handleleave(socket);
    handlemessage(socket);
  });
};
// to remove by items in Arrays
Array.prototype.remove = function(item){
  var index = this.length;
  while (index--){
    if (this[index] === item){
      this.splice(index,1)
    }
  };
};

function handlesetup(socket){
  // when the client enters desired nickname
  socket.on('set name', function(name){
    guestlist[socket.id] = name;
    socket.join('main room');
    console.log(guestlist[socket.id] + ' has joined the club!');
  // build and send a userlist to client
    userlist.push(guestlist[socket.id]);
    socket.emit('user list', userlist);
    socket.broadcast.to('main room').emit('update list', guestlist[socket.id]);
  });
};

function handleleave(socket){
  socket.on('disconnect', function(){
    if (guestlist[socket.id]){
      console.log(guestlist[socket.id] + 'has disconnected');
      socket.broadcast.to('main room').emit('user disconnection', guestlist[socket.id]);
      userlist.remove(guestlist[socket.id]);
      console.log(userlist);
      socket.broadcast.to('main room').emit('user list', userlist);
    }  else {
      console.log(socket.id +'(unregistered user) has disconnected');
    }
    delete guestlist[socket.id];
  });
};

function handlemessage(socket){
  socket.on('message', function(msg){
    socket.broadcast.to('main room').emit('alien message', guestlist[socket.id], msg);
    console.log(guestlist[socket.id] + ' sent ' + msg);
  });
};

