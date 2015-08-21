var http = require('http'), fs = require('fs'), mime = require('./mime'), chatapp = require('./chatapp.js'), Mongoclient = require('mongodb').MongoClient;

var error404 = function(res){
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Error 404: halt yo');
};
var send = function(res, path, body){
  res.writeHead(200, {'Content-Type': mime.check(path)});
  res.end(body);
};

var app = http.createServer(function(req, res){
  var path = './public';
  if (req.url == '/'){
    path += '/index.html';
  }  else{
    path += req.url;
  }
  fs.exists(path, function(exist){
    if (!exist){
      error404(res);
    }  else{
      fs.readFile(path, function(err, data){
        if (err){
          error404(res);
        }  else{
          send(res, path, data);
        }
      });
    }
  });
});
app.listen(9001);
console.log('app is listening on port 9001');
chatapp.attach(app);
