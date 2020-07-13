$(document).ready(function(){
    $("#header_all").load('/public/public_header.html');
    $(".memberCenterNav").load('/public/tiframeleft.html');
    checkLogin();
});

var  username="";
// 检查登录状态
function checkLogin(){
    var userKey = getCookie("USERKEY");

    var reqdata={"userKey":userKey};
    pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
        var header = "";
        if(data.success==true){
            authparams();
            username=data.obj.username;
            $(".mc_titl a").click(function(){
                var inds = $(this).index();
                $(this).addClass("checked");
                $(this).siblings("a").removeClass("checked");
                $(".mc_dis_none").hide();
                $(".mc_dis_none").eq(inds).show();
            });
            initpager();
            getMyPublishAuction(0);
        }else{
            window.location.href="/user/login.html";
        }
        $(".header_newe").html(header);

    });
};
/*实名认证校验*/
function authparams(){
    var reqdata={};
    pairequest("/pai/memberAuth/toMemberAuth.do",reqdata).then(function(data){

        if(data.success==true){
            var status=data.obj.status;
            userinfo=data.obj.upistr;
            //0 1  3审核中  4 已通过 5 未通过
            var html="";
            if(status==3||status==4||status==5){
                if(status!=5){
                    if(status==3){
                        paiAlert("实名认证审核中，暂无待审核采购竞价商品。","/","随便逛逛");
                    }else{
                        //有权限
                    }
                }else{
                    paiAlert("实名认证未通过，暂无采购竞价商品。","/auth/authinit.html","重新去实名认证");
                }
            }else{
                paiAlert("未实名认证，暂无采购竞价商品。","/auth/authinit.html","去实名认证");
            }
        }else{
            window.location.href="/user/login.html";
        }

    });
};
/**
 * 遮罩
 * @param title
 * @param tourl
 * @returns
 */
function paiAlert(title,tourl,bt){return;
    layer.msg(title, {
        time:100000,
        shade: 0.8,
        anim: 2,
        btn: [bt]
        ,yes: function(){
            window.location.href=tourl;
        }
    });

    setTimeout(function(){
        window.location.href=tourl;
    }, 100000);
};

/**
 * 分页初始化-发布的竞拍信息
 * @returns
 */
function initpager(){
    var status = "0";
    var s = $("#q_status").val();
    if(s!=null && s!=""){
        status = s;
    }
    var pageSize = 10;

    var reqdata={"pageNo":1,"pageSize":pageSize,"status":status};
    pairequest("/pai/auction/getMySignList.do",reqdata).then(function(data){
        if(data.content != null){
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                laypage.render({
                    elem: 'demo3',
                    count: data.total,
                    layout: ['count', 'prev', 'page', 'next', 'skip'],
                    jump: function(obj){
                        getMyPublishAuction(obj.curr-1);
                    }
                });
            });
        }

    });
}

