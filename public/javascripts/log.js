$(document).ready(function(){

    var _account = $('#email').val(); //帳號
    var _password = $('#secret').val(); //密碼
    $('#log_in').click(function(){
         _account = $('#email').val(); //帳號
         _password = $('#secret').val(); //密碼
        console.log("輸入了");
        if (!_account || !_password) {
            console.log('尚未輸入帳號密碼');
            $('#errmsg').text('請輸入帳號密碼!');
        }
        else {
            $.post("/member/login", { 'account':_account, 'password':_password }, function(res){
                console.log("進入資料庫了");
                console.log("帳號"+_account);
                console.log("密碼"+_password);
                if (res.status == 1) {
                    console.log("錯誤!");
                    $('#errmsg').text(res.msg);
                } else {
                    $.cookie('userName', res.data.name);
                    $.cookie('userID', res.data.account);

                    console.log(_password);
                    location.href = '/public/person_notelist.html';
                }
            });
        }
    })
});