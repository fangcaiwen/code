$(document).ready(function(){
    $("#header_all").load('/public/public_header.html');
    $(".memberCenterNav").load('/public/tiframeleft.html');
    authparams();
});

// 检查登录状态
function checkLogin(){
    var userKey = getCookie("USERKEY");
    var reqdata={};
    pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
        var header = "";
        if(data.success==true){
        }else{
            window.location.href="/user/login.html";
        }
        $(".header_newe").html(header);

    });
};





function  authparams(){
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
                        paiAlert("实名认证审核中，暂无待审核竞拍商品","/","随便逛逛");
                    }else{
                        //有权限
                    }
                }else{
                    paiAlert("实名认证未通过，暂无竞拍商品","/auth/authinit.html","重新去实名认证");
                }
            }else{
                paiAlert("未实名认证，暂无竞拍商品","/auth/authinit.html","去实名认证");
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


$(document).ready(function(e) {
    $(".mc_titl a").click(function(){
        var inds = $(this).index();
        $(this).addClass("checked");
        $(this).siblings("a").removeClass("checked");
        $(".mc_dis_none").hide();
        $(".mc_dis_none").eq(inds).show();
    });
    initpager();
    getMySignTender(0);

});
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
}
/**
 * 修改操作
 * @param a
 * @returns
 */
function modyfiy(a){

    var reqdata={"acutid":a};
    pairequest("/pai/auction/editauction.do",reqdata).then(function(data){

        if(data.success==true){
            layer.open({
                type: 2,
                title: data.obj,
                shade: false,
                shadeClose: true, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['80%', '70%'],
                content: '/auctionmanager/editauction.html?time='+new Date().getTime()
            });
        }else{
            layer.msg(data.msg,{offset: 't',anim: 6});
        }

    });
}

function getMySignTender(pageNum){
    var pageSize = 10;

    var reqdata={"pageNo":pageNum+1,"pageSize":pageSize};
    pairequest("/pai/tender/getMySignTender.do",reqdata).then(function(data){
        var result = "";
        if(data.obj==null || data.obj.total==null || data.obj.total==0){
            var ht="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='http://www.ezaisheng.cn/resources/img/nomore.jpg'></a></center></div>";
            $("#orders").html(ht);
        }else{
            if(data.obj!=null && data.obj.tenderList!=null){
                totalpage=data.obj.size;
                result += "<tr> <th><span>采购竞价标题</span></th> <th><span>地区</span></th> <th><span>供应商</span></th> <th><span>报名时间</span></th> <th><span>开标时间</span></th> <th><span>状态</span></th> <th><span class='no_border'>操作</span></th> </tr>";
                $.each(data.obj.tenderList, function(index, value) {
                    var status = "";
                    if(value.status==1){
                        status="已报名";
                    }else if(value.status==2 && value.isCert == 1){
                        status="资质通过";
                    }else if(value.status==2 && value.isCert == 2){
                        status="待提交资质";
                    }else if(value.status==2 && value.isCert == 3){
                        status="待审核或审核未通过";
                    }else if(value.status==3){
                        status="待看货";
                    }else if(value.status==4){
                        status="待支付保证金";
                    }else if(value.status==5 && value.isQuote==0){
                        status="待报价";
                    }else if(value.status>=5 && value.audit<3 && value.isQuote==1){
                        status="已报价待开标";
                    }else if(value.status>=6 && value.audit>=3 && value.audit==6){
                        status="开标中";
                    }else if(value.status>=6 && value.audit>=3 && value.audit==6 && value.isbingo==0 && value.audit!=6){
                        status="未中标";
                    }else if(value.status>=6 && value.audit>=3 && value.audit==6 && value.isbingo==1 && value.audit!=6){
                        status="中标";
                    }else{
                        status="已结束";
                    }
                    result += "<tr>";
                    result += "<td width='20%' class='tdtitle' title='"+value.tname+"'><span>"+value.tname+"</span></td>";
                    result += "<td width='20%'><span>"+value.areaname+"</span></td>";
                    result += "<td width='20%'><span>"+value.provider+"</span></td>";
                    result += "<td width='10%'><span>"+value.signTime+"</span></td>";
                    result += "<td width='10%'><span>"+value.opentenderTime+"</span></td>";
                    result += "<td width='10%'><span>"+status+"</span></td>";
                    result += "<td width='10%'><a href='/tender/buyer/tsign.html?param="+value.tid+"' target='_blank' onclick='inTender("+value.tid+")'>进入采购竞价</a></td>";
                    result += "</tr>";
                });
            }
        }
        $("#dataTable").html(result);

        data = data.obj;
        $(".allPage").html(Math.ceil(data.total/data.pageSize));
        page(data.total,{"items_per_page":data.pageSize,"num_display_entries":6,"current_page":data.pageNum,"callback":query, "link_to":"javascript:void(0);"});

        $(".tdtitle").mouseover(function(){
            layer.tips($(this).attr("title"), this, {
                tips: [1, '#3595CC'],
                time: 4000
            });
        })

    });
};

/**
 * 分页初始化
 * @returns
 */
function initpager(){
    var pageSize = 10;

    var reqdata={"pageNo":1,"pageSize":pageSize};
    pairequest("/pai/tender/getMySignTender.do",reqdata).then(function(data){
        if(data.content != null){
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                laypage.render({
                    elem: 'demo3'
                    ,count: data.total
                    ,layout: ['count', 'prev', 'page', 'next', 'skip']
                    ,jump: function(obj){
                        getMySignTender(obj.curr-1);
                    }
                });
            });
        }

    });
}

function query(pageNum,jq){
    getMySignTender(pageNum);
}
function page(total,opts){
    $("#Pagination").pagination(total,opts);
}
function paymargin(id){
    top.location.href="/pai/auction/paySellerBond.do?id="+id;
}
//	function inTender(id){
////		top.location.href="/tender/buyer/signUp.html?param="+id+"&type=0","_blank";
//		window.open(""+id+"&type=0","_blank");
//	}

