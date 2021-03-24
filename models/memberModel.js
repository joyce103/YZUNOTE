const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/Project';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("帳號連線成功");
});

const memberSchema = new mongoose.Schema({ //宣告一個資料庫裏面有name account password
    name: String,
    account: String,
    password: String,
    class: Array,//課表的資料庫定義為陣列
});

memberSchema.set('collection', 'member');
const model = mongoose.model('member', memberSchema);

module.exports = model;