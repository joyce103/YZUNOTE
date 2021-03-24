var load = 0;
$(document).ready(function(){
   showEditor();
   //右邊圖片
   var underlogo = 1;
   $('#underlogo').hide();
   $('#goSearch').click(function(){
      location.href="/public/search.html";
   });
   $('#logo').click(function(){
      console.log("點擊logo");
       if(underlogo == 0){
           $('#underlogo').hide();
           underlogo=1;
           console.log("點擊logo hide");
       }else{
           $('#underlogo').show();
           underlogo=0;
           console.log("點擊logo show");
       }
   });
   // 儲存
   $('#saveOnly').click(function(){
      addNote();
      console.log("點擊儲存");
   });
   // 編輯
   $('#edit').click(function(e){
      showEditor();
      console.log("點擊編輯");
      load = 1;
   });
   // //公開
   // $('input[name="status"]')[0].click(function(e){
   //    $('input[name="status"]')[1].checked = false;
   //    console.log("點擊公開");
   // });
   // //不公開
   // $('input[name="status"]')[1].click(function(e){
   //    $('input[name="status"]')[0].checked = false;
   //    console.log("點擊不公開");
   // });
});

function addNote(){
   var _account = $.cookie('userID');
   var _name = document.getElementById("name").innerHTML;
   var _texts = editor.getData();
   var _noteTitle = $('#noteTitle').val();
   var _class = $("#opt").val();
   // if($('input[name="status"]')[0].checked == true){
   //    var _status = true;
   // }
   // if($('input[name="status"]')[1].checked == true){
   //    var _status = false;
   // }
   // var _status = $("status").val();
   if(_texts == "") {
      alert("請輸入筆記內容!");
   } else {
      if(_noteTitle == ""){
         alert("請輸入筆記標題!");
      }else{
         if(_class == "請選擇課程"){
            alert("請選擇課程!");
         }else{
            var api = "http://localhost:3000/member/addNote";
            var data = {"account": _account, "name": _name, "title": _noteTitle ,"texts": _texts, "class":_class};
            $.post(api, data, function(res){
               console.log(res);
               if(res.status == 2){
                  var yes = confirm("此課程中已有相同標題筆記，請問要覆蓋此檔案嗎?");
                  if(yes){ //覆蓋檔案
                     updateNote();
                  }
               }
               else if(res.status == 0){
                  document.getElementById('note').innerHTML = "";
                  document.getElementById('note_title').innerHTML = _noteTitle;
                  $('#note').append(_texts);
                  $('.ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred').replaceWith(_texts);
                  showNote();
               }
            });
         }
      }
   }
}

function updateNote(){
   var _account = $.cookie('userID');
   var _name = document.getElementById("name").innerHTML;
   var _texts = editor.getData();
   var _noteTitle = $('#noteTitle').val();
   var _class=$("#opt").val();
   if($('input[name="status"]')[0].checked == true){
      var _status = true;
   }
   if($('input[name="status"]')[1].checked == true){
      var _status = false;
   }
   var api = "http://localhost:3000/member/updateNote";
   var data = {"account": _account, "name": _name, "title": _noteTitle ,"texts": _texts, "class":_class, "status":_status};
   $.post(api, data, function(res){
      if(res.status == 1){
         console.log("更新失敗");
      }
      else if(res.status == 0){
         console.log("更新成功");
         document.getElementById('note').innerHTML = "";
         document.getElementById('note_title').innerHTML = _noteTitle;
         $('#note').append(_texts);
         $('.ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred').replaceWith(_texts);
         showNote();
      }
   });
}


function showEditor(){
   $('input[name="status"]')[0].checked = true;
   $.post("/member/logname", {'account':$.cookie('userID')}, function(res){
      if(res.status==1){
      }else{
         document.getElementById("name").innerHTML = res.name;
      }
   });
   $.post("/member/classoutput", {'account':$.cookie('userID')}, function(res){
      var optionArr=new Array(78);
      if(res.status==1){
         console.log("失敗");
       }else{
         optionArr=res.data.split(",");
         console.log(optionArr);
         for(var i=0;i<78;i++){
            for(var j=1;j<78;j++){
               if(optionArr[i]==optionArr[j]&&i!=j){
                  optionArr[j]="";
                  // console.log(optionArr[i]);
               }
            }
         }

       }
       for(var i=0;i<78;i++){
          if(optionArr[i]!="" && load == 0){
            $('#opt').append("<option>"+optionArr[i]+"</option>");
            if(i == 77){
               load = 1;
             }
          }
       }
   })
   
   $(".ck.ck-reset.ck-editor.ck-rounded-corners").show();
   $('#select').show();
   $('.save').show();
   $('#name').hide();

   $('#edit').hide();
   $('#note').hide();
}

function showNote(){
   $('#editor').hide();
   $(".ck.ck-reset.ck-editor.ck-rounded-corners").hide();
   $('#select').hide();
   $('.save').hide();
   $('#name').hide();

   $('#edit').show();
   $('#note').show();
}