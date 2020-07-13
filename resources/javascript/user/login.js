var islogin = "false";
$(document).ready(function() {

    $("#footer_all").load('/public/public_footer.html');
    $(".toregist").click(function() {
        window.location.href = "/user/regist.html";
    });

    $(".forgetpsw").click(function() {
        window.location.href = "/user/forget-1.html";
    });
    saveCallbackUrl();
    checkLogin();
    if (islogin == "true") {
        window.location.href = tourl();
    }
    // 验证码获取
    $(".tyuio1").click(function() {
        checkphone(this);
    });

});

var password = new RegExp("^.{6,20}$$");
layui.use('form', function() {
    var form = layui.form;
    form.verify({
        code : function(value, item) {
            if ($(".yzs-login-tab-sel").attr("data-id") == "B") {
                if (value.length != 6) {
                    return "请输入6位数验证码";
                }
            }
        },
        passwd : function(value, item) {
            if ($(".yzs-login-tab-sel").attr("data-id") == "A") {
                if ((!password.test(value)) || value == "") {
                    return "密码长度6-20位！";
                }
            }
        }

    });

    // 监听提交
    form.on('submit(formDemo)', function(data) {
        // layer.msg(JSON.stringify(data.field));
        checkmobile(data.field)
        return false;
    });

});

// 登录操作
function checkmobile(userinfo) {
    var reqdata={
        "mobile" : userinfo.phone
    };
    pairequest("/pai/userPro/checkMobile.do",reqdata).then(function(data){
        if (data.success == true) {
            if ($(".yzs-login-tab-sel").attr("data-id") == "B") {
                loginphone(userinfo);
            } else {
                loginpws(userinfo);
            }
        } else {
            layer.msg(data.msg,{offset: 't',anim: 6})
            return false
        }
    });
}

/**
 *
 * @param data
 * @param o
 * @returns
 */
function loginphone(userinfo) {
    $(".yzs-login-btn").attr("disabled", true);
    userinfo["flag"] = 1;
    userinfo["userName"] = userinfo.phone;
    userinfo["passwd"] = userinfo.code;


    var reqdata=userinfo;
    pairequest("/pai/userPro/userLogin.do",reqdata).then(function(data){
        if (data.success == true) {
            $(".tyuio1").val("获取验证码");
            window.location.href = tourl();
        } else {
            layer.msg(data.msg,{offset: 't',anim: 6});
        }
    });
}

/**
 *
 * @param data
 * @param o
 * @returns
 */
function loginpws(userinfo) {
    $(".yzs-login-btn").attr("disabled", true);
    userinfo.passwd = hex_md5(userinfo.passwd);
    userinfo.userName = userinfo.phone;
    var reqdata=userinfo;
    pairequest("/pai/userPro/userLogin.do",reqdata).then(function(data){
        if (data.success == true) {
            $(".tyuio1").val("获取验证码");
            location.href = tourl();
        } else {
            layer.msg(data.msg,{offset: 't',anim: 6});
        }
    });
}

/**
 * 检查手机号是否存在
 *
 * @param oo
 * @returns
 */
function checkphone(oo) {
    var reqdata={
        "mobile" : $("input[type='tel'][name='phone']").eq(0).val()
    };
    pairequest("/pai/userPro/checkMobile.do",reqdata).then(function(data){
        if (data.success == true) {
            sendFtCode(oo);
        } else {
            layer.msg(data.msg,{offset: 't',anim: 6})
            return false
        }
    });
}

/**
 * 发送验证码
 *
 * @param oo
 * @returns
 */
function sendFtCode(oo) {
    var reqdata={
        "mobile" : $("input[type='tel'][name='phone']").eq(0).val()
    };
    pairequest("/pai/userPro/sendCode.do",reqdata).then(function(data){
        if (data.success == true) {
            $("#sendFtCodeBut").val("''");
            time(oo);
        } else {
            layer.msg(data.msg,{offset: 't',anim: 6})
        }

    });
};

// 检查登录状态
function checkLogin() {return;
    var userKey = getCookie("USERKEY");

    var reqdata={"userKey" : userKey};
    pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
        if (data.success == true) {
            window.location.href = tourl();
        }
    });
};

