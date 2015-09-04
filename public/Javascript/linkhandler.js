var parselinks = function(message){
	var linkinfo = {}, message = message.split(' ');
	// if links found linkinfo object to be passed to server.
	// regex with capture groups used to create anchor elements.
	linkinfo.linklist = [];
	linkinfo.regex = '^';
	linkinfo.regexindex = [];
	for (var i = 0; i<message.length; i++){
		if ('*'.valid(message[i].toString())){
			if (/https?:\/\//.test(message[i])){
				linkinfo.linklist.push(message[i]);
			}  else {
				linkinfo.linklist.push('http://' + message[i]);
			}
			linkinfo.regex += '(.+)';
			linkinfo.regexindex.push(i);
			if (!(i === message.length-1)){
				linkinfo.regex += '\\s';
			}  else {
				linkinfo.regex += '$';
			}
		}	 else {
			linkinfo.regex += '('+ message[i].replace(/([\/\$\\\^\*\+\?\.])/g,'\\$&');
			if (!(i === message.length-1)){
				linkinfo.regex += '\\s)';
			}  else {
				linkinfo.regex += ')$';
			}
		}
	}
	return linkinfo;
}
var handlelink = function(linkinfo) {
// build html elements to prompt alternate link names
	display.insertAdjacentHTML('afterend','<div id=\'linkrename\'><form id=\'linkform\'></form></div>');
	var linkform = document.getElementById('linkform');
	msg.disabled = true;
	for (var i = 0; i<linkinfo.linklist.length; i++){
		linkform.insertAdjacentHTML('beforeend','<label>'+linkinfo.linklist[i]+'</label><input type=\'text\' id=\''+String(i)+'\'/>');
	}
	linkform.insertAdjacentHTML('beforeend','<input type=\'submit\' style=\'position: absolute; left: -9999px\'/>');
	function sendlink(){
		var altnames = [];
		console.log('before altname asignment');
		for (var i = 0; i<linkinfo.linklist.length; i++){
			var text = document.getElementById(String(i)).value;
			if ((text==='') | /^\s+$/.test(text)){
				altnames.push(linkinfo.linklist[i]);
			}  else if(/<.+>|<.+\/>/.test(text)){
				alert('I heard what you\'re doing is bad. Not sure why though (XSS scripting?)');
				text = '';
				return false;
			}  else {
				altnames.push(text);
			}
		}
		console.log('alt name is');
		function replacelink(){
			var args = Array.prototype.slice.call(arguments, 1, arguments.length-2), newstring = '', link, replacement, tag;
			console.log(args);
			for (var i = 0; i<args.length; i++) {
				if (linkinfo.regexindex.indexOf(i) !== -1){
					replacement = altnames.shift();
					link = linkinfo.linklist.shift();
					tag = '<a target=\'_blank\' href=\'' + link + '\'>' + replacement + '</a> ';
					newstring += tag;
				}  else {
					newstring += args[i];
				}
			}
			console.log(newstring);
			return newstring;
		};
		var text = msg.value;
		var regex = new RegExp(linkinfo.regex);
		text = text.replace(regex, replacelink);
    display.insertAdjacentHTML('beforeend','<div>' + text + '</div>');
    display.scrollTop = display.scrollHeight - display.clientHeight;
		chat.sendMessage(text);
		msg.disabled = false;
		msg.value = '';
		document.getElementById('linkrename').parentNode.removeChild(document.getElementById('linkrename'));
		return false;
	}
	console.log(typeof sendlink);
	linkform.onsubmit = sendlink;
	console.log('linkform assignment success');
}
