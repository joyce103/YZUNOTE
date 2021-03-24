const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/Project";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("like連線成功");
});

const likeSchema = new mongoose.Schema({
    name:String,
    account: String,
    title: String,
    texts: String
});

likeSchema.set('collection', 'like');
const model = mongoose.model('like', likeSchema);

module.exports = model;