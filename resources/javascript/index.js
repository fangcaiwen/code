﻿var IntervalOne = '';
var index1
$(document).ready(function () {
    //检测是否登录
    checkLogin();
    /*成交公告*/
    dealOver();
    /* 竞拍中 品类列表
     getSerachCataData();*/
    /*竞拍中 商品列表*/
    getAuctionDoingLists();
    IntervalOne = setInterval(ink, 1000);
    /*即将开始*/
    getAuctionWillBeginLists();
    /*已结束*/
    getAuctionEndLists();

    gethotNewsInfo();

    getuserInframAuc();


})

/*成交公告*/
function dealOver() {
    var serach = {};
    pairequest("/pai/auction/getDealOver.do", serach).then(function (data) {
        var content = $(".tbody>.anim");
        content.empty();
        var html = "";
        $.each(data.content, function (index, value) {
            html += "<li style='height:102.5px' class='swiper-slide' id='" + value.id + "'>";
            html += "<a href='' >" + value.endtime.substring(0, 10) + "&nbsp;" + value.title.substring(0, 25) + "</a>";
            html += "<em>¥ " + value.currentmoney + "元/吨</em>";
            html += "</li>";
        })

        content.append(html);
        var swiper = new Swiper('.eswiper-ad-login', {
            speed: 2000,
            direction: 'vertical',
            slidesPerView: 'auto',
            height: 90,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 1000,
                disableOnInteraction: false,
            },
        });
    });

}

function loginOut() {
    var reqdata = {};
    pairequest("/pai/userPro/userLogot.do", reqdata).then(function (data) {
        var header = "";
        if (data.success == true) {
            window.location.href = "/";
        } else {
            layer.msg(data.msg, {icon: 5, offset: 't', anim: 6});
        }
    });
};

/*判断用户是否登录*/
function checkLogin() {
    var userKey = getCookie("USERKEY");
    var serach = {"userKey": userKey};
    var html = '';
    pairequest("/pai/userPro/checkLoginStatus.do", serach).then(function (data) {
        if (data.success == true) {
            var user = ""
            var usertemp = "";
            if (data.obj.company == undefined || data.obj.company == '' || data.obj.company == null) {
                user = data.obj.username;
                usertemp = data.obj.username;
            } else {
                user = data.obj.company.substring(0, 6) + "..";
                usertemp = data.obj.company;
            }
            html += '<img class="avatar" src="/resources/img/head1.png" />';
            html += '<div class="name user_name" title="' + usertemp + '">';
            html += 'Hi, 您好, ' + user + '<br />欢迎来到青岛西海岸建材交易中心';
            html += '</div>';
            $(".user_info").empty();
            $(".user_info").append(html);
            $(".user_btn").hide();
            $(".user_tip").hide();
            $(".eswiper-ad").hide();
            $(".statistics").show();
            $(".eswiper-ad-login").show();
        } else {
            $(".statistics").hide();
            $(".eswiper-ad-login").hide();
            $(".eswiper-ad").show();
        }
    });

}

