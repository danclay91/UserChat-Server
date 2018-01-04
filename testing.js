var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var Message = require('./models/message.model');
var mongoDB = 'mongodb://localhost:27017/messagedb';

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";


mongoose.Promise = global.Promise;

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.once('open', ()=> {console.log('connected to DB')})
    .on('error', console.error.bind(console, 'MongoDB connection error'));



var testingObj = {
    "message": "THIS IS FROM JSON",
    "Recipient": "Andrew"
}; 

app.get('/', function(req, res){
	console.log('Got a request');
	res.send('Hello from server');
})

app.get('userlogin/:username/:password', function(req,res){

});

app.get('/messages/:user', function(req,res){
    console.log('GOT A REQUEST FOR MESSAGES');
    console.log(`USERNAME: ${req.params.user}`);

    Message.find({Sender: req.params.user})
        .then((messages)=>{
            res.send(messages);
        })
        .catch((err)=>{
            console.error(err);
            res.send("ERROR");
        });
})

app.get('/testjson', function(req, res){
    console.log('Got a request for JSON REQUEST')
  //  res.send(JSON.stringify(testingObj)); 
    var myMessage = new Message({Sender: "Danny", Recipient: "Andrew", Content: 'What up dude asd'});
   myMessage.save()
        .then(()=>{
            console.log('Message Saved');
        })
        .catch((err)=>{
            console.error('Error in saving');
        });
})

http.listen(3000, function(){
	console.log('Listening on *:3000')
})

