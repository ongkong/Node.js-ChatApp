var Chatapp = function(socket){
// javascript 'object' (as per guidelines in Javascript: The Good Parts) to 
// handle iemiting to server
  that = {};
  that.setName = function(name){
    socket.emit('set name', name);
  };
  that.sendMessage = function(msg){
    socket.emit('message', msg);
  };
  that.getUserList = function(){
    socket.emit('userlist')
  };
  return that;
};