function getMyPublishAuction(pageNum){
    var status = "0";
    var s = $("#q_status").val();
    if(s!=null && s!=""){
        status = s;
    }
    var pageSize = 10;

    var reqdata={"pageNo":pageNum+1,"pageSize":pageSize};
    pairequest("/pai/tender/MyTenderInfo.do",reqdata).then(function(data){
        if(data.success==false){
            layer.msg(data.msg,{offset: 't',anim: 6})
            return false;
        }
        var ttList=data.obj.ttList;
        var systemtime=data.obj.systemtime;
        var size=data.obj.size;
        var page=data.obj.page;
        var result = "";
        if(size==0){
            result+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='http://www.ezaisheng.cn/resources/img/nomore.jpg'></a></center></div>";
            var paper = "<a href='javascript:;'>&lt;</a>" +
                "<span class='pager_number'><strong>0</strong>/"+
                "0</span><a href='javascript:;'>&gt;</a> ";
            $(".pager").html(paper);
            $(".ezspage").hide();
        }else{
            if(ttList.length>0){
                result += '<tr>';
                result += '<th width="10%"><span>项目</span></th>';
                result += '<th width="15%"><span>开标时间</span></th>';
                result += '<th width="5%"><span>报名数</span></th>';
                result += '<th width="10%"><span>提交资质数</span></th>';
                result += '<th width="10%"><span>申请看货数</span></th>';
                result += '<th width="10%"><span>保证金(份)</span></th>';
                result += '<th width="10%"><span>报价人数</span></th>';
                result += '<th width="8%"><span>状态</span></th>';
                result += '<th width="12%"><span class="no_border">操作</span></th>';
                result += '</tr>';
                $.each(ttList,function(index,info){
                    result += '<tr>';
                    result += '<td width="10%"><span>'+info.tenderName+'</span></td>';
                    result += '<td width="15%"><span>'+info.opentendertime.substring( 0, 19) +'</span></td>';
                    result += '<td width="5%"><span>'+info.signCount +'</span></td>';
                    result += '<td width="10%"><span>'+info.certCount +'</span></td>';
                    result += '<td width="10%"><span>'+info.lookGoodsCount +'</span></td>';
                    result += '<td width="10%"><span>'+info.payMarginCount +'</span></td>';
                    result += '<td width="10%"><span>'+info.quoteCount +'</span></td>';
                    result += '<td width="10%"><span>  ';
                    if((info.opentendertimeEmp > systemtime) && info.audit>0 &&info.audit<2){
                        result +="待开标"
                    }
                    if((info.opentendertimeEmp > systemtime) && info.audit==6){
                        result +="待开标"
                    }
                    if((info.opentendertimeEmp < systemtime) && info.audit<3 && info.audit!=6){
                        result +="开标中"
                    }
                    if((info.opentendertimeEmp < systemtime) && info.audit>3 && info.audit==6){
                        result +="开标中"
                    }
                    if(info.audit==3){
                        result +="已发布中标结果"
                    }
                    if(info.audit==4){
                        result +="已结束"
                    }
                    result += ' </span></td>';
                    result += '<td width="8%"><a  class="openlayer" data="'+info.tenderName+'" href="javascript:void(0);" title="/tendermanager/preview.html?tid='+info.tenderId +'"><button class="zs-login-btn layui-btn layui-btn-xs layui-btn-radius  el-button  is-round layui-btn-normal">查看</button></a>';
                    result += '<a   class="openlayer" data="'+info.tenderName+'" href="javascript:void(0);" title="/tendermanager/mytendermanage.html?tid='+info.tenderId +'" ><button class="zs-login-btn layui-btn layui-btn-xs layui-btn-radius  el-button  is-round layui-btn-warm">管理</button></a>';
//						result += '<a   class="toShare"  name="'+info.tenderId+'" title="'+info.tenderName+'"><button class="zs-login-btn layui-btn layui-btn-xs layui-btn-radius  el-button  is-round layui-btn-danger">分享</button></a>';
                    result += '<a   class="toSend"  name="'+info.tenderId+'" title="'+info.tenderName+'"><button class="zs-login-btn layui-btn layui-btn-xs layui-btn-radius  el-button  is-round layui-btn-danger">标底邮件发送</button></a>';
                    result += '</td>';
                    result += '</tr> ';
                })
            }
        }
        $("#dataTable").html(result);
        openlayer();
    });
};

function openlayer(){
    $(".openlayer").click(function(){
        layer.open({
            type: 2,
            title: $(this).attr("data"),
            shade: false,
            shadeClose: true, //开启遮罩关闭
            maxmin: true, //开启最大化最小化按钮
            area: ['80%', '90%'],
            content: $(this).attr("title")+'&time='+new Date().getTime()
        });

    });

    $(".toShare").click(function(){
        var tenderid=$(this).attr("name");
        var title="采购竞价:"+$(this).attr("title");

        var reqdata={"tid":tenderid };
        pairequest("/pai/PushCode/downloadTenderPic.do",reqdata).then(function(data){
            if(data.success){
                var  url="/upload//tender//"+tenderid +"/"+tenderid+"share.png"
                var  index1=layer.alert("<div>"+
                    "		<span><img"+
                    "			src=\""+url+"\""+
                    "			style=\"float: left;margin-top: -10px;\">"+
                    "			</span>"+
                    "			<span  style=\"margin: auto;word-break: normal; width: 100px; display: block; white-space: pre-wrap; word-wrap: break-word; overflow: hidden;\">"+
                    title+"</span>"+
                    "	</div>", {
                    skin: 'layui-layer-molv' //样式类名
                    ,title:"使用微信或qq手机客户端扫描二维码分享链接"
                    ,closeBtn: 0
                }, function(){
                    layer.closeAll()
                });
            }else{
                layer.msg(data.msg,{offset: 't',anim: 6});
            }

        })
    });

    $(".toSend").click(function(){
        var tenderid=$(this).attr("name");
        var title="采购竞价:"+$(this).attr("title");

        var reqdata={"tid":tenderid };
        pairequest("/pai/tm/d/"+tenderid+".do",reqdata).then(function(data){
            if(data.success){
                layer.msg(data.msg,{offset: 't',anim: 6});
            }else{
                layer.msg(data.msg,{offset: 't',anim: 6});
            }

        })
    });




}




