var indx1 = '';
$(document).ready(function(){
    $("#header_all").load('/public/public_header.html');
    $(".memberCenterNav").load('/public/iframeleft.html');
    authparams();
    checkLogin();
    modifyBbsLive();
});

// 检查登录状态
function checkLogin(){
    var reqdata={};
    pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
        $(".addsprice").hide();
        $(".xtauction").hide();
        var header = "";
        if(data.success==true){
            var timestamp = Date.parse(new Date());
            $.getJSON("/resources/json/tender_blank.json?time="+timestamp,function(data1){
                $.each(data1,function(index,info){
                    if(info.id==data.obj.userid){
                        $(".addsprice").show();
                        $(".xtauction").show();
                    }
                })
            });
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
            var url="/cms/templent/export/xtauction.do";
            $(".xtauction").attr("href",url+"?57="+userinfo.username)

            // 0 1 3审核中 4 已通过 5 未通过
            var html="";
            if(status==3||status==4||status==5){
                if(status!=5){
                    if(status==3){
                        paiAlert("实名认证审核中，暂无待审核竞拍商品。","/","随便逛逛");
                    }else{
                        // 有权限
                    }
                }else{
                    paiAlert("实名认证未通过，暂无竞拍商品。","/auth/authinit.html","重新去实名认证");
                }
            }else{
                paiAlert("未实名认证，暂无竞拍商品。","/auth/authinit.html","去实名认证");
            }
        }else{
            window.location.href="/user/login.html";
        }

    });

};
/**
 * 遮罩
 *
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
});
function showReason(a){
    if(a=='null' || a==null||a=='undefined'){
        return;
    }else {layer.open({
        type: 1
        ,title: false // 不显示标题栏
        ,closeBtn: false
        ,area: '300px;'
        ,shade: 0.8
        ,id: 'LAY_layuipro' // 设定一个id，防止重复弹出
        ,resize: false
        ,btn: ['关闭']
        ,btnAlign: 'c'
        ,moveType: 1 // 拖拽模式，0或者1
        ,content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">'+a+'</div>'
        ,success: function(layero){
            var btn = layero.find('.layui-layer-btn');

        }
    });
    }
}
function modyfiy(a){
    location.href = "/pai/auction/modifyAuction.do?acutid="+a;
}

function getMyPublishAuction(pageNum){
    var pageSize = 10;
    var reqdata={"pageNo":pageNum+1,"pageSize":pageSize};
    pairequest("/pai/auction/sellermanager/getManagerAuction.do",reqdata).then(function(data){
        var result = "";
        if(data.content==null || data.content == ""){
            result+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='http://www.ezaisheng.cn/resources/img/nomore.jpg'></a></center></div>";
            var paper = "<a href='javascript:;'>&lt;</a>" +
                "<span class='pager_number'><strong>0</strong>/"+
                "0</span><a href='javascript:;'>&gt;</a> ";
            $(".pager").append(paper);
        }else{
            if(data.content != null){
                if(data.content != null){
                    $.each(data.content, function(index, value) {
                        result += "<tr>";
                        result += "<td width='5%' class=''>";
                        if(value.endtimeemp > Date.parse(new Date())){
                            result += '<input type="checkbox" lay-skin="primary" name="c" title="" data-value="'+value.groupid+'"  id="'+value.id+'" >';
                        }
                        result += "</td>";
                        result += "<td width='15%'  name='winCG'  class='"+value.groupid+" tdtitle' data-value='"+value.groupid+"'  title='"+value.title+"'><span>"+value.title.substring(0,10)+"...</span></td>";
                        result += "<td width='25%' class='tdtitle' title='"+value.starttime.substr(0,16)+"'><span>"+value.starttime.substr(5,11)+"</span></td>";
                        result += "<td width='25%' class='tdtitle' title='"+value.endtime.substr(0,16)+"'><span>"+value.endtime.substr(5,11)+"</span></td>";
                        result += "<td width='10%'><span class='tdtitle'  title='保证金："+value.bond+"元<br/>已报名："+value.signupnum+"名</br>保证金已交:"+value.paynum+"份'>查看</span></td>";

                        if(value.qpmoney ==null){
                            result += "<td width='10%'><span>无</span></td>";
                        }else{
                            if(value.qpmoney==1){
                                result += "<td width='10%' ><span style='color:red;'>"+value.qpmoney+"元</span></td>";
                            }else{
                                result += "<td width='10%' ><span>"+value.qpmoney+"元</span></td>";
                            }

                        }
                        // 未流标
                        if(value.isfailure==null ||value.isfailure==0){

                            if(value.endtimeemp< Date.parse(new Date())){
                                result += "<td width='10%'><span class='tdtitle' title='"+value.currentmoney+"'>"+value.currentmoney+"元</span></td>";
                            }else{
                                result += "<td width='10%'><span class='tdtitle' >--</span></td>";
                            }
                            if(value.iskeep==1){
                                if(value.keepmoney !=null){
                                    if(value.endtimeemp> Date.parse(new Date())){
                                        result += "<td width='10%'><span>***</span></td>";
                                    }else{
                                        result += "<td width='10%'><span class='tdtitle' title='"+value.keepmoney+"'>"+value.keepmoney+"元</span></td>";
                                    }
                                }else {
                                    result += "<td width='10%'><span>未添加</span></td>";
                                }
                            }else{
                                result += "<td width='10%'><span>无</span></td>";
                            }
                            if(value.status < 4 || value.winnername==null){
                                result += "<td width='10%'><span>暂无</span></td>";
                            }else{
                                if(value.status=='4'&&value.winnername!=null&&value.isfailure!=1){
                                    if(value.iskeep==1){
                                        if(value.keepmoney<=value.currentmoney){
                                            if(value.ismagin==1){
                                                if(value.paynum>1){
                                                    result += "<td width='10%'><span class='tdtitle' title='"+((undefined==value.buyer)?"":value.buyer.company)+"'>"+((undefined==value.buyer)?"":value.buyer.company).substr(0,3)+"</span></td>";
                                                }else{
                                                    result += "<td width='10%'><span>流标</span></td>";
                                                }
                                            }else{
                                                if(value.signupnum>1){
                                                    result += "<td width='10%'><span class='tdtitle' title='"+((undefined==value.buyer)?"":value.buyer.company)+"'>"+((undefined==value.buyer)?"":value.buyer.company).substr(0,3)+"</span></td>";
                                                }else{
                                                    result += "<td width='10%'><span>流标</span></td>";
                                                }
                                            }

                                        }else{
                                            result += "<td width='10%'><span>流标</span></td>";
                                        }

                                    }else{
                                        if(value.ismagin==1){
                                            if(value.paynum>1){
                                                result += "<td width='10%'><span class='tdtitle' title='"+((undefined==value.buyer)?"":value.buyer.company)+"'>"+((undefined==value.buyer)?"":value.buyer.company).substr(0,3)+"</span></td>";
                                            }else{
                                                result += "<td width='10%'><span>流标</span></td>";
                                            }
                                        }else{
                                            if(value.signupnum>1){
                                                result += "<td width='10%'><span class='tdtitle' title='"+((undefined==value.buyer)?"":value.buyer.company)+"'>"+((undefined==value.buyer)?"":value.buyer.company).substr(0,3)+"</span></td>";
                                            }else{
                                                result += "<td width='10%'><span>流标</span></td>";
                                            }
                                        }
                                    }
                                }else{
                                    result += "<td width='10%'><span>流标</span></td>";
                                }

                            }
                        }else{
                            result += "<td width='10%'><span>无</span></td>";
                            if(value.iskeep==1){
                                if(value.keepmoney !=null){
                                    if(value.endtimeemp < Date.parse(new Date())){
                                        result += "<td width='10%'><span>"+value.keepmoney+"元</span></td>";
                                    }else{
                                        result += "<td width='10%'><span>***元</span></td>";
                                    }
                                }else {
                                    result += "<td width='10%'><span>未添加</span></td>";
                                }
                            }else{
                                result += "<td width='10%'><span>无</span></td>";
                            }

                            result += "<td width='10%'><span>流标</span></td>";
                        }


                        result += "<td width='10%'><span>"+formatDelay(value.delay)+"</span></td>";


                        if(value.starttimeemp > value.currenttimeemp){
                            result += "<td width='10%'><span>即将开始</span></td>";
                        }else if((value.starttimeemp < value.currenttimeemp) && (value.endtimeemp > value.currenttimeemp)){
                            result += "<td width='10%'><span style='color:red;'>进行中</span></td>";
                        }else{
                            if(value.status=='4'&&value.winnername!=null&&value.isfailure!=1){
                                if(value.iskeep==1){
                                    if(value.keepmoney<=value.currentmoney){
                                        if(value.ismagin==1&&value.paynum>1){
                                            result += "<td width='10%'><span style='color: #18b0a3;'>已成交</span></td>";
                                        }else{
                                            result += "<td width='10%'><span>已结束</span></td>";
                                        }
                                    }else{
                                        result += "<td width='10%'><span>已结束</span></td>";
                                    }

                                }else{
                                    if(value.ismagin==1&&value.paynum>1){
                                        result += "<td width='10%'><span style='color: #18b0a3;'>已成交</span></td>";
                                    }else{
                                        result += "<td width='10%'><span>已结束</span></td>";
                                    }
                                }

                            }else{
                                result += "<td width='10%'><span>已结束</span></td>";
                            }


                        }


                        if(value.status=='4'&&value.winnername!=null&&value.isfailure!=1){
                            if(value.iskeep==1){
                                if(value.keepmoney<=value.currentmoney){
                                    if(value.ismagin==1){
                                        if(value.paynum>1){
                                            result += "<td width='15%'>" +
                                                "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.id+"&apos;)'>管理</button>" +
                                                "<a href='/orderform/sellerorderformlist.html'><button  class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius' >去订单中心</button></a>" +
                                                "</td>";
                                        }else{
                                            result += "<td width='15%'>" +
                                                "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.id+"&apos;)'>管理</button>" +
                                                "<a target='_blank'  href='/auction/sign.html?param="+value.id+"'><button  class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius' >查看详情</button></a>" +
                                                "</td>";
                                        }
                                    }else{
                                        if(value.signupnum>1){
                                            result += "<td width='15%'>" +
                                                "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.id+"&apos;)'>管理</button>" +
                                                "<a href='/orderform/sellerorderformlist.html'><button  class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius' >去订单中心</button></a>" +
                                                "</td>";
                                        }else{
                                            result += "<td width='15%'>" +
                                                "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.id+"&apos;)'>管理</button>" +
                                                "<a target='_blank'  href='/auction/sign.html?param="+value.id+"'><button  class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius' >查看详情</button></a>" +
                                                "</td>";

                                        }
                                    }

                                }else{
                                    result += "<td width='15%'>" +
                                        "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.id+"&apos;)'>管理</button>" +
                                        "<a target='_blank'  href='/auction/sign.html?param="+value.id+"'><button  class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius' >查看详情</button></a>" +
                                        "</td>";
                                }

                            }else{
                                if(value.ismagin==1){
                                    if(value.paynum>1){
                                        result += "<td width='15%'>" +
                                            "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.id+"&apos;)'>管理</button>" +
                                            "<a href='/orderform/sellerorderformlist.html'><button  class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius' >去订单中心</button></a>" +
                                            "</td>";
                                    }else{
                                        result += "<td width='15%'>" +
                                            "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.id+"&apos;)'>管理</button>" +
                                            "<a target='_blank'  href='/auction/sign.html?param="+value.id+"'><button  class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius' >查看详情</button></a>" +
                                            "</td>";
                                    }
                                }else{
                                    if(value.signupnum>1){
                                        result += "<td width='15%'>" +
                                            "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.id+"&apos;)'>管理</button>" +
                                            "<a href='/orderform/sellerorderformlist.html'><button  class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius' >去订单中心</button></a>" +
                                            "</td>";
                                    }else{
                                        result += "<td width='15%'>" +
                                            "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.id+"&apos;)'>管理</button>" +
                                            "<a target='_blank'  href='/auction/sign.html?param="+value.id+"'><button  class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius' >查看详情</button></a>" +
                                            "</td>";

                                    }
                                }
                            }
                        }else{
                            result += "<td width='15%'>" +
                                "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='manager(&apos;"+value.id+"&apos;)'>管理</button>" +
                                "<a target='_blank'  href='/auction/sign.html?param="+value.id+"'><button  class='layui-btn  layui-btn-xs layui-btn-danger  layui-btn-radius' >查看详情</button></a>" +
                                "</td>";
                        }



                        result += "</tr>";
                    });
                }

                $(".allPage").html(Math.ceil(data.total/pageSize));
                var paper = "";
                var pageNumb=pageNum+1;
                if(pageNumb==1){
                    paper = "<a href='javascript:;'>&lt;</a>" +
                        "<span class='pager_number'><strong>"+pageNumb+"</strong>/"+
                        Math.ceil(data.total/pageSize)+"</span><a href='javascript:;' onclick='getManagerAuction("+pageNumb+")'>&gt;</a> ";
                }else{
                    paper = "<a href='javascript:;' onclick='getManagerAuction("+(pageNumb-2)+")'>&lt;</a>" +
                        "<span class='pager_number'><strong>"+pageNumb+"</strong>/"+
                        Math.ceil(data.total/pageSize)+"</span><a href='javascript:;' onclick='getManagerAuction("+pageNumb+")'>&gt;</a> ";
                }
                $(".pager").html(paper);
                page(data.total,{"items_per_page":pageSize,"num_display_entries":6,"current_page":pageNumb-1,"callback":query, "link_to":"javascript:void(0);"});
            }
        }
        $("#dataTable").append(result);

        $(".tdtitle").mouseover(function(){
            layer.tips($(this).attr("title"), this, {
                tips: [1, '#3595CC'],
                time: 4000
            });
        });
        // 颜色
        changeColor();
        // 公告
        buyernotice();

        layui.use(['form'], function(){
            var form = layui.form;
            form.render('checkbox');
        });
    });

};

/**
 * 公告
 *
 * @returns
 */
