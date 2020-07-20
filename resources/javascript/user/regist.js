
layui.use('form', function(){

    var form = layui.form;
    var password = new RegExp("^.{6,20}$$");
    form.verify({
        code: function(value, item){
            if(value.length!=6){
                return "请输入6位数验证码";
            }
        },
        passwd: function(value, item){
            if(value!=""){
                if(!password.test(value)&&value!=""){
                    return "密码长度6-20位！";
                }
            }
        }
    });

    //监听提交
    form.on('submit(formDemo)', function(data){
        /*layer.msg(JSON.stringify(data.field));*/
        if(data.field.close==undefined){
            layer.msg("请您阅读并接受《睿途再生建材商城》注册协议",{offset: 't',anim: 6});
            return false;
        }
        regist(data.field);
        return false;
    });
});

/**
 *
 * @param data
 * @param o
 * @returns
 */
function regist(userinfo){
    $(".yzs-login-btn").attr("disabled",true);
    userinfo.passwd=hex_md5(userinfo.passwd);
    var reqdata=userinfo;
    pairequest("/pai/userRegist/pull.do",reqdata).then(function(data){
        if(data.success==true){
            $(".tyuio1").val("获取验证码");
            window.location.href=tourl();
        }else{
            layer.msg(data.msg,{offset: 't',anim: 6});
        }
    });
}




/**
 * 发送验证码
 * @param oo
 * @returns
 */
function sendFtCode(oo){
    var reqdata={"phone":$("input[type='tel'][name='phone']").eq(0).val()};
    pairequest("/pai/userRegist/sendRgtCode.do",reqdata).then(function(data){
        if(data.success==true){
            $("#sendFtCodeBut").val("''");
            time(oo);
        }else{
            layer.msg(data.msg,{offset: 't',anim: 6})
        }
    });
};


/**
 * 检查手机号是否存在
 * @param oo
 * @returns
 */
function checkphone(oo){
    var reqdata={"phone":$("input[type='tel'][name='phone']").eq(0).val()};
    pairequest("/pai/userRegist/checkMobile.do",reqdata).then(function(data){
        if(data.success==false){
            if(data.errorcode==199999){
                layer.msg(data.msg,{offset: 't',anim: 6});
            }else{
                sendFtCode(oo);
            }
        }else{
            layer.msg(data.msg,{offset: 't',anim: 6})
            return false
        }
    });
}


$(document).ready(function(){
    $(".toregist").click(function() {
        window.location.href = "/user/login.html";
    });

    $(".forgetpsw").click(function() {
        window.location.href = "/user/forget-1.html";
    });

    $(".tyuio1").click(function(){
        checkphone(this);
    });
    $("#footer_all").load('/public/public_footer.html');
    saveCallbackUrl();
});






function  aggrement(){
    layer.open({
        type: 2,
        anim :2,
        title:"注册协议",
        shadeClose: true,
        shade: [0.3,'#000'] ,
        maxmin: false, //开启最大化最小化按钮
        area: ['1200px', '600px'],
        content: 'https://www.qdxhanjc.com/abouts/agreement.html'
    });
}
