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
function paiAlert(title,tourl,bt){
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
    var pageSize = 10;

    var reqdata={"pageNo":0,"pageSize":pageSize};
    pairequest("/pai/tender/tenderLists.do",reqdata).then(function(data){
        if(data.success ==true){
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                laypage.render({
                    elem: 'demo3',
                    count: data.obj.size,
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
    var pageSize = 10;
    var reqdata={"pageNo":pageNum+1,"pageSize":pageSize};
    pairequest("/pai/tender/tenderLists.do",reqdata).then(function(data){
        if(data.success==false){
            layer.msg(data.msg)
            return false;
        }
        var tLists=data.obj.tLists;
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
            if(tLists.length>0){
                result+='<tr>';
                result+='<th width="15%"><span>项目</span></th>';
                result+='<th width="20%"><span>开标时间</span></th>';
                result+='<th width="20%"><span>创建时间</span></th>';
                result+='<th width="15%"><span>保证金/元</span></th>';
                result+='<th width="15%"><span>项目状态</span></th>';
                result+=' <th width="15%"><span>是否交保证金</span></th> ';
                result+='<th width="15%"><span class="no_border">操作</span></th>';
                result+='</tr>';

                $.each(tLists,function(index,info){
                    result+='<tr>';
                    result+='<td width="15%"><span>'+info.tname+'</span></td>';
                    result+='<td width="20%"><span>'+info.opentendertime.substring(0, 19)+'</span></td>';
                    result+='<td width="20%"><span>'+info.createtime.substring( 0, 19) +'</span></td>';
                    result+='<td width="15%"><span>'+(undefined==info.bond?"--":info.bond)+'</span></td>';
                    result+='<td width="15%"><span>';
                    if(info.audit==0 ){result+='待审核';}
                    if(info.audit==1 ){result+='通过';}
                    if(info.audit==2 ){result+='未通过';}
                    if(info.audit==3 ){result+='发布中标';}
                    if(info.audit==4 ){result+='已结束';}
                    result+='</span></td> ';
                    result+=' <td width="15%"><span>';
                    if(null!=info.ispaybond){
                        if(info.ispaybond=='1'){
                            result+='是';
                        }
                        if(info.ispaybond=='0'){
                            result+='否';
                        }
                    }
                    result+='</span></td>';
                    result+=' <td width="15%">';
                    if (info.audit==0 ){
                        result+=' ----';
                    }
                    if (info.audit==1 ){
                        if (info.ispay==0 ){
                            result+='<botton  class="layui-btn  layui-btn-xs  layui-btn-radius layui-btn-danger" onclick="paymargin('+info.tid+')">支付保证金</button>';
                        }
                        if (info.ispay!=0 ){
                            result+='----';
                        }
                    }
                    if(info.audit==2){
                        result+='<a href="javascript:void(0);" class="layui-btn  layui-btn-xs  layui-btn-radius"  onclick="showReason(&apos;'+info.reason+'&apos;)" >查看原因</a> | <a  class="layui-btn layui-btn-xs layui-btn-radius layui-btn-warm" href="javascript:void(0);" onclick="modyfiy(&apos;'+info.tid+'&apos;)" >修改</a>';
                    }
                    if(info.audit==3||info.audit==4||info.audit==5){
                        result+='----';
                    }
                    result+='</td>';
                    result+='</tr>';
                })
            }
        }
        $("#dataTable").html(result);
        $(".tdtitle").mouseover(function(){
            layer.tips($(this).attr("title"), this, {
                tips: [1, '#3595CC'],
                time: 4000
            });
        })
    });
};




function showReason(a){
    if(a=='null' || a==null||a=='undefined'){
        return;
    }else {layer.open({
        type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,area: '300px;'
        ,shade: 0.8
        ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
        ,resize: false
        ,btn: ['关闭']
        ,btnAlign: 'c'
        ,moveType: 1 //拖拽模式，0或者1
        ,content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">'+a+'</div>'
        ,success: function(layero){
            var btn = layero.find('.layui-layer-btn');

        }
    });
    }
};

/**
 * 修改操作
 * @param a
 * @returns
 */
function modyfiy(a){
    layer.open({
        type: 2,
        title: "采购竞价修改",
        shade: false,
        shadeClose: true, //开启遮罩关闭
        maxmin: true, //开启最大化最小化按钮
        area: ['80%', '70%'],
        content: '/tendermanager/edittender.html?tenderid='+a
    });
}

function paymargin(id){
    var param={};
    param["tid"]=id;
    param["reqp"]=id+"SELLMAGINPAY";
    topay("/pai/paycommon/tender/paySellerBond.do",param);
}