function  buyernotice(){
    $(".auctionnotice").mouseover(function(){
        layer.tips('温馨提示:报名批次号相同的竞拍交一次保证金即可,颜色相同的即为同组竞拍。', '.auctionnotice', {
            tips: [1, '#5FB878'],
            time: 30000
        });
    });

}

var colorArr=["background:#f7941e;color:#fff;border-radius: 60px 0px 0px 60px;",
    "background:#18b0a3;color:#fff;border-radius: 60px 0px 0px 60px;",
    "background:#49b7ec;color:#fff;border-radius: 60px 0px 0px 60px;",
    "background:#fe8686;color:#fff;border-radius: 60px 0px 0px 60px;",
    "background:#f6b37f;color:#fff;border-radius: 60px 0px 0px 60px;",
    "background:#c14440;color:#fff;border-radius: 60px 0px 0px 60px;",
    "background:#00caef;color:#fff;border-radius: 60px 0px 0px 60px;",
    "background:#67b687;color:#fff;border-radius: 60px 0px 0px 60px;",
    "background:#7ce0a1;color:#fff;border-radius: 60px 0px 0px 60px;",
    "background:#bd89d2;color:#fff;border-radius: 60px 0px 0px 60px;"];

function changeColor(){
    var randomNum= 0;
    $('td[name=winCG]').each(function(){
        if(randomNum==9){
            randomNum=0;
        }
        var winid = $(this).attr("data-value");
        var  bcolor=$(this).attr("id");

        if(bcolor==undefined||bcolor==null){
            if(winid!=null){
                $("."+winid).attr("style",colorArr[randomNum]);
                $("."+winid).attr("id",randomNum);
            }
            randomNum++;
        }

    });
}