/*查询 竞价中的 品类*/
function getSerachCataData() {
    var serach = {};
    pairequest("/pai/auction/getActionCateName.do", serach).then(function (data) {
        if (data.success) {
            var html1 = "";
            var html2 = "";
            var html3 = "";
            $.each(data.obj, function (index, value) {
                var items = value.split("@");
                if (items[0] == "") {
                    return;
                }
                html1 += "<a class='my1 uncheck' name='cataName' href='javascript:;'>" + items[0] + "</a>";
                html2 += "<a class='my2 uncheck' name='cataName' href='javascript:;'>" + items[0] + "</a>";
                html3 += "<a class='my3 uncheck' name='cataName' href='javascript:;'>" + items[0] + "</a>";
            })
            var dingItems = $(".doing>.head>.container>.catt");
            var soonItems = $(".soon>.head>.container>.catt");
            var endedItems = $(".ended>.head>.container>.catt");

            dingItems.empty();
            soonItems.empty();
            endedItems.empty();

            dingItems.append(html1);
            soonItems.append(html2);
            endedItems.append(html3);

            $("a[name=cataName]").click(function () {
                var dName = $(this).attr("class");
                if (dName != null && dName.indexOf("my1") > -1) {
                    //判断是否选中
                    if ($(this).attr("class").indexOf("allcheck") > 0) {
                        $(this).removeClass("allcheck");
                        $(this).addClass("uncheck");
                    } else {
                        $(this).removeClass("uncheck");
                        $(this).addClass("allcheck");
                    }
                    //clearInterval(IntervalOne);
                    getAuctionDoingLists();
                    //IntervalOne = setInterval(ink,1000);
                } else if (dName != null && dName.indexOf("my2") > -1) {
                    //判断是否选中
                    if ($(this).attr("class").indexOf("allcheck") > 0) {
                        $(this).removeClass("allcheck");
                        $(this).addClass("uncheck");
                    } else {
                        $(this).removeClass("uncheck");
                        $(this).addClass("allcheck");
                    }
                    getAuctionWillBeginLists();
                } else if (dName != null && dName.indexOf("my3") > -1) {
                    //判断是否选中
                    if ($(this).attr("class").indexOf("allcheck") > 0) {
                        $(this).removeClass("allcheck");
                        $(this).addClass("uncheck");
                    } else {
                        $(this).removeClass("uncheck");
                        $(this).addClass("allcheck");
                    }
                    getAuctionEndLists();
                }
            })

        }

    });


}

/*2:报名截止前 3.进行中 4.结束*/
function getAuctionDoingLists() {
    var company = "";
    var key = "";
    var cates = new Array();
    var areas = new Array();
    var sprices = new Array();

    $.each($(".my1"), function (index, info) {
        if ($(info).attr("class").indexOf("allcheck") > 0) {
            cates.push("'" + $(info).text() + "'");
        }
    });

    var serach = {
        "pageNo": 1,
        "pageSize": 4,
        "status": 3,
        "company": company,
        "title": key,
        "catainfo": cates.join(","),
        "areainfo": areas.join(","),
        "sprice": sprices.join(","),
        "pprice": -1,
        "stime": 0,
        "snum": -1
    };
    let areanameArr = ['青岛市崂山区','青岛市黄岛区','青岛市西海岸新区','青岛市城阳区'];
    painoloadrequest("/pai/auction/searchAuction.do", serach).then(function (data) {
        $(".subDoing").empty();
        var result = '';
        if (data.total == 0 || data.total == "0") {
            $(".like_doing").hide();
            result += "<h2 style='color: gray; font-size: 20px;margin-left: 25%;'><img src='/resources/img/nomore.jpg'></h2>";
        } else {
            if (data.content != null) {
                result = '';
                var auctionids = new Array();
                $.each(data.content, function (index, value) {
                    auctionids.push("'" + value.id + "'");
                    var areaname = "";
                    if (value.areaname == undefined) {
                        areaname = "暂无信息"
                    } else {
                        areaname = areanameArr[index];
                    }
                    if (value.sprice <= "0.001") {
                        value.sprice = "**"
                    }
                    result += '<div class="item ' + value.id + 'p" id="' + value.id + '">';
                    result += '<a href="/auction/sign.html?param=' + encodeURI(value.disagreeinfo) + '"  class="opennew" target="_blank" >';
                    result += '<div class="product">';
                    result += '<span class="ti">竞拍中</span>';
                    result += '<div class="img"><img src="' + value.disagreeinfo + '" alt="" srcset=""></div>';
                    if (checkSign(value.endtime)) {
                        result += '<div class="datetime ' + value.id + 'datetime"><i></i><span class="tim ' + value.id + '">距竞拍结束还剩：<em>0</em>天<em>0</em>时<em>0</em>分<em>0</em>秒 </span></div>';
                    }
                    result += '<div class="wrap">';
                    result += '<div class="nameAddress">';
                    result += '<div class="name">' + value.title.substring(0, 10) + '</div>';
                    result += '<div class="address"><i class="el-icon-location"></i>' + areaname + '</div>';
                    result += '</div>';
                    result += '<div class="price  ' + value.id + 'price">当前价：<span>' + value.nprice + '</span>元</div>';
                    result += '<div class="info">';
                    result += '<div class="basePrice">起拍价：' + value.sprice + '元/' + value.unit + '</div>';
                    result += '<div class="num">数量：' + value.amount + value.unit + '</div>';
                    result += '</div>';
                    result += '</div>';
                    result += '</div>';
                    result += '</a>';
                    result += '</div>';
                });
                result += '</div>';
            }
            $(".doing>.container>.auctionids").val(auctionids.join(","));
        }
        $(".subDoing").append(result);
    });

}

