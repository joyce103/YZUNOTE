const express = require('express');
const router = express.Router();
//這裡放置與會員相關的API程式碼
const memberModel = require('../models/memberModel');
const noteModel = require('../models/noteModel');
const listModel = require('../models/listModel');
const likeModel = require('../models/likeModel');
//註冊功能路由
router.post('/register', function(req, res){
    const newMember = new memberModel({
        name: req.body.name,
        account: req.body.account,
        password: req.body.password
    });
    memberModel.countDocuments({account: req.body.account}, function(err, data){
        if(data>0){
            res.json({"status":1, "msg":"此帳號已被註冊!"});
        } else {
            newMember.save(function(err, data){
                if(err){
                    res.json({"status":1, "msg":"error"});
                } else {
                    res.json({"status":0, "msg":"success", "data":data});
                }
            });
        }
    });
});
//登入功能路由
router.post('/login', function(req, res){
    memberModel.findOne({account:req.body.account, password:req.body.password}, function(err, data){
        if(data == null){
            res.json({"status":1, "msg":"帳號密碼錯誤!"});
        } else if(err){
            res.json({"status":1, "msg":"error"});
        } else {
            res.json({"status":0, "msg":"success", "data":data});
        }
    })
});

//修改密碼路由
router.post('/changePW', function(req, res){
    memberModel.findOne({account:req.body.account, password:req.body.oldpassword}, function(err, data){
        if(data==null){
            res.json({"status":1, "msg":"舊密碼輸入錯誤!"});
        } else {
            data.password = req.body.newpassword;
            data.save(function(err){
                if(err){
                    res.json({"status":1, "msg":"error"});
                } else {
                    res.json({"status":0, "msg":"success!"});
                }
            });
        }
    });
});
 ///////////////將課表傳入後端路由////////////////
router.post('/classinput',function(req,res){
    memberModel.findOne({account:req.body.account},function(err, data){
        data.class=(req.body.class).split(","); //將字串用逗號分隔開來傳進資料庫陣列
        data.save(function(err,data){
            if(err){
                res.json({"status":1, "msg":"error"});
            } else {
                res.json({"status":0, "msg":"success!", "data":data});
            }
        });
        console.log(data.class);          
    });
});

////////////////將課表傳入前端路由//////////////////
router.post('/classoutput',function(req,res){
    memberModel.findOne({account:req.body.account},function(err,data){
        if(data==undefined){
            res.json({"status":1, "msg":"error"});
        }else{
            var str3=data.class[0];
            for(var i=1;i<78;i++){
                str3+=(","+data.class[i]);
            }
            res.json({"status":0, "msg":"success!", "data":str3});
        }
    });
});

////////////////////尋找名字路由/////////////////////
router.post('/logname',function(req,res){
    memberModel.findOne({account:req.body.account},function(err,data){
        if(err){
            res.json({"status":1, "msg":"error"});
        }else{
            res.json({"status":0, "msg":"success!", "name":data.name});
        }
    });
})

//搜尋
router.post('/search', function(req, res){
    const word = req.body.Keywords;
    noteModel.find()
        .lean()
        .exec(function(err, data){
            if (err) return res.json({"status":1, "msg":"error"})
            const search = data.filter(note => {
                return   note.account.toLowerCase().includes(word.toLowerCase())
                || note.name.toLowerCase().includes(word.toLowerCase()) 
                || note.title.toLowerCase().includes(word.toLowerCase()) 
                || note.class.toLowerCase().includes(word.toLowerCase())
            })
            res.json({"status":0, "msg":"success!", "search":search});
    })
});

//bar條搜尋
router.post('/barsearch',function(req,res){
    noteModel.find({class:req.body.barclass},function(err,data){
        if(err){
            console.log(err);
        }else{
            res.json({"status": 1,"data":data});
        }
    });
});

//person筆記清單顯示
router.post('/notelist',function(req,res){
    noteModel.find({"account":req.body.account},function(err,data){
        if(err){
            console.log({"status": 0,"data":err});
        }else{
            res.json({"status": 1,"data":data});
        }
    });
});

