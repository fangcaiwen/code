var indx1
$(document).ready(function(){
    $("#header_all").load('/public/public_header.html');
    checkLogin();
    $(".memberCenterNav").load('/public/tiframeleft.html');
    getOrderList(0,3);
});

//检查登录状态
function checkLogin(){
    var userKey = getCookie("USERKEY");
    var reqdata={};
    pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
        var header = "";
        if(data.success==true){
            importantnotice();
        }else{
            window.location.href="/user/login.html";
        }

        $(".header_newe").html(header);

    });
};

function getOrderList(pageNum,pageSize){
    var orderNo_productName = $("#orderNo_productName").val();
    var orderStatus = $("#orderStatus").val();
    var beginTime = $("#beginTime").val();
    var endTime = $("#endTime").val();

    var reqdata={"orderNo_productName":orderNo_productName,"orderStatus":orderStatus,"beginTime":beginTime,"endTime":endTime,"pageNum":pageNum,"pageSize":pageSize,"role":"1"};
    pairequest("/pai/torderform/orderformlist.do",reqdata).then(function(data){
        if(data.success){
            if(data.obj && data.obj.orderformList && data.obj.orderformList.length>0){
                var orders = data.obj.orderformList;
                var htmlstr = "";
                for(var i=0;i<orders.length;i++){
                    var order=orders[i];
                    var orderStatusText="未知状态";
                    var orderOperate="";
                    if(order.orderStatus=="0"){
                        orderStatusText="待确认";
                        orderOperate="";
                    }else if(order.orderStatus=="10"){
                        orderStatusText="卖家待签约";
                        orderOperate="";
                    }else if(order.orderStatus=="20"){
                        orderStatusText="买家待签约";
                        orderOperate="<span class='layui-btn layui-btn-sm layui-btn-radius layui-btn-danger'  onclick='sign(&apos;"+order.orderNo+"&apos;)'>签订合同</span><br>";
                    }else if(order.orderStatus=="30"){
                        orderStatusText="待生成对账单";
                        orderOperate="";
                    }else if(order.orderStatus=="40"){
                        orderStatusText="待确认对账单";
                        orderOperate="<span class='layui-btn layui-btn-sm layui-btn-radius layui-btn-warm'  onclick='viewCheckorder(&apos;"+order.orderNo+"&apos;)'>查看对账单</span><br>"+
                            "<span class='layui-btn layui-btn-sm layui-btn-radius layui-btn-danger'  onclick='confirmCheckorder(&apos;"+order.orderNo+"&apos;)'>确认对账单</span><br>";
                    }else if(order.orderStatus=="50"){
                        orderStatusText="买家待付款";
                        orderOperate="<span class='layui-btn layui-btn-sm layui-btn-radius  layui-btn-danger'  onclick='payMoney(&apos;"+order.orderNo+"&apos;)'>我要付款</span><br>";
                    }else if(order.orderStatus=="60"){
                        orderStatusText="已付款待收款";
                        orderOperate="";
                    }else if(order.orderStatus=="70"){
                        orderStatusText="已收款";
                        orderOperate="";
                    }else if(order.orderStatus=="80"){
                        orderStatusText="交易完成";
                        orderOperate="";
                    }else if(order.orderStatus=="90"){
                        orderStatusText="已取消";
                        orderOperate="";
                    }
                    htmlstr=htmlstr+"<li>"+
                        "<div class='yzs-m-order-list-con1'>"
                        +"<div>"+ timestampToTime(order.addTime)+"</div>"
                        +"<div>订单编号："+order.orderNo+"</div>"
                        +"<div class='remark'>备注</div>"
                        +"</div>"
                        +"<div class='yzs-m-order-list-con2'>"
                        +"<div class='yzs-m-order-list-img'><img src='/resources/img/order/imag"+(i%3+1)+".png'"+"></div>"
                        +"<div class='yzs-m-order-list-info'>"
                        +"<div>"+order.productName+"</div>"
                        +"<div style='font-size: 8px;'>"+order.seller.company+"</div>"
                        +"</div>"
                        +"<div class='yzs-m-order-list-price'>¥"+order.price+"元</div>"
                        +"<div class='yzs-m-order-list-num'>"+order.amount+order.unit+"</div>"
                        +"<div class='yzs-m-order-list-price'><span>¥"+order.totalMoney+"元</span></div>"
                        +"<div class='yzs-m-order-list-price'><span class='colororange'>¥"+order.dealMoney+"元</span></div>"
                        +"<div class='yzs-m-order-list-status'>"
                        +"<span class='' style='font-size: 10px'>"+orderStatusText+"</span><br>"
                        +orderOperate
                        +"</div>"
                        +"<div class='yzs-m-order-list-opt'>"
                        +"<a href='#' class='colorblack'>"
                        +"<a href='javascript:void(0);' class='layui-btn layui-btn-radius layui-btn-sm' onclick='orderinfo(&apos;"+order.orderNo+"&apos;)'>订单详情</a></a></div>"
                        +"</div>"
                        +"</li>"
                }
                $("#orders").html(htmlstr);

                //分页
                data = data.obj;
                $(".allPage").html(Math.ceil(data.total/data.pageSize));
                page(data.total,{"items_per_page":data.pageSize,"num_display_entries":6,"current_page":data.pageNum,"callback":query, "link_to":"javascript:void(0);"});
            }else{
                var ht="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='http://www.ezaisheng.cn/resources/img/nomore.jpg'></a></center></div>";
                $("#orders").html(ht);
            }
        }else{

        }
    });
}