/*即将开始竞价*/
function getAuctionWillBeginLists() {
    var company = "";
    var key = "";
    var cates = new Array();
    var areas = new Array();
    var sprices = new Array();

    $.each($(".my2"), function (index, info) {
        if ($(info).attr("class").indexOf("allcheck") > 0) {
            cates.push("'" + $(info).text() + "'");
        }
    });


    var serach = {
        "pageNo": 1,
        "pageSize": 4,
        "status": 2,
        "company": "",
        "title": "",
        "catainfo": cates.join(","),
        "areainfo": areas.join(","),
        "sprice": sprices.join(","),
        "pprice": -1,
        "stime": 1,
        "snum": -1
    };
    let areanameArr = ['青岛市西海岸新区','青岛市城阳区','青岛市市北区','青岛市市南区'];
    pairequest("/pai/auction/searchAuction.do", serach).then(function (data) {
        $(".soon>.container>.content").empty();
        var result = '';
        if (data.total == 0 || data.total == "0") {
            result += "<h2 style='color: gray; font-size: 20px;margin-left: 25%;'><img src='/resources/img/nomore.jpg'></h2>";
            // result+="<div><a href='/holidayNotice.html'><img src='/resources/img/holidayNotice.jpg'></a></div>";
        } else {
            if (data.content != null) {
                var auctionids = new Array();
                $.each(data.content, function (index, value) {
                    auctionids.push("'" + value.id + "'");
                    var areaname = "";
                    if (value.areaname == undefined) {
                        areaname = "暂无信息"
                    } else {
                        areaname = areanameArr[index];
                    }
                    if (value.sprice <= "0.001") {
                        value.sprice = "**"
                    }

                    result += '<div  class="item ' + value.id + 'p" id="' + value.id + '">';
                    result += '<a href="/auction/sign.html?param=' + encodeURI(value.disagreeinfo) + '"  class="opennew" target="_blank" >';
                    result += '<div class="product">';
                    result += '<span class="ti">预告中</span>';
                    result += '<div class="img"><img src="' + value.disagreeinfo + '" alt="" srcset=""></div>';
                    if (checkSign(value.endtime)) {
                        result += '<div class="datetime ' + value.id + 'datetime"><i></i><span class="tim ' + value.id + '">' + value.starttime.substring(0, 19) + ' <em>开始</em></span></div>';
                    }
                    result += '<div class="wrap">';
                    result += '<div class="nameAddress">';
                    result += '<div class="name">' + value.title.substring(0, 10) + '</div>';
                    result += '<div class="address"><i class="el-icon-location"></i>' + areaname + '</div>';
                    result += '</div>';
                    result += '<div class="info">';
                    result += '<div class="basePrice">起拍价：' + value.sprice + '元/' + value.unit + '</div>';
                    result += '<div class="num">数量：' + value.amount + value.unit + '</div>';
                    result += '</div>';
                    result += '</div>';
//                    result +='<img  disabled="disabled" style="display: none" src="/resources/img/home/end.png" alt="" srcset="" class="endicon  '+value.id+'img">';
                    result += '</div>';
                    result += '</div>';
                    result += '</a>';
                    result += '</div>';
                });
            }
            $(".soon>.container>.auctionids").val(auctionids.join(","));
        }
        $(".soon>.container>.content").append(result);
        //招标 即将开始
        getTenderSoonList();
    });

};