function formatDelay(delay){
    if(delay ==null || delay==0){
        return "无";
    }else if(delay ==1){
        return "2分钟/次";
    }else{
        return "5分钟/次";
    }
}

/**
 * 分页初始化
 *
 * @returns
 */
function initpager(){
    var pageSize = 6;
    var reqdata={"pageNo":1,"pageSize":pageSize};
    pairequest("/pai/auction/sellermanager/getManagerAuction.do",reqdata).then(function(data){
        if(data.content != null){
            layui.use(['laypage', 'layer'],function(){
                var laypage = layui.laypage,layer = layui.layer;
                laypage.render({
                    elem: 'demo3',
                    count: data.total,
                    limit:10,
                    layout: ['count',  'next'],
                    jump: function(obj){
                        getMyPublishAuction(obj.curr-1);
                    }
                });
            });
        }

    });
}

function query(pageNum,jq){
    getMyPublishAuction(pageNum);
}
function page(total,opts){
    $("#Pagination").pagination(total,opts);
}
function paymargin(id){
    top.location.href="/pai/auction/paySellerBond.do?id="+id;
}
/* 我发布的竞拍-管理 */
function manager(id) {
    window.location.href = "/auctionmanager/sellermanager/managerpushauction.html?param="+id;

}

// 直播上麦
function  modifyBbsLive(){
    $(".addlive").click(function(){
        var reqdata={};
        pairequest("/pai/memberAuth/toMemberAuth.do",reqdata).then(function(data){
            modifyBbsLiveRes(data);
        });
    });
};

function modifyBbsLiveRes(data){
    if(data.success==true){
        var userinfo=data.obj.upistr;
        var auctionids=new Array();
        $.each($("input[name='c']"),function(index,info){
            if($(info).attr("checked")=="checked"){
                auctionids.push("'"+$(info).attr("id")+"'");
            }
        });
        if(auctionids.join(",").length==0){
            layer.msg("请选择上麦商品");
            return;
        }
        var reqdata={"company":(userinfo.company==""?userinfo.truename:userinfo.company),"auctionids":auctionids.join(",")};
        pairequest("/bbs/pai/pull.do",reqdata).then(function(data){
            layer.msg(data.msg);
        });
    }else{
        layer.msg(data.msg);
    }
};



