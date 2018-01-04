var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    Sender: String,
    Recipient: String,
    Content: String
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;