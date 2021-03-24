$(document).ready(function(){
    $('#write').hide();
    
    //點擊忘記密碼
    $('#forget').click(function(){
        
    });
    //點選註冊
    $('#sign_in').click(function(){
        $('#login').hide();
        $('#write').show();
    });
    //填完資料後點選確認
    $('#check').click(function(){
        console.log("register");
        var _name = $('#name').val();
        var _ac = $('#ac').val();
        var _pw = $('#pw').val();
        var _cfmpw = $('#cfmpw').val();
        if (!_name || !_ac || !_pw || !_cfmpw) {
            console.log(_name); //使用者輸入的名字
            console.log(_ac);   //使用者輸入的帳號
            console.log(_pw);   //使用者輸入的密碼
            console.log(_cfmpw);//使用者輸入的確認密碼
            $('#errmsg').text('請輸入未填欄位!');
        } else if (_pw != _cfmpw) {
            $('#errmsg').text('兩次輸入密碼不相同!');
        } else {
            var api = "/member/register";
            var data = {'name': _name, 'account': _ac,'password': _pw};
            $.post(api, data, function (res) {
                if (res.status == 0) {
                    location.href = '/public/Home.html';
                    alert('註冊成功!');
                }
            });
        }
    });
});
