var heartclick=0;
$(document).ready(function(){
    $.post("/member/logname", {'account':$.cookie('userID')}, function(res){
        if(res.status==1){
        }else{
            document.getElementById("name").innerHTML=res.name;
        }
    });

    // 搜尋
    $('#search').keypress(function(e){
        if (e.keyCode == 13) 
        {
            $('.content').remove();
            var _Keywords = $('#search').val();
            console.log(_Keywords);
            var api = "/member/search";
            var key = {'Keywords': _Keywords};
            $.post(api,key,function(res){
                if(res.status == 1){
                    console.log("錯誤");
                } else {
                    console.log(res.search);
                    for(var i=0; i<res.search.length ; i++){
                        let content = 
                        `<div class="content">
                            <div class="top">
                                <img id="portrait" src='/public/images/user.png'>
                                <p class="name" id="name"${res.search[i]._id}>${res.search[i].name}</p>
                                <img src="images/heart.png" id="heart">
                            </div>
                            <div class="center" id="center"${res.search[i]._id}${res.search[i].texts}</div>
                            
                            <div class="bottom">
                                <p class="heading" id="heading"${res.search[i]._id}>${res.search[i].title}</p>
                                <p class="date"></p>
                            </div>
                        </div>`
                        $('#container').append(content);
                    }
                }
            });
        }
    });
    //點選課表查詢
    $('#leftbar').on('click', '.leftclass', function(){
        $('.content').remove();
        var barclass;
        barclass=$(this).text();
        $.post("/member/barsearch", {'barclass':barclass}, function(res){
            console.log(res);
            if(res.status == 1){
                addcontent(res.data);
            }
        });
    });
    function addcontent(data){
        for(var i=0; i<data.length ; i++){
            var content=
            `<div class="content">
                <div class="top">
                    <img id="portrait" src='/public/images/user.png'>
                    <p class="name">${data[i].account}</p>
                    <img src="images/like (1).png" id="heart">
                </div>

                <div class="center" ${data[i].texts}</div>
                
                <div class="bottom">
                    <p class="heading" >${data[i].title}</p>
                    <p class="date"></p>
                </div>
            </div>`
            $('#container').append(content);
        }
    }
    //下拉式選單
    var underlogo=1;
    $('#underlogo').hide();
    $('#logo').click(function(){
        if(underlogo==0){
            $('#underlogo').hide();
            underlogo=1;
        }else{
            $('#underlogo').show();
            underlogo=0;
        }
    });
    //點擊個人頁
    $('#person').click(function(){
        location.href = '/public/person_notelist.html';
    });
    //點擊寫筆記
    $('#write').click(function(){
        location.href = '/public/Note.html';
    });
    //左邊課表
    $.post("/member/classoutput", {'account':$.cookie('userID')}, function(res){
        var pArr=new Array(78);
        if(res.status==1){
           console.log("失敗");
        }else{
           pArr=res.data.split(",");
           console.log(pArr);
           for(var i=0;i<78;i++){
              for(var j=1;j<78;j++){
                 if(pArr[i]==pArr[j]&&i!=j){
                    pArr[j]="";
                 }
              }
           }
        }
        for(var i=0;i<78;i++){
            if(pArr[i]!=""){
              $('#leftbar').append("<p class='leftclass'>"+pArr[i]+"</p>");
            }
        }
    });
    //收藏
    $(document).on('click', '#heart', function(){
        if(heartclick==0){
            $(this).attr('src','/images/heart.png');
            heartclick=1;
            var bs; //收藏寫筆記人的名稱
            var b=null;
            var s=new Array;
            s=$(this).parent().text().split("\n");
            b=s[0];
            for(var i=1;i<s.length;i++){
                b+=s[i];
            }
            b=b.split("");
            console.log(b);
            for(var i=0;i<b.length;i++){
                if(b[i]!=" "){
                    bs+=b[i];
                }
            }
            bs=bs.split("undefined");
            console.log(bs[1]);

            var title;
            var _title;
            title=$(this).parent().parent().children('.bottom').text().split("\n");
            b=title[0];
            for(var i=1;i<title.length;i++){
                b+=title[i];
            }
            b=b.split("");
            console.log(b);
            for(var i=0;i<b.length;i++){
                if(b[i]!=" "){
                    _title+=b[i];
                }
            }
            _title=_title.split("undefined");
            console.log(_title[1]);
            $.post("/member/heart", {'account':bs[1],'title':_title[1]}, function(res){
                console.log(res.data.texts);
                $.post("/member/addlike",{'name':$.cookie('stID'),'account':res.data.account,'title':res.data.title,'texts':res.data.texts},function(err,res){
                    console.log("成功!!!!!!!!");
                });
            });
        }else{
            $(this).attr('src','/images/like (1).png');
            heartclick=0;
        }
    });
});

