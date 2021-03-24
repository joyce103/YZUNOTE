var edit=0;
var classoutput=new Array(78); //課表陣列
var a=new Array(78); //將課表定義為陣列
var str; //定義一個字串
let x=new Array(3);//將todolist定義為陣列
var strr;
var todolist = []; // 存放待辦清單
var id = 1; // 待辦項目id

$(document).ready(function(){
  Note();
  //呼叫list
  getList();
  ///////////////////////呼叫課表並傳入/////////////////////////
  $.post("/member/classoutput", {'account':$.cookie('userID')}, function(res){
    console.log($.cookie('userID'));
    if(res.status==1){
      console.log("失敗");
    }else{
      classoutput=res.data.split(",");
      if(classoutput[0]=="undefined"){
        for(var j=0;j<78;j++){
          for(var i=0;i<13;i++){
            $("#"+(i+1)+"-1").val("");
            $("#"+(i+1)+"-2").val("");
            $("#"+(i+1)+"-3").val("");
            $("#"+(i+1)+"-4").val("");
            $("#"+(i+1)+"-5").val("");
            $("#"+(i+1)+"-6").val("");
          }
        }
      }else{
        for(var i=0;i<13;i++){
          $("#"+(i+1)+"-1").val(classoutput[i]);
          $("#"+(i+1)+"-2").val(classoutput[i+13]);
          $("#"+(i+1)+"-3").val(classoutput[i+26]);
          $("#"+(i+1)+"-4").val(classoutput[i+39]);
          $("#"+(i+1)+"-5").val(classoutput[i+52]);
          $("#"+(i+1)+"-6").val(classoutput[i+65]);
        }
      }
    }
  });
  
  

  document.getElementById("stID").innerHTML=$.cookie('userID');
  $.post("/member/logname", {'account':$.cookie('userID')}, function(res){
    if(res.status==1){

    }else{
      document.getElementById("name").innerHTML=res.name;
    }
  });
  $('.curriculumbtn').hide();
    $('.table').hide();
    $('.note').show();
    $('#todo').hide();
    //點擊課表
    $('#curriculum').click(function(){
        Class();
    });
    //點擊筆記清單
    $('#notelist').click(function(){
        Note();
    });
    //點擊收藏清單
    $('#save').click(function(){
        Save();
    });
    //點擊待辦事項todolist
    $('#todolist').click(function(){
        Todo();
    });
   
   ///////////////////////////////填寫課表////////////////////////////////////
    $('.curriculumbtn').click(function(){


      //////////////課表(新增)///////////////////////
      if(edit==1){
        for(var i=0;i<13;i++){ //將資料依序傳入陣列中
          a[i]=$("#"+(i+1)+"-1").val();
          a[i+13]=$("#"+(i+1)+"-2").val();
          a[i+26]=$("#"+(i+1)+"-3").val();
          a[i+39]=$("#"+(i+1)+"-4").val();
          a[i+52]=$("#"+(i+1)+"-5").val();
          a[i+65]=$("#"+(i+1)+"-6").val();
        } 
        str=a[0];
        console.log(str);
          for(var i=1;i<78;i++){ //將陣列傳入字串
            str+=","+a[i];
          }
          $.post("/member/classinput", {'account':$.cookie('userID') ,'class':str}, function(res){
              console.log('成功');
          });
      }
      //////////////課表(新增)///////////////////////


        //若點擊編輯鈕則把input改為可輸入
        if(edit==0){
            $('.curriculumtext').attr('readonly',false);
            $('.curriculumbtn').val("完成");
            edit=1;
        }else{ //若點擊完成鈕則把input改為不可輸入
            $('.curriculumtext').attr('readonly',true);
            $('.curriculumbtn').val("編輯");   
            edit=0;
        }

    });
    //跳頁
    $('#search').click(function(){
      location.href='/public/Search.html'
    });
    $('#add').click(function(){
      location.href='/public/Note.html'
    });
    //加list
    $('#btncheck').click(function(){ 
      console.log('add');
      addList();
    });

    //代辦事項list
    function addList() {
      var _title = $('#title').val();
      var _message = $('#message').val();
      var _account = $.cookie('userID');
      if (_title == "" || _message == "") {
            alert(" 請輸入標題和內容!");
      } else {
        $.post("/member/addList", {'account': _account, 'title': _title, 'msg': _message}, function (res) {
            newList(res.data);
            $('#title').val('');
            $('#message').val('');
        });
      }
    }
  
    function getList(){
      $.post("/member/getList",{'account':$.cookie('userID')},function(data, status){
        for(var i=0;i<data.length;i++){
          newList(data[i]);
        }
      })
    }
  
    function newList(data) {
        var status = (data.status) ? "checked" : "";
        var titleClass = (data.status) ? "title2" : "title";
        var messageClass = (data.status) ? "message2" : "message";
        var editClass = (data.status) ? "none" : "inline";
        let content=
        `<div class="input-group mb-3 wait__item" id="${data._id}">
            <div class="input-group-prepend">
            <div class="input-group-text">
            <input type="checkbox" class="myCheck" onclick="checkStatus('id="${data._id}', this)>
            </div>
            </div>
            <input type="text" class="form-control col-sm-2" id="title${data._id}" value="${data.title}" readonly>
            <input type="text" class="form-control col-sm-9" id="message${data._id}" value="${data.msg}" readonly>
            <div class="input-group-append" id="button-addon4">
              <div class="wait__item__icons__modify btn-outline-secondary" id="edit${data._id}" style="display:${editClass}" onclick="editList('${data._id}')">
                <i class="fas fa-pencil-alt"></i>
              </div>
              <div class="wait__item__icons__done btn-outline-secondary" id="update${data._id}" style="display:none" onclick="updateList('${data._id}')" >
                <i class="far fa-check-circle"></i>
              </div>
              <div class="wait__item__icons__trash btn-outline-secondary" onclick="removeList('${data._id}')">
                <i class="fas fa-trash-alt"></i>
              </div>
            </div>
        </div>`
        $('.wait').append(content);
    }
  
  });
