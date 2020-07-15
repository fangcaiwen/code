var pageNo = 0;
$(document).ready(function () {
    $("#header_all").load('/public/public_header.html');
    $(".memberCenterNav").load('/public/iframeleft.html');
    checkLogin();
    authparams();
    allpush();
    //计价公式
    $(".formula").click(function () {
        if ($(this).val() == "暂无计价公式") {
            $(this).val("");
        }
    });
    $(".formula").blur(function () {
        if ($(this).val() == "") {
            $(this).val("暂无计价公式");
        }
    });
});

var iscp = false;

// 检查登录状态
function checkLogin() {
    var userKey = getCookie("USERKEY");

    var reqdata = {};
    pairequest("/pai/userPro/checkLoginStatus.do", reqdata).then(function (data) {
        var header = "";
        if (data.success == true) {
            var timestamp = Date.parse(new Date());
            $.getJSON("/resources/json/tender_blank.json?time=" + timestamp, function (data1) {
                $.each(data1, function (index, info) {
                    if (info.id == data.obj.userid) {
                        iscp = true;
                        //$(".head").html('商品批量发布竞拍<span style="color:red;">（子公司无需填写起拍价格）</span>');
                        $("#psprice").attr("disabled", 'disabled');
                    }
                })
            });
        } else {
            window.location.href = "/user/login.html";
        }

        $(".header_newe").html(header);

    });
};


function authparams() {

    var reqdata = {};
    pairequest("/pai/memberAuth/toMemberAuth.do", reqdata).then(function (data) {
        if (data.success == true) {
            var status = data.obj.status;
            userinfo = data.obj.upistr;
            //0 1  3审核中  4 已通过 5 未通过
            var html = "";
            if (status == 3 || status == 4 || status == 5) {
                if (status != 5) {
                    if (status == 3) {
                        paiAlert("实名认证审核中，暂无待审核竞拍商品。", "/", "随便逛逛");
                    } else {
                        //有权限
                    }
                } else {
                    paiAlert("实名认证未通过，暂无竞拍商品。", "/auth/authinit.html", "重新去实名认证");
                }
            } else {
                paiAlert("未实名认证，暂无竞拍商品。", "/auth/authinit.html", "去实名认证");
            }
        } else {
            window.location.href = "/user/login.html";
        }

    });
};


/**
 * 遮罩
 * @param title
 * @param tourl
 * @returns
 */
function paiAlert(title, tourl, bt) {
    return;
    layer.msg(title, {
        time: 100000,
        shade: 0.8,
        anim: 2,
        btn: [bt]
        , yes: function () {
            window.location.href = tourl;
        }
    });

    setTimeout(function () {
        window.location.href = tourl;
    }, 100000);
};

$(document).ready(function (e) {
    $(".yzs-form").hide();
    $(".mc_titl a").click(function () {
        var inds = $(this).index();
        $(this).addClass("checked");
        $(this).siblings("a").removeClass("checked");
        $(".mc_dis_none").hide();
        $(".mc_dis_none").eq(inds).show();
    });
    initpager();
});

