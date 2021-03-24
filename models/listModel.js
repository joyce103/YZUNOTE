const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/Project";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("list連線成功");
}); 

const listSchema = new mongoose.Schema({
    account: String,
    title: String,
    msg: String,
    status: Boolean
});

listSchema.set('collection', 'list');
const model = mongoose.model('list', listSchema);
module.exports = model;