function getTenderSoonList() {
    var cates = new Array();
    var areas = new Array();
    var sprices = new Array();
    var sernum = new Array();
    var reqdata = {
        "pageNo": 1,
        "pageSize": 4,
        "status": 7,
        "company": "",
        "title": "",
        "catainfo": cates.join(","),
        "areainfo": areas.join(","),
        "sprice": sprices.join(","),
        "sernum": sernum.join(","),
        "pprice": 0,
        "stime": 0,
        "snum": 0
    };
    pairequest("/pai/tender/tolist.do", reqdata).then(function (data) {
        var result = '';
        if (data.total == 0 || data.total == "0") {
            result += "<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='/resources/img/nomore.jpg'></a></center></div>";
        } else {
            if (data.content != null) {
                var auctionids = new Array();
                $.each(data.content, function (index, value) {
                    auctionids.push("'" + value.id + "'");
                    var address = "";
                    if (value.address == undefined) {
                        address = "暂无信息"
                    } else {
                        address = value.address
                    }
                    result += '<div  class="item ' + value.tid + 'p" id="' + value.tid + '">';
                    result += '<a href="/tender/buyer/tsign.html?param=' + value.tid + '"  class="opennew" target="_blank" >';
                    result += '<div class="product">';
                    result += '<span class="ti">预告中</span>';
                    result += '<span class="tig">采购</span>';
                    result += '<div class="img"><img src="' + value.url + '" alt="" srcset=""></div>';
//                    if(checkSign(value.endtime)){
                    result += '<div class="datetime ' + value.tid + 'datetime"><i></i><span class="tim ' + value.tid + '">' + value.opentendertime.substring(0, 19) + ' <em>开始</em></span></div>';
//                    }
                    result += '<div class="wrap">';
                    result += '<div class="nameAddress">';
                    result += '<div class="name">' + value.tname.substring(0, 13) + '...</div>';
                    result += '<div class="address"><i class="el-icon-location"></i>' + address + '</div>';
                    result += '</div>';
                    result += '<div class="info">';
                    result += '<div class="num">保证金：' + value.margin + '元</div>';
                    if (value.goodsname.split(",").length == 1) {
                        result += '<div class="num">数量：' + value.amount + value.unit + '</div>';
                    }
                    result += '</div>';
                    result += '<div class="num">资产采购公司：' + value.company + '</div>';
                    result += '</div>';
                    result += '</div>';
                    result += '</div>';
                    result += '</a>';
                    result += '</div>';
                });
            }
        }
        $(".soon>.container1>.content").empty();
        $(".soon>.container1>.content").append(result);
    });

}