function showReason(a) {
    if (a == 'null' || a == null || a == 'undefined') {
        return;
    } else {
        layer.open({
            type: 1
            ,
            title: false //不显示标题栏
            ,
            closeBtn: false
            ,
            area: '300px;'
            ,
            shade: 0.8
            ,
            id: 'LAY_layuipro' //设定一个id，防止重复弹出
            ,
            resize: false
            ,
            btn: ['关闭']
            ,
            btnAlign: 'c'
            ,
            moveType: 1 //拖拽模式，0或者1
            ,
            content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">' + a + '</div>'
            ,
            success: function (layero) {
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
function modyfiy(a) {

    var reqdata = {"acutid": a};
    pairequest("/pai/auction/editauction.do", reqdata).then(function (data) {
        if (data.success == true) {
            layer.open({
                type: 2,
                title: data.obj,
                shade: false,
                shadeClose: true, //开启遮罩关闭
                maxmin: true, //开启最大化最小化按钮
                area: ['80%', '60%'],
                content: '/auctionmanager/editauction.html?time=' + new Date().getTime()
            });
        } else {
            layer.msg(data.msg, {offset: 't', anim: 6});
        }

    });
}

var phots = new Array();

function getMyPublishAuction(pageNum) {
    pageNo = pageNum;
    var pageSize = 50;
    var reqdata = {"pageNo": pageNum + 1, "pageSize": pageSize};
    pairequest("/pai/auction/goods/getAuctionGoodsList.do", reqdata).then(function (resdata) {
        var data = resdata.obj;
        var result = "";
        if (data.content == null || data.content == "") {
            result += "<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='http://www.ezaisheng.cn/resources/img/nomore.jpg'></a></center></div>";
            var paper = "<a href='javascript:;'>&lt;</a>" +
                "<span class='pager_number'><strong>0</strong>/" +
                "0</span><a href='javascript:;'>&gt;</a> ";
            $(".pager").html(paper);
            $(".ezspage").hide();
        } else {
            if (data.content != null) {
                totalpage = data.total;
                result += "<tr><th width='1%' class='layui-unselect'></th> <th width='7%' class='layui-unselect'><span></span></th><th width='7%'><span></span></th><th width='7%'><span></span></th><th width='7%'><span></span></th><th width='7%'><span></span></th><th width='7%'><span></span></th></tr>";
                $.each(data.content, function (index, value) {
                    var opt = {};
                    opt["id"] = value.goodsid;
                    var thumbs = value.picurl;
                    var thumb1 = value.thumb1 == "" ? "" : value.thumb1;
                    var thumb2 = value.thumb2 == "" ? "" : value.thumb2;
                    if (thumb1 != "" && thumb1 != undefined) {
                        thumbs += "," + thumb1;
                    }
                    if (thumb2 != "" && thumb2 != undefined) {
                        thumbs += "," + thumb2;
                    }
                    opt["thumb"] = thumbs;
                    phots.push(opt);
                    result += "<tr>";
                    result += "<td width='2%' class=''>";
                    result += '<input type="checkbox" lay-skin="primary" name="c" title=""   id="' + value.goodsid + '" >';
                    result += "</td>";
                    result += "<td width='5%' style=''>";
                    result += "<div ><img class='img' title='" + value.goodsid + "' src='" + ((value.picurl == undefined || value.picurl == "") ? "http://www.ezaisheng.cn/resources/img/nomore.jpg" : value.picurl) + "'></div>";
                    result += "</td>";
                    result += "<td width='7%'><span class='tdtitle' title='" + value.goodsname + "'>" + value.goodsname.substr(0, 16) + "</span></td>";
                    result += "<td width='7%'><span>" + value.bond + "元</span></td>";
                    result += "<td width='7%'><span>" + value.addtime + "</span></td>";
                    result += "<td width='7%'><span>" + value.updatetime + "</span></td>";
                    result += "<td width='9%'>" +
                        "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs layui-btn-warm layui-btn-radius' onclick='pushAuctionView(&apos;" + value.goodsid + "&apos;)'>发布</button>" +
                        "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs  layui-btn-radius' onclick='editAuctionGoods(&apos;" + value.goodsid + "&apos;)'>编辑</button>" +
                        "<button href='javascript:void(0)' class='layui-btn  layui-btn-xs layui-btn-danger layui-btn-radius' onclick='deleteFalseAuction(&apos;" + value.goodsid + "&apos;)'>删除</button></td>";
                    result += "</tr>";
                });
            }
        }

        $("#dataTable").append(result);
        //图片查看
        imgLook()
        //
        $(".tdtitle").mouseover(function () {
            layer.tips($(this).attr("title"), this, {
                tips: [1, '#3595CC'],
                time: 4000
            });
        })
        //全选
        allpushcheck();
        layui.use(['form', 'layedit', 'laydate'], function () {
            var form = layui.form;
            var layer = layui.layer
            var layedit = layui.layedit
            var laydate = layui.laydate;
            form.render(null, 'allpush');
            form.render('checkbox');
            //日期
            laydate.render({
                elem: '#auctionlookstarttime'
                , type: 'date'
            });
            laydate.render({
                elem: '#auctionlookendtime'
                , type: 'date'
            });
            laydate.render({
                elem: '#auctionpactendtime'
                , type: 'date'
            });
            laydate.render({
                elem: '#auctionpactstarttime'
                , type: 'date'
            });
            laydate.render({
                elem: '#auctionstarttime'
                , type: 'datetime'

            });
            laydate.render({
                elem: '#auctionendtime'
                , type: 'datetime'
            });
            form.on('switch(basepush)', function (data) {
                if (this.checked) {
                    $("input[name='productList[0].sprice']").addClass("layui-btn-disabled");
                    $("input[name='productList[0].jprice']").addClass("layui-btn-disabled");
                    $("input[name='productList[0].sprice']").val(1);
                    $("input[name='productList[0].jprice']").val(1);
                } else {
                    $("input[name='productList[0].sprice']").val(0);
                    $("input[name='productList[0].jprice']").val(0);
                    $("input[name='productList[0].sprice']").removeClass("layui-btn-disabled");
                    $("input[name='productList[0].jprice']").removeClass("layui-btn-disabled");
                }
            });
        });
    });
};

/**
 * 分页初始化
 * @returns
 */
function initpager() {
    var pageSize = 50;
    var reqdata = {"pageNo": 1, "pageSize": pageSize};
    pairequest("/pai/auction/goods/getAuctionGoodsList.do", reqdata).then(function (resdata) {
        var data = resdata.obj;
        if (data.content != null) {
            layui.use(['laypage', 'layer'], function () {
                var laypage = layui.laypage
                    , layer = layui.layer;
                laypage.render({
                    elem: 'demo3'
                    , limit: 50
                    , count: data.total
                    , layout: ['count', 'next']
                    , jump: function (obj) {
                        getMyPublishAuction(obj.curr - 1);
                    }
                });
            });
        }

    });
}

function query(pageNum, jq) {
    getMyPublishAuction(pageNum);
}

function page(total, opts) {
    $("#Pagination").pagination(total, opts);
}

function paymargin(id) {
    top.location.href = "/pai/auction/paySellerBond.do?id=" + id;
}


/**
 * 及时发布竞价页面
 * @returns
 */
function pushAuctionView(goodsid) {
    layer.open({
        anim: 2,
        type: 1,
        title: false,
        shade: 0.1,
        scrollbar: true,
        closeBtn: 0,
        shadeClose: false,
        area: ['100%', '50%'],
        content: $(".yzs-form")
        , btn: ['确认发布', '预览公告', '取消']
        , yes: function (index, layero) {
            //按钮【按钮一】的回调
            var jsondata = {};
            jsondata["goodsid"] = goodsid;
            var isp = true;
            $.each($($(layero).find("input")), function (i, inf) {
                var name = $(inf).attr("name");
                var placeholder = $(inf).attr("placeholder");
                var valu = $(inf).val();
                if (valu == null || valu == '') {
                    isp = false;
                    layer.msg(placeholder, {offset: 't', anim: 6});
                    return false;
                }
                jsondata[name] = valu;
            });
            jsondata["auction.delay"] = $(layero).find("select[name='auction.delay']").val();
            if (isp) {
                if (jsondata["auction.endtime"] < jsondata["auction.starttime"]) {
                    layer.msg("开始时间需小于结束时间", {offset: 't', anim: 6});
                    return false;
                }
                if (jsondata["auction.pactendtime"] < jsondata["auction.pactstarttime"]) {
                    layer.msg("合同开始时间需小于结束时间", {offset: 't', anim: 6});
                    return false;
                }
                if (jsondata["auction.lookstarttime"] > jsondata["auction.lookendtime"]) {
                    layer.msg("看货开始时间需小于结束时间", {offset: 't', anim: 6});
                    return false;
                }

                pushAuction(jsondata);
            }
            return false;
        }
        , btn2: function (index, layero) {
            //按钮【按钮一】的回调
            var jsondata = {};
            jsondata["goodsid"] = goodsid;
            var isp = true;
            $.each($($(layero).find("input")), function (i, inf) {
                var name = $(inf).attr("name");
                var placeholder = $(inf).attr("placeholder");
                var valu = $(inf).val();
                if (valu == null || valu == '') {
                    isp = false;
                    layer.msg(placeholder, {offset: 't', anim: 6});
                    return false;
                }
                jsondata[name] = valu;
            });
            jsondata["auction.delay"] = $(layero).find("select[name='auction.delay']").val();
            if (isp) {
                if (jsondata["auction.endtime"] < jsondata["auction.starttime"]) {
                    layer.msg("开始时间需小于结束时间", {offset: 't', anim: 6});
                    return false;
                }
                if (jsondata["auction.pactendtime"] < jsondata["auction.pactstarttime"]) {
                    layer.msg("合同开始时间需小于结束时间", {offset: 't', anim: 6});
                    return false;
                }

                previewAuctionNotice(jsondata);
            }
            return false;
        }
        , btn3: function (index, layero) {
        }
    });
};

/**
 * 预览公告
 * @param jsondata
 * @returns
 */
function previewAuctionNotice(jsondata) {
    var reqdata = jsondata;
    pairequest("/pai/auction/goods/previewAuctionNotice.do", reqdata).then(function (data) {
        if (data.success) {
            var goods = data.obj;
            var template = feisuliaoTemplate;
            if (goods.catanames) {
                var catename = goods.catanames;
                if (catename.indexOf("@") > 0) {
                    catename = catename.substring(0, catename.indexOf("@"));
                    if (catename.indexOf("废油") > 0) {
                        template = feiyouTemplate;
                    } else if (catename.indexOf("废钢") > 0) {
                        template = feigangTemplate;
                    }
                }
            }
            console.log(goods);
            template = template.replace(/@company/g, goods.auctiontitle);
            template = template.replace(/@goodsName/g, goods.goodsname);
            template = template.replace(/@auctionStartTime/g, jsondata["auction.starttime"]);
            template = template.replace(/@auctionEndTime/g, jsondata["auction.endtime"]);
            template = template.replace(/@goodsAddress/g, goods.goodsaddress.replace(/@/g, ""));
            template = template.replace(/@goodsamount/g, goods.goodsamount);
            template = template.replace(/@goodsunit/g, goods.goodsunit);
            template = template.replace(/@goodsdes/g, goods.goodsdes);
            template = template.replace(/@pactStartTime/g, jsondata["auction.pactstarttime"]);
            template = template.replace(/@pactEndTime/g, jsondata["auction.pactendtime"]);
            template = template.replace(/@goodBonds/g, goods.bond);
            template = template.replace(/@goodsCate/g, catename);
            template = template.replace(/@formula/g, $("#formula").val());
            template = template.replace(/@lookstarttime/g, jsondata["auction.lookstarttime"]);
            template = template.replace(/@lookendtime/g, jsondata["auction.lookendtime"]);
            layer.open({
                anim: 2,
                type: 1,
                title: "公告预览",
                shade: 0.1,
                scrollbar: true,
                shadeClose: false,
                area: ['80%', '60%'],
                content: template
            });
        } else {
            layer.msg(data.msg, {offset: 't', anim: 6});
        }
    });
}


/**
 * 发布竞价
 * @param jsondata
 * @returns
 */
function pushAuction(jsondata) {

    var reqdata = jsondata;
    pairequest("/pai/auction/goods/publishAuction.do", reqdata).then(function (data) {
        if (data.success) {
            paiAlert(data.msg + "3秒后跳入待审核竞拍管理页面", "/auctionmanager/pushauctiongoods.html", "我要继续发布");
            setTimeout(function () {
                location.href = "/auctionmanager/managerauction.html";
            }, 3000);
        } else {
            layer.msg(data.msg, {offset: 't', anim: 6});
        }
    });
};

/**
 * 删除
 * @param goodsid
 * @returns
 */
function deleteFalseAuction(goodsid) {

    var reqdata = {"goodsid": goodsid};
    pairequest("/pai/auction/goods/deleteAuctionGoods.do", reqdata).then(function (data) {
        if (data.success) {
            layer.msg(data.msg, {offset: 't', anim: 6});
            for (var i = 0; i < pageNo - 1; i++) {
                getMyPublishAuction(pageNo);
            }
            initpager();
        } else {
            layer.msg(data.msg, {offset: 't', anim: 6});
        }

    });
}

/**
 * 修改商品
 * @returns
 */
function editAuctionGoods(goodsid) {
    layer.open({
        type: 2,
        title: "修改商品",
        shade: false,
        shadeClose: true, //开启遮罩关闭
        maxmin: true, //开启最大化最小化按钮
        area: ['80%', '60%'],
        content: '/auctionmanager/editgoods.html?time=' + new Date().getTime() + "&param=" + goodsid
    });


}

/**
 * 全部选中
 * @returns
 */
function allpushcheck() {
    $("input[name='all']").click(function () {
        if ($("input[name='all']").attr("checked") == "checked") {
            $("input[name='c']").attr("checked", true);
        } else {
            $("input[name='c']").attr("checked", false);
        }
    });
}


/**
 * 批量发布竞拍
 * @returns
 */
function allpush() {
    $(".push").click(function () {
        var goodsids = new Array();
        $.each($("input[name='c']"), function (index, info) {
            if ($(info).attr("checked") == "checked") {
                goodsids.push($(info).attr("id"));
            }

        });
        if (goodsids.length == 0) {
            layer.msg("请选择批量竞拍商品", {offset: 't', anim: 6});
            return false;
        }
        var html = '';
        if (iscp) {
            html += '<div class="memberCenterContent" style="width: 93%;"><div class="head">商品批量发布竞拍<span style="color:red;">（子公司无需填写起拍价格）</span> ';
            html += '<input style="margin-left: 21%;" class="layui-btn layui-btn-sm layui-btn-danger aucttime layui-btn-radius" value="统一竞价时间"/>';
            html += '<input class="layui-btn layui-btn-sm layui-btn-danger pacttime layui-btn-radius" value="统一合同日期"/>';
            html += '<input class="layui-btn layui-btn-sm layui-btn-danger looktime layui-btn-radius" value="统一看货日期"/>';
            html += '<input class="layui-btn layui-btn-sm layui-bg-orange basetopush layui-btn-radius" value="一元起拍(new)"/>';
            html += '</div>';
        } else {
            html += '<div class="memberCenterContent" style="width: 93%;"><div class="head">商品批量发布竞拍';
            html += '<input style="margin-left: 21%;" class="layui-btn layui-btn-sm layui-btn-danger aucttime layui-btn-radius" value="统一竞价时间"/>';
            html += '<input class="layui-btn layui-btn-sm layui-btn-danger pacttime layui-btn-radius" value="统一合同日期"/>';
            html += '<input class="layui-btn layui-btn-sm layui-btn-danger looktime layui-btn-radius" value="统一看货日期"/>';
            html += '<input class="layui-btn layui-btn-sm layui-bg-orange basetopush layui-btn-radius" value="一元起拍(new)"/>';
            html += '</div>';
        }

        html += '<div class="batchPublic layui-form" lay-filter="checkedpush">';
        html += '<table width="100%" cellspacing="0">';
        html += '<tbody>';
        html += '<tr>';
        html += '<th  width="12%" >商品名称 </th>';
        html += '<th  width="8%">商品数量</th>';
        html += '<th  width="10%">起拍价</th>';
        html += '<th  width="10%">加价幅度</th>';
        html += '<th  width="10%">延时周期<br>(分钟/次）</th>';
        html += '<th  width="15%">竞价时间</th>';
        html += '<th  width="15%">合同期限</th>';
        html += '<th  width="15%">看货验质时间:</th>';
        html += '<th   width="10%">保证金</th>';
        html += '<th   width="10%">计价公式</th>';
        html += '</tr>';
        var reqdata = {"goodsids": goodsids.join(",")};
        pairequest("/pai/auction/goods/getAuctionGoodsListByGoodsIds.do", reqdata).then(function (resdata) {

            var data = resdata.obj;
            if (resdata.success == false) {
                layer.msg(resdata.msg, {offset: 't', anim: 6});
                return false;
            }
            $.each(data, function (index, info) {
                html += '<tr>';
                html += '<td width="12%" style="background: #fff;">' + info.goodsname + '</td>';
                html += "<td width='8%'><input type='hidden' name='goodslist[" + index + "].goodsid' value='" + info.goodsid + "'/>" +
                    "<input  type='hidden' name='goodslist[" + index + "].goodsname' value='" + info.goodsname + "'/>" +
                    "<input type='text' name='auctionlist[" + index + "].prdList[0].amount' value='" + info.goodsamount + "'  class='layui-input' id='pamount' onkeyup='this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[&apos;&apos;])[0]' ></td>";

                if (iscp) {
                    html += "<td  width='10%'><input disabled='disabled' type='text' value='0' name='auctionlist[" + index + "].prdList[0].sprice' id='psprice' onkeyup='this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[&apos;&apos;])[0]' placeholder='请输入起拍价(元)' lay-verify='required|phone' autocomplete='off' class='layui-input layui-btn-disabled allpushsprice'></td>";
                } else {
                    html += "<td  width='10%'><input type='text' value='0' name='auctionlist[" + index + "].prdList[0].sprice' id='psprice' onkeyup='this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[&apos;&apos;])[0]' placeholder='请输入起拍价(元)' lay-verify='required|phone' autocomplete='off' class='layui-input allpushsprice'></td>";
                }

                html += "<td width='10%'><input style='width: 150px;' type='number' name='auctionlist[" + index + "].prdList[0].jprice' id='pjprice' onkeyup='' placeholder='请输入加价幅度(元)' lay-verify='required|phone' autocomplete='off' class='layui-input allpushpjprice'></td>";
                html += '<td width="10%"><div class="m-input">';
                html += '<select name="auctionlist[' + index + '].delay" style=" delay">';
                html += '<option value="1">2分钟/次</option>';
                html += '<option value="2">5分钟/次</option>';
                html += '<option value="0">无</option>';
                html += '</select>';
                html += '</div></td>';
                html += '<td width="15%"><input style="width: 150px;"  type="text" name="auctionlist[' + index + '].starttime" id="auction.starttime" placeholder="请选择竞价开始时间" onclick="WdatePicker({dateFmt:&apos;yyyy-MM-dd HH:mm:ss&apos;})" class="layui-input starttime starttime' + index + '"><input  style="width: 150px;" type="text" name="auctionlist[' + index + '].endtime" id="auction.endtime" placeholder="请选择竞价结束时间" onclick="WdatePicker({dateFmt:&apos;yyyy-MM-dd HH:mm:ss&apos;})"  class="layui-input endtime endtime' + index + '"></td>';
                html += '<td width="15%"><input style="width: 150px;"  type="text" name="auctionlist[' + index + '].pactstarttime" id="auction.pactstarttime" placeholder="请选择合同开始时间" onclick="WdatePicker({dateFmt:&apos;yyyy-MM-dd&apos;})" class="layui-input pactstarttime pactstarttime' + index + '" ><input  style="width: 150px;" type="text" name="auctionlist[' + index + '].pactendtime" id="auction.pactendtime" placeholder="请选择合同结束时间" onclick="WdatePicker({dateFmt:&apos;yyyy-MM-dd &apos;})"  class="layui-input pactendtime pactendtime' + index + '"></td>';
                html += '<td width="15%"><input style="width: 150px;"  type="text" name="auctionlist[' + index + '].lookstarttime" id="auction.lookstarttime" placeholder="请选择看货开始时间" onclick="WdatePicker({dateFmt:&apos;yyyy-MM-dd &apos;})" class="layui-input lookstarttime lookstarttime' + index + '"><input  style="width: 150px;" type="text" name="auctionlist[' + index + '].lookendtime" id="auction.lookendtime" placeholder="请选择看货结束时间" onclick="WdatePicker({dateFmt:&apos;yyyy-MM-dd &apos;})"  class="layui-input lookendtime lookendtime' + index + '"></td>';
                html += "<td width='10%'><input  type='text' name='auctionlist[" + index + "].bond' id='bond' value='0'  placeholder='请输入保证金'  class='layui-input bond' onkeyup='this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[&apos;&apos;])[0]'></td>";
                html += "<td width='10%'><input  type='text' name='auctionlist[" + index + "].formula' id='formula' value='暂无计价公式'  placeholder='请输入计价公式'  class='layui-input formula' ></td>";
                html += '</tr>';
            });
            html += '</tbody>';
            html += '</table>';
            html += '</div></div>';
            html += '<script>';
            html += '$(document).ready(function(){';
            html += '$(".bond").keyup(function(){';
            html += '$(".bond").val($(this).val());';
            html += '});';
            html += '$(".looktime").click(function(){';
            html += '$(".lookendtime").val($(".lookendtime0").val());';
            html += '$(".lookstarttime").val($(".lookstarttime0").val());';
            html += '	});';
            html += "$('.pacttime').click(function(){";
            html += "	$('.pactendtime').val($('.pactendtime0').val());";
            html += "	$('.pactstarttime').val($('.pactstarttime0').val());";
            html += "	});";
            html += "$('.aucttime').click(function(){";
            html += "$('.starttime').val($('.starttime0').val());";
            html += "$('.endtime').val($('.endtime0').val());";
            html += "	});";
            html += '$(".formula").click(function(){';
            html += '	 if($(this).val()=="暂无计价公式"){';
            html += '		 $(this).val("");';
            html += '	 }';
            html += '	 $(".formula").blur(function(){';
            html += '		 if($(this).val()==""){';
            html += '			 $(this).val("暂无计价公式");';
            html += '		 }';
            html += '	 });';

            html += ' })';


            html += "});</script>";
            allpushShow(html);

        });

    });
};

//设置一元起拍
function basetopush() {
    $(".basetopush").click(function () {
        var tclass = $(this).attr("class");
        if (tclass.indexOf("ischecked") == -1) {
            $(this).addClass("ischecked");
            $(".allpushpjprice").addClass("layui-btn-disabled");
            $(".allpushsprice").addClass("layui-btn-disabled");
            $(".allpushpjprice").val(1);
            $(".allpushsprice").val(1);
        } else {
            $(this).removeClass("ischecked");
            $(".allpushpjprice").removeClass("layui-btn-disabled");
            $(".allpushsprice").removeClass("layui-btn-disabled");
            $(".allpushpjprice").val(0);
            $(".allpushsprice").val(0);
        }


    })
}


function allpushShow(html) {
    layer.open({
        anim: 2,
        type: 1,
        title: false,
        shade: 0.1,
        scrollbar: true,
        shadeClose: false,
        area: ['90%', '50%'],
        maxmin: true,
        content: html,
        btn: ['确认发布', /* '预览公告',*/'取消'],
        yes: function (index, layero) {
            //按钮【按钮一】的回调
            var jsondata = {};
            var isp = true;
            $.each($($(layero).find("input")), function (i, inf) {
                var name = $(inf).attr("name");
                var placeholder = $(inf).attr("placeholder");
                var valu = $(inf).val();
                if (valu == null || valu == '') {
                    isp = false;
                    layer.msg(placeholder, {offset: 't', anim: 6});
                    return false;
                }
                jsondata[name] = valu;
            });
            $.each($($(layero).find("select")), function (i, inf) {
                var name = $(inf).attr("name");
                var placeholder = $(inf).attr("placeholder");
                var valu = $(inf).val();
                if (valu == null || valu == '') {
                    isp = false;
                    layer.msg(placeholder, {offset: 't', anim: 6});
                    return false;
                }
                jsondata[name] = valu;
            });
            if (isp) {
                pushCheckAuction(jsondata);
            }
            return false;

        },
        btn3: function (index, layero) {
            window.location.href = "/auctionmanager/pushauctiongoods.html";
        }
    });


    layui.use(['form', 'layedit', 'laydate'], function () {
        var form = layui.form;
        var layer = layui.layer
        var layedit = layui.layedit
        var laydate = layui.laydate;
        form.render(null, 'checkedpush');
    });
    basetopush()
}

/**
 * 批量发布竞价
 * @param jsondata
 * @returns
 */
function pushCheckAuction(jsondata) {

    var reqdata = jsondata;
    pairequest("/pai/auction/goods/publishAllAuction.do", reqdata).then(function (data) {
        if (data.success) {
            layer.msg("成功" + data.obj.success + "条,失败" + data.obj.fail + "条。</br>失败原因为：</br>" + data.obj.failname, {
                offset: 't',
                anim: 6
            });
        } else {
            layer.msg(data.msg, {offset: 't', anim: 6});
        }

    });
}


function imgLook() {
    $(".img").click(function () {
        var id = $(this).attr("title");
        var array = new Array();
        $.each(phots, function (index, info) {
            if (info.id == id) {
                array = info.thumb.split(",")
                return;
            }
        })
        var data = new Array();
        $.each(array, function (index, info) {
            if (info == "" || info == "undefined") {
                return;
            }
            var html = {};
            html["alt"] = "";
            html["pid"] = new Date().getTime();
            html["src"] = info;
            html["thumb"] = info;
            data.push(html);
        })
        var photo = {
            "title": "", //相册标题
            "id": new Date().getTime(), //相册id
            "start": 0, //初始显示的图片序号，默认0
            "data": data
        }

        layer.photos({
            photos: photo //格式见API文档手册页
            , anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机
        });

    });
};

