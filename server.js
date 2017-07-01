var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); 
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); 
var bodyParser = require('body-parser');

app.use(bodyParser.json()); 

var url = 'mongodb://localhost:27017/UserChat';
	
MongoClient.connect(url, function(err, db){
	assert.equal(null, err); 
	console.log('Connected to database.');
	db.close(); 
})

var findUser = function(db, userInfo, callback){
	username = userInfo.username;
	password = userInfo.password;
	 db.collection('users').find({"username":username,"password":password}).toArray(function(err, documents){
	 	let userFound;
		if(documents.length>0){
			userFound = true;
		} else {
			userFound = false; 
		}

		callback(userFound);
	 })
	
	//Need to implement a promise or callback function somewhere. This line executes before array is iterated through. 


}

app.get('/', function(req, res){
	console.log('Got a request');
	res.send('<h1>Hello World!</h1>')
})

app.post('/login', function(req, res){
	console.log('got login request'); 
	let userInfo = req.body;
	let username = req.body.username;
	let password = req.body.password;
	console.log(`Username: ${username}`+'\n'+
	`Password: ${password}`);
	//Implement better error checking
	MongoClient.connect(url, function(err,db){
		assert.equal(null,err);
		findUser(db, userInfo, function(userFound){
			res.json({"userFound":userFound});
		})
	})	
}); 

io.on('connection', function(socket){
	console.log('a user has connected'); 
	
	socket.on('disconnect', function(){
		console.log('a user has disconnected')
	})
	
	socket.on('msg', function(message, user){
		/* Pseudo Code
			if(!validateUser(user)){
				socket.send('invalid user', {JSON OBJECT CONTAINING DETAILS})
				return; 
			}
			// DBWrapper will be a wrapper class for MongoDB written on and exported from a separate file 
			DBWrapper.addMessage(user, message, function(){
					DBWrapper.getMessages(function(messages, err){
							if (err){
								return err; 
							}
							socket.send('messages', messages);
						)
				) 
			}
		*/
	})
})

http.listen(3000, function(){
	console.log('Listening on *:3000')
})

