$(document).ready(function(){
 /////////////////////使用cookie判斷使用者是否登入/////////////////////////////////
    if (!$.cookie('userID') || $.cookie('userID') == "null") {
    } else {
        $('#username').text("UserName : " + $.cookie('userName'));
    }
    //登出功能
    $('#logout').click(function(){
        $.removeCookie("userID");
        $.removeCookie("userName");
        history.go(0);
        location.href = '/public/home.html';
    })
});