function editList(id) {
  $('#edit' + id).css("display", "none");
  $('#update' + id).css("display", "inline");

  var input = document.createElement("input");
  input.type = "text";
  input.id = "edit_title" + id;
  input.value = $('#title' + id).text();
  input.size = Math.max(20 / 4 * 3, 4);

  $('#title' + id).css("display", "none");
  $('#title' + id).parent().append(input);

  var message_input = document.createElement("input");
  message_input.type = "text";
  message_input.id = "edit_message" + id;
  message_input.value = $('#message' + id).text();
  message_input.size = Math.max(50 / 4 * 3, 4);

  $('#message' + id).css("display", "none");
  $('#message' + id).parent().append(message_input);
}

function updateList(id) {
  var title = $('#edit_title' + id).val();
  var message = $('#edit_message' + id).val();

  $.post("/member/updateList", {'id':id, 'title':title,'msg':message},　function(res){
      if(res.status==0){
          $('#title'+id).val(title);
          $('#message'+id).val(message);
          $('#edit'+id).css("display","inline");
          $('#update'+id).css("display","none");
          $('#title'+id).css("display","inline");
          $('#message'+id).css("display","inline");
          $('#edit_title'+id).remove();
          $('#edit_message'+id).remove();
      }
  });
}

function removeList(id) {
  console.log("removeBtn");
  $.post("/member/removeList", {'id':id}, function(res){
      if(res.status==0){
          $('#'+id).remove();
      }
  });
}

function changeStatus(id, btnstatus) {
  console.log("沒寫啦");
}

