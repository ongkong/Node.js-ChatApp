var socket = io(), chat = Chatapp(socket),
display = document.getElementById('display'),
form = document.getElementById('sendform'),
msg = document.getElementById('sendmsg'),
list = document.getElementById('userlist');

function checkname(){
  if (msg.value.match(/\W/)){
    // catches invalid chars
    alert('ENTER ONLY WORD CHARACTERS PLEASE!!!');
    msg.value = '';
  }  else {
    chat.setName(msg.value);
  }
  return false;
};
function sendmsg(){
	var linkresults = parselinks(msg.value);
  if (msg.value.match(/<.+>|<.+\/>/)){
    alert('I heard what you\'re doing is bad. Not sure why though (XSS scripting?)');
		msg.value = '';
  }  else if (linkresults.linklist.length > 0) {
		// handles when a link is found
		handlelink(linkresults);
		console.log(linkresults.linklist, linkresults.regex, linkresults.regexindex);
		return false;
	}  else {
   // send the msg and move the scroll down
    chat.sendMessage(msg.value);
    display.insertAdjacentHTML('beforeend','<div>' + msg.value + '</div>');
    display.scrollTop = display.scrollHeight - display.clientHeight;
		msg.value = '';
  }
	console.log(linkresults.linklist, linkresults.regex, linkresults.regexindex);
  return false;
};

socket.on('alien message', function(user, text){
  display.insertAdjacentHTML('beforeend','<div>' + user + ': ' + text + '</div>');
  display.scrollTop = display.scrollHeight - display.clientHeight;
});
socket.on('user disconnection', function(user){
  display.insertAdjacentHTML('beforeend','<div>' + user + ' has disconnected</div>');
});
socket.on('user list', function(userlist, setup){
  if (setup){
    display.innerHTML= '<div>' + 'Your new name is ' +  msg.value + '</div>';
		document.getElementById('name').textContent = msg.value;
    form.onsubmit = sendmsg;
    msg.value = '';
  }
  list.innerHTML = '';
  for (var index in userlist){
    list.insertAdjacentHTML('beforeend','<div>' + userlist[index] + '</div>');
  };
});
socket.on('prevmsgs', function(prevmsgs){
	prevmsgs.forEach(function(element, index, array){
		display.insertAdjacentHTML('beforeend','<div>' + '[' + element.date + ']' + '  ' + element.name + ': ' + element.message + '</div>');
		display.scrollTop = display.scrollHeight - display.clientHeight;
	});
});
socket.on('update list', function(user){
  list.insertAdjacentHTML('beforeend','<div>' + user + '</div>');
});
socket.on('name taken', function(){
  display.innerHTML= '<div>That name is taken, enter another one please</div>'
  msg.value = '';
});
socket.on('name long', function(){
	display.innerHTML = '<div>That name is too long, enter another one please</div>'
	msg.value = '';
});

 // initial conditions
display.innerHTML = '<div>Hello! Please enter a name</div>'
form.onsubmit = checkname;