/*竞价结束*/
function getAuctionEndLists() {
    var company = "";
    var key = "";
    var cates = new Array();
    var areas = new Array();
    var sprices = new Array();

    $.each($(".my3"), function (index, info) {
        if ($(info).attr("class").indexOf("allcheck") > 0) {
            cates.push("'" + $(info).text() + "'");
        }
    });

    //加载竞价列表
    var serach = {
        "pageNo": 1,
        "pageSize": 4,
        "status": 4,
        "company": company,
        "title": key,
        "catainfo": cates.join(","),
        "areainfo": areas.join(","),
        "sprice": sprices.join(","),
        "pprice": -1,
        "stime": 1,
        "snum": -1
    };
    let areanameArr = ['青岛市城阳区','青岛市市北区','青岛市市南区','青岛市即墨区'];
    painoloadrequest("/pai/auction/searchAuction.do", serach).then(function (data) {

        $(".ended>.container>.content").empty();
        var result = '';
        if (data.total == 0 || data.total == "0") {
            result += "<h2 style='color: gray; font-size: 20px;margin-left: 25%;'><img src='/resources/img/nomore.jpg'></h2>";
        } else {
            if (data.content != null) {
                //result =' <div class="content">';
                var auctionids = new Array();
                $.each(data.content, function (index, value) {
                    auctionids.push("'" + value.id + "'");
                    var areaname = "";
                    if (value.areaname == undefined) {
                        areaname = "暂无信息"
                    } else {
                        areaname = areanameArr[index];
                    }

                    if (value.sprice <= "0.001") {
                        value.sprice = "**"
                    }
                    result += '<div  class="item ' + value.id + 'p" id="' + value.id + '">';
                    result += '<a href="/auction/sign.html?param=' + encodeURI(value.disagreeinfo) + '"  class="opennew" target="_blank" >';
                    result += '<div class="product">';
                    result += '<span class="ti">已结束</span>';
                    result += '<div class="img"><img src="' + value.disagreeinfo + '" alt="" srcset=""></div>';
                    result += '<div class="wrap">';
                    result += '<div class="nameAddress">';
                    result += '<div class="name">' + value.title.substring(0, 10) + '</div>';
                    result += '<div class="address"><i class="el-icon-location"></i>' + areaname + '</div>';
                    result += '</div>';
                    result += '<div class="info">';
                    result += '<div class="basePrice">起拍价：' + value.sprice + '元/' + value.unit + '</div>';
                    result += '<div class="num">数量：' + value.amount + value.unit + '</div>';
                    result += '</div>';
                    result += '<div class="start_end">竞拍开始时间：' + value.starttime.substring(0, 19) + '<br>竞拍结束时间：' + value.endtime.substring(0, 19) + '</div>';
                    result += '</div>';
                    result += '</div>';
//                    result +='<img  disabled="disabled" src="/resources/img/home/end.png" alt="" srcset="" class="endicon  '+value.id+'img">';
                    result += '</a>';
                    result += '</div>';
                });
            }
        }
        $(".ended>.container>.content").append(result);

    });
}

//检查报名时间是否小于当前时间
function checkSign(ot) {
    var nowDate = new Date().getTime();
    var myDate = new Date(ot.replace(/-/g, "/").substring(0, 19));
    if (ot != 'undefined') {
        if (nowDate < myDate) {
            return true;
        }
    }
}

//ajax轮询
function ink() {
    return;
    //竞拍中时间倒计时
    $.ajax({
        type: "get",
        url: "/pai/auction/getCurrentMoneyList.do",
        data: {"auctionids": $(".doing>.container>.auctionids").val()},
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                var alist = data.obj.alist;
                var time = data.obj.systime;
                $.each(alist, function (index, info) {
                    var endtime = info.endtimeemp;
                    if (endtime > time) {
                        var date3 = endtime - time; //时间差的毫秒数
                        //计算出相差天数
                        var days = Math.floor(date3 / (24 * 3600 * 1000));
                        //计算出小时数
                        var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                        var hours = Math.floor(leave1 / (3600 * 1000));
                        //计算相差分钟数
                        var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
                        var minutes = Math.floor(leave2 / (60 * 1000));
                        //计算相差秒数
                        var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                        var seconds = Math.round(leave3 / 1000);
                        $(".subDoing>.item>.opennew>.product>." + info.id + "price").html("");
                        $(".subDoing>.item>.opennew>.product>." + info.id + "price").html('当前价：<span>' + info.nprice + '</span>元');
                        $(".subDoing>.item>.opennew>.product>." + info.id + "datetime").empty();
                        $(".subDoing>.item>.opennew>.product>." + info.id + "datetime").append('<i></i> <span class="tim ' + info.id + '">距竞拍结束还剩：<em>' + days + '</em>天<em>' + hours + '</em>时<em>' + minutes + '</em>分<em>' + seconds + '</em>秒</span>');
                        $(".subDoing>.item>.opennew>.product>." + info.id + "img").hide();
                    } else {
                        getAuctionDoingLists();
                        getAuctionEndLists();
                    }
                });
            } else {
            }
        }
    });
    //即将开始倒计时
    $.ajax({
        type: "get",
        url: "/pai/auction/getWillBeginList.do",
        data: {"auctionids": $(".soon>.container>.auctionids").val()},
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                var alist = data.obj.alist;
                var time = data.obj.systime;
                $.each(alist, function (index, info) {
                    var starttime = info.starttimeemp;
                    if (starttime == time) {
                        getAuctionDoingLists();
                        getAuctionWillBeginLists();
                    }
                });
            }
        }
    });

}