//搜索订单
function searchOrder(pageNum){
    getOrderList(pageNum);
}

function page(total,opts){
    $("#Pagination").pagination(total,opts);
}

function query(pageNum,jq){
    getOrderList(pageNum);
}

function orderinfo(orderno){
    return;
    window.location.href="/torderform/buyerordershow.html?param="+orderno;
}
//签订合同
function sign(orderNo){
    return;
    var reqdata={
        'orderNo':orderNo
    };
    pairequest("/pai/torderform/getSignParam.do",reqdata).then(function(data){
        console.log(data);
        if(data.success==true){
            var jsondata={};
            jsondata.orderno=orderNo;
            processContent(jsondata);
        }else{
            layer.msg(data.msg,{offset: 't',anim: 6});
        }
    });
}
/**
 * 生成合同
 * @param jsondata
 * @returns
 */
function processContent(jsondata){
    var callBackUrl="";
    var reqdata=jsondata;
    pairequest("/pai/auction/content/processContent.do",reqdata).then(function(data){
        console.log(data);
        if(data.success==true){
            jsondata.pdfurl=data.obj.pdfurl;
            signOpen(jsondata);
        }else{
            layer.msg(data.msg,{offset: 't',anim: 6});
        }

    });
}

/**
 * 打开按钮
 * @param orderid
 * @param regid
 * @param guser
 * @param ghaoma
 * @param callBackUrl
 * @param pdfurl
 * @returns
 */
var signopen
function signOpen(jsondata){
    signopen= layer.open({
        type: 2,
        title: "签订合同",
        shadeClose: false,
        shade: 0.5,
        maxmin: false, //开启最大化最小化按钮
        area: ['80%', '70%'],
        content:jsondata.pdfurl
        ,btn: ['签订合同'/*, '下载合同'*/, '关闭']
        ,yes: function(index, layero){
            //按钮【按钮一】的回调
            signContent(jsondata);
            return false ;
        }
        /*,btn2: function(index, layero){
          //按钮【按钮二】的回调
           layer.msg(2);
          return false ;//开启该代码可禁止点击该按钮关闭
        }*/
        ,btn3: function(index, layero){
            //关闭
        }

    });
};

/**
 * 签订合同
 * @returns
 */
function signContent(jsondata){
    var reqdata=jsondata;
    pairequest("/pai/auction/content/signContent.do",reqdata).then(function(data){
        console.log(data);
        if(data.success==true){
            jsondata.pdfurl=data.obj.pdfurl;
            layer.close(signopen);
            signOpen(jsondata);
        }else{
            layer.msg(data.msg,{offset: 't',anim: 6});
        }
    });
};


