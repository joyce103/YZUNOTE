const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/Project";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("note連線成功");
});

const noteSchema = new mongoose.Schema({
    account: String,
    name: String,
    title: String,
    class: String,
    texts: String,
    status: Boolean
});

noteSchema.set('collection', 'note');
const model = mongoose.model('note', noteSchema);

module.exports = model;