function Class(){
  console.log("點擊課表");
  //改變選單顏色
  $('#curriculumbar').css("background-color","#edb5bf");
  $('#notelist1').css("background-color","#8c9094");
  $('#savebar').css("background-color","#8c9094");
  $('#todolistbar').css("background-color","#8c9094");
  //顯示課表
  $('.table').show();
  $('.curriculumbtn').show();
  //標題變為“課表”
  $('#title').text("課表");
  //改變顏色
  $('#leftbar').css("background-color","#efefefff");
  //隱藏筆記清單
  $('.content').hide();
  //隱藏收藏清單
  //隱藏代辦事項
  $('#todo').hide();
}

function Save(){
  
  // $('.content').remove();
  console.log("點擊收藏清單");
  //改變選單顏色
  $('#curriculumbar').css("background-color","#8c9094");
  $('#notelist1').css("background-color","#8c9094");
  $('#savebar').css("background-color","#edb5bf");
  $('#todolistbar').css("background-color","#8c9094");
  //顯示收藏清單

  //標題變為“收藏清單”
  $('#title').text("收藏清單");
  //改變顏色
  $('#leftbar').css("background-color","#efefefff");
  //隱藏課表
  $('.table').hide();
  $('.curriculumbtn').hide();
  //隱藏筆記清單
  $('.content').hide();
  //隱藏代辦事項
  $('#todo').hide();

  $.post("/member/likeoutput", {'name':$.cookie('stID')}, function(res){
    for(var i=0; i<res.data.length; i++){
    let content = 
    `<div class="content">
          <div class="top">
              <img id="portrait" src='/public/images/user.png'>
              <p class="name" id="name${res.data[i]._id}">${res.data[i].account}</p>
              <img src="images/heart.png" id="heart">
          </div>
          <div class="center" id="center${res.data[i]._id}">${res.data[i].texts}</div>
          <div class="bottom">
              <p class="heading" id="heading${res.data[i]._id}">${res.data[i].title}</p>
              <p class="date"></p>
          </div>
      </div>`
    $('#leftbar2').append(content);
    }
  });
}

function Note(){
  
  $('.content').remove();
  console.log("點擊筆記清單");
  //改變選單顏色
  $('#curriculumbar').css("background-color","#8c9094");
  $('#notelist1').css("background-color","#edb5bf");
  $('#savebar').css("background-color","#8c9094");
  $('#todolistbar').css("background-color","#8c9094");
  //顯示筆記清單
  $('.content').show();
  //標題變為“筆記清單”
  $('#title').text("筆記清單");
  //改變顏色
  $('#leftbar').css("background-color","#efefefff");
  //隱藏課表
  $('.table').hide();
  $('.curriculumbtn').hide();
  //隱藏收藏清單
  //隱藏代辦事項
  $('#todo').hide();
  //傳入筆記們
  $.post("/member/notelist", {'account':$.cookie('userID')}, function(res){
    console.log(res);
    if(res.status == 1){
        for(var i=0; i<res.data.length ; i++){
          let content = 
          `<div class="content">
                <div class="top">
                    <img id="portrait" src='/public/images/user.png'>
                    <p class="name" id="name${res.data[i]._id}">${res.data[i].name}</p>
                    <img src="images/heart.png" id="heart">
                </div>
                <div class="center"id="center${res.data[i]._id}">${res.data[i].texts}</div>
                <div class="bottom">
                    <p class="heading" id="heading${res.data[i]._id}">${res.data[i].title}</p>
                    <p class="date"></p>
                </div>
            </div>`
          $('#leftbar2').append(content);
        }
      }
  });
}

function Todo(){
  console.log("點擊代辦事項");
  //改變選單顏色
  $('#curriculumbar').css("background-color","#8c9094");
  $('#notelist1').css("background-color","#8c9094");
  $('#savebar').css("background-color","#8c9094");
  $('#todolistbar').css("background-color","#edb5bf");
  //顯示todolist
  $('#todo').show();
  //標題變為“TodoList”
  $('#title').text("Todo List");
  //改變顏色
  $('#leftbar').css("background-color","#99ced3ff");
  //隱藏課表
  $('.table').hide();
  $('.curriculumbtn').hide();
  //隱藏筆記清單
  $('.content').hide();
  //隱藏收藏清單
}