/**
 * 下载合同
 * @returns
 */
function downLoadContent(){

};

//查看对账单
function viewCheckorder(orderNo){
    return;
    layer.open({
        type: 2,
        title: '查看对账单',
        shadeClose: false,
        shade: 0.5,
        maxmin: false, //开启最大化最小化按钮
        area: ['80%', '70%'],
        content: ['/torderform/checkorder/buyer_checkorder_view.html?v='+new Date().getTime(), 'yes'],
        success:function(layero, index){
            debugger;
            var body = layer.getChildFrame('body', index);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            body.find('#orderNo').val(orderNo);
            iframeWin.getFormatDateStr();
            iframeWin.getFullData();
            iframeWin.caculatemoney();
        }
    });
}

//确认对账单
function confirmCheckorder(orderNo){
    return;
    layer.open({
        type: 2,
        title: '查看对账单',
        shadeClose: false,
        shade: 0.5,
        maxmin: false, //开启最大化最小化按钮
        area: ['80%', '70%'],
        content: ['/torderform/checkorder/buyer_checkorder_view.html?v='+new Date().getTime(), 'yes'],
        success:function(layero, index){
            var body = layer.getChildFrame('body', index);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            body.find('#orderNo').val(orderNo);
            iframeWin.getFormatDateStr();
            iframeWin.getFullData();
            iframeWin.caculatemoney();
        }
    });
}

//支付
function payMoney(orderNo){
    return;
    /*var param={};
    param["orderNo"]=orderNo;
    topay("/pai/torderform/checkorder/payMoney.do",param);*/
    var reqdata={'orderNo':orderNo};
    pairequest("/pai/torderform/checkorder/checkneedpay.do",reqdata).then(function(data){
        if(data.success==true){
            //需先支付手续费
            var obj = data.obj;
            var status=data.obj.status;
            if(status==0){
                var str = "<div><h4>您需要先支付服务费</h4><p>金额："+obj.servicecharge+"元</p></div>";
                layer.confirm(str, {btn: ['确定', '取消'], title: "提示"},  function () {
                    var param={};
                    param["orderNo"]=orderNo;
                    topay("/pai/torderform/checkorder/payservicecharge.do",param);
                });
            }else if(status==3){
                var str = "<div><h4>您需要先支付服务费</h4><p>金额："+obj.servicecharge+"元</p><p>你可以选择‘立即支付’，</p><p>或者选择‘跳过’到月结中心统一支付</p></div>";
                layer.confirm(
                    str,
                    {btn: ['跳过', '立即支付'], title: "提示",shade:0.8},
                    function () {
                        var param={};
                        param["orderNo"]=orderNo;
                        topay("/pai/torderform/checkorder/payMoney.do",param);
                    },
                    function(){
                        var param={};
                        param["orderNo"]=orderNo;
                        topay("/pai/torderform/checkorder/payservicecharge.do",param);
                    }
                );
            }else{
                var param={};
                param["orderNo"]=orderNo;
                topay("/pai/torderform/checkorder/payMoney.do",param);
            }

        }else{
            layer.msg(data.obj.msg,{offset: 't',anim: 6})
        }
    });
}

//时间戳转为格式化日期
function timestampToTime(timestamp) {
    if(timestamp != null && timestamp != undefined && timestamp != ""){
        if(timestamp.length == 10){
            timestame = timestamp * 1000;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        }
        var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s;
    }
    return "";
}


//重要通知important_notice
function importantnotice(){
    setTimeout(function() {
        layer.tips('重要提示：订单自竞价成功之日起30日内若无任何对账交易，系统将自动按订单成交金额*0.6%收取交易服务费。详情请见<a href="/bank/monthfee.html?v=20191024&ltype=t" target="_blank">手续费中心</a>。', '.important_notice', {
            tips: [1, '#FF5722'],
            time: 30000
        });
    }, 2000);
}