//新增筆記
router.post('/addNote', function(req, res){
    const newEditor = new noteModel({
        account: req.body.account,
        name: req.body.name,
        title: req.body.title,
        texts: req.body.texts,
        class: req.body.class,
        status: req.body.status
    });
    noteModel.findOne({account:req.body.account, title:req.body.title, class:req.body.class}, function(err, data){
        if(data == undefined){
            newEditor.save(function(err, data){
                if(err) {
                  res.json({"status":1, "msg":"error"});
                  console.log("新增失敗");
                } else {
                  res.json({"status":0, "msg":"success", "data":data});
                  console.log("新增成功");
                }
            })
        }else{
            res.json({"status":2, "msg":"此課程中已有相同標題筆記!", "data": data});
        }
    })
});
  
router.post('/updateNote', function(req, res){
    noteModel.findOne({account:req.body.account, title:req.body.title, class:req.body.class},function(err, data){
        if(err) {
            res.json({"status":1, "msg":"error"});
        } else {
            // res.json({"status":0, "msg":"success", "data":data});
            const updatenote = new noteModel({texts: data.texts, status: data.status});
                updatenote.save(function(err, data){
                if(err) {
                    res.json({"status":1, "msg":"更新失敗"});
                } else {
                    res.json({"status":0, "msg":"更新成功", "data":data});
                }
            });
        }
    });
});

//list清單的東西
router.post('/addList', function (req, res) {
    var newlist = new listModel({
        account: req.body.account,
        title: req.body.title,
        msg: req.body.msg,
        status: false
    });
    newlist.save(function (err, data) {
        if (err) {
            res.json({ "status": 1, "msg": "error" });
            console.log("add error");
        } else {
            res.json({"status": 0, "msg": "success", "data": data});
            console.log("add success");
        };
    });
});

router.post('/getList', function(req, res) {
    listModel.find({account: req.body.account},function(err, data){
        if(err) console.log(err);
        res.json(data);
    }); 
});

router.post('/updateList',function(req,res){
    var id = req.body.id;
    listModel.findById(id, function (err, data) {
        if(err){
            console.log(err);
            res.json({"status": 1, "msg": 'error'});
        }
        else{
            data.title = req.body.title;
            data.msg = req.body.msg;
            data.save(function(err){
                if(err){
                    console.log(err);
                    res.json({"status": 1, "msg": 'error'});
                }
                else{
                    res.json({"status": 0, "msg": 'success'});
                };
            });
        };
    });
});

router.post('/removeList',function(req,res){
    var id = req.body.id;
    listModel.remove({_id: id}, function (err, data) {
        if(err){
            console.log(err);
            res.json({"status": 1, "msg": 'error'});
        }
        else{
            res.json({"status": 0, "msg": 'success'});
        };
    });
});

router.post('/changeStatus',function(req,res){
    var id = req.body.id;
    listModel.findById(id, function (err, data) {
        if(err){
            console.log(err);
            res.json({"status": 1, "msg": 'error'}); }
        else{
            if(data.status){
                data.status=false;
            }
            else{
                data.status=true;
            };
            data.save(function(err){
                if(err){
                    console.log(err);
                    res.json({"status": 1, "msg": 'error'});
                }
                else{
                    res.json({"status": 0, "msg": 'success'});
                };
            });
        };
    });
});

router.post('/heart', function(req, res){
    noteModel.findOne({"account":req.body.account,"title":req.body.title},function(err,data){
        console.log(req.body.account);
        console.log(req.body.title);
        console.log(data);
        if(err){

        }else{
            res.json({"data":data});
        }
    });
});
router.post('/addlike', function(req, res){
    const newEditor = new likeModel({
        name: req.body.name,
        account: req.body.account,
        title: req.body.title,
        texts: req.body.texts,
    });
    newEditor.save(function(err,data){
        if(err){

        }else{
            res.json({"status":0, "msg":"成功"});
        }
    });

});
router.post('/likeoutput',function(req,res){
    likeModel.find({'name':req.body.name},function(err,data){
        res.json({'data':data});
    });
});

  
module.exports = router;