/*$(document).ready(function(){
	$(".more").click(function(){
		var title=$(this).attr("title");
		if(title=="gzgg"){
			window.location.href="http://www.qdxhanjc.com/announce/";
		}else{
			window.location.href="/"+title+".html";
		}
	});
});*/

/**
 * 更正公告
 * @returns
 */
function gethotNewsInfo() {

    var serach = {};
    pairequest("/pai/serach/gethotNewsInfo.do", serach).then(function (data) {
        if (data.success == true) {
            $(".gzgg").empty();
            var html = ""
            $.each(data.obj, function (index, info) {
                if (index > 4) {
                    return;
                }
                ;
                html += "<li class='toinfo' id='" + info.tid + "'><span   id='" + info.tid + "'>" + info.createtime + "</span> <span>" + info.tname.substring(0, 10) + "...</span></li>";
            });
            $(".gzgg").append(html);
        }
        ;
        $(".toinfo").click(function () {
            window.location.href = "http://www.qdxhanjc.com/announce/" + $(this).attr("id") + ".html";
        });

    });
};


/**
 * 得到竞价信息 订单信息
 * @returns
 */
function getuserInframAuc() {
    var serach = {};
    pairequest("/pai/inframe/getAuctionForInframe.do", serach).then(function (data) {
        if (data.success == true) {
            $(".dcj").empty();
            $(".dtjzz").empty();

            $(".dcj").append('<a href="/auctionmanager/managersignauction.html" target="_blank" title="managersignauction" style="color:#ff6700">' + data.obj.dcj + '</a>');
            $(".dtjzz").append('<a href="/auctionmanager/managersignauction.html" target="_blank" title="managersignauction" style="color:#ff6700">' + data.obj.dtjzz + '</a>');
            getuserInframOrd();
        }

    });

};

function getuserInframOrd() {
    var serach = {};
    pairequest("/pai/inframe/getOrderForInframe.do", serach).then(function (data) {
        if (data.success == true) {
            $(".dqy").empty();
            $(".dzf").empty();
            $(".dqrdzd").empty();

            $(".dqy").html('<a href="/orderform/sellerorderformlist.html" title="managersignauction" target="_blank" style="color:#ff6700">' + data.obj.dqy + '</a>');
            $(".dzf").html('<a href="/orderform/buyerorderformlist.html" title="managersignauction" target="_blank" style="color:#ff6700">' + data.obj.dzf + '</a>');
            $(".dqrdzd").html('<a href="/orderform/buyerorderformlist.html" title="managersignauction" target="_blank" style="color:#ff6700">' + data.obj.dqrdzd + '</a>');
        }

    });

};


$(document).ready(function () {
//	fastlogin();
});

//快速登录入口
function fastlogin() {
    $(".fastlogin").click(function () {
        layer.open({
            anim: 2,
            type: 2,
            title: false,
            shade: 0.2,
            offset: 'b',
            scrollbar: true,
            area: ['500px', '400px'],
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            closeBtn: 0,
            content: ['/user/fastregist.html?time=' + new Date().getTime(), 'no']
        });

    })
}
