var client = require('mongodb').MongoClient, uri = 'mongodb://localhost:27017/chat';

exports.getMsgs = function(callback){
  client.connect(uri, function(err, db){
    if (err) throw err;
		var cursor = db.collection('messages').find({}, {name: 1, message: 1, date: 1, _id: 0}), messages = [];
    cursor.each(function(err, doc){
			if (err) throw err;
			if (doc != null){
				messages.push(doc);
			}  else {
				db.close();
				callback(messages);
			}
    });   
  });
};

exports.writeMsg = function(name, message){
	client.connect(uri, function(err, db){
		if (err) throw err;
		db.collection('messages').insertOne({
			"date": new Date(),
			"name": name,
			"message": message
		}, function(err, result) {
			if (err) throw err;
			db.close();
		});
	});
};
