$(document).ready(function(){
    $("#header_all").load('/public/public_header.html');
    $(".memberCenterNav").load('/public/tiframeleft.html');
    checkLogin();
    getOrderList(0,3);

});

//检查登录状态
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

var uparray=new Array();

function getOrderList(pageNum,pageSize){
    uparray=new Array();
    uparray.push(pageNum);
    var orderNo_productName = $("#orderNo_productName").val();
    var orderStatus = $("#orderStatus").val();
    var beginTime = $("#beginTime").val();
    var endTime = $("#endTime").val();

    var reqdata={"orderNo_productName":orderNo_productName,"orderStatus":orderStatus,"beginTime":beginTime,"endTime":endTime,"pageNum":pageNum,"pageSize":pageSize,"role":"0"};
    pairequest("/pai/torderform/orderformlist.do",reqdata).then(function(data){
        if(data.success){
            if(data.obj && data.obj.orderformList && data.obj.orderformList.length>0){
                var orders = data.obj.orderformList;
                var htmlstr = "";
                for(var i=0;i<orders.length;i++){
                    var order=orders[i];
                    console.log(order);
                    var orderStatusText="未知状态";
                    var orderOperate="";
                    if(order.orderStatus=="0"){
                        orderStatusText="待确认";
                        orderOperate="";
                    }else if(order.orderStatus=="10"){
                        orderStatusText="卖家待签约";
                        orderOperate="<span class='layui-btn layui-btn-sm layui-btn-radius layui-btn-normal layui-btn-danger'  onclick='sign(&apos;"+order.orderNo+"&apos;)'>签订合同</span><br><span class='layui-btn layui-btn-sm layui-btn-radius layui-btn-normal up"+order.orderNo+"'  id='"+order.orderNo+"'>上传合同</span><br>";
                        uparray.push(order.orderNo);
                    }else if(order.orderStatus=="20"){
                        orderStatusText="买家待签约";
                        orderOperate="";
                    }else if(order.orderStatus=="30"){
                        orderStatusText="待生成对账单";
                        orderOperate="<span class='layui-btn layui-btn-sm layui-btn-radius layui-btn-danger' style='cursor:default' onclick='generateCheckorder(&apos;"+order.orderNo+"&apos;)'>生成对账单</span><br>";
                    }else if(order.orderStatus=="40"){
                        orderStatusText="待确认对账单";
                        orderOperate="<span class='layui-btn layui-btn-sm layui-btn-radius  layui-btn-danger'  onclick='editCheckorder(&apos;"+order.orderNo+"&apos;)'>修改对账单</span><br>"
                            +"<span class='layui-btn layui-btn-sm layui-btn-radius layui-btn-warm'  onclick='viewCheckorder(&apos;"+order.orderNo+"&apos;)'>查看对账单</span><br>";
                    }else if(order.orderStatus=="50"){
                        orderStatusText="买家待付款";
                        orderOperate="";
                    }else if(order.orderStatus=="60"){
                        orderStatusText="已付款待收款";
                        orderOperate="<span class='layui-btn layui-btn-sm layui-btn-radius  layui-btn-danger'  onclick='getMoney(&apos;"+order.orderNo+"&apos;)'>我要收款</span><br>";
                    }else if(order.orderStatus=="70"){
                        orderStatusText="已收款";
                        orderOperate="<span class='layui-btn layui-btn-sm layui-btn-radius layui-btn-danger'  onclick='generateCheckorder(&apos;"+order.orderNo+"&apos;)'>生成对账单</span><br>"
                            +"<span class='layui-btn layui-btn-sm layui-btn-radius layui-btn-normal'  onclick='finishOrder(&apos;"+order.orderNo+"&apos;)'>交易完成</span><br>";
                    }else if(order.orderStatus=="80"){
                        orderStatusText="交易完成";
//							orderOperate="<span class='layui-btn layui-btn-sm layui-btn-radius layui-btn-warm'  onclick='viewCheckorder(&apos;"+order.orderNo+"&apos;)'>查看对账单</span><br>";
                    }else if(order.orderStatus=="90"){
                        orderStatusText="已取消";
                        orderOperate="";
                    }
                    htmlstr=htmlstr+"<li>"+
                        "<div class='yzs-m-order-list-con1'>"
                        +"<div>"+ timestampToTime(order.addTime)+"</div>"
                        +"<div>订单编号："+order.orderNo+"</div>"
                        //								+"<div class='remark'> <a onclick='managerMargin(&apos;"+order.orderNo+"&apos;)'  href='javascript:void(0);'   class='layui-btn layui-btn-radius layui-btn-xs layui-btn-danger '>保证金管理<i class='layui-icon'>&#xe857;</i></a></div>"
                        +"</div>"
                        +"<div class='yzs-m-order-list-con2'>"
                        +"<div class='yzs-m-order-list-img'><img src='"+order.tenderGoods.url+"'></div>"
                        +"<div class='yzs-m-order-list-info'>"
                        +"<div>"+order.productName+"</div>"
                        +"<div style='font-size: 8px;'>买家公司:"+((undefined==order.buyer)?"":order.buyer.company)+"</div>"
                        +"</div>"
                        +"<div class='yzs-m-order-list-price'>¥"+order.price+"元</div>"
                        +"<div class='yzs-m-order-list-num'>"+order.amount+order.unit+"</div>"
                        +"<div class='yzs-m-order-list-price'><span>¥"+order.totalMoney+"元</span></div>"
                        +"<div class='yzs-m-order-list-price'><span class='colororange'>¥"+order.dealMoney+"元</span></div>"
                        +"<div class='yzs-m-order-list-status'>"
                        +"<span class='' style='font-size: 10px'>"+orderStatusText+"</span><br>"
                        +orderOperate
                        +"</div>"
                        +"<div class='yzs-m-order-list-opt'><a href='#' class=''><a target='_blank' href='/torderform/sellerordershow.html?param="+order.orderNo+"' class='layui-btn layui-btn-radius layui-btn-sm' >订单详情</a></div>"
                        +"</div>"
                        +"</li>"
                }
                $("#orders").html(htmlstr);
                //上传
                uploadContent();


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
    window.location.href="/torderform/sellerordershow.html?param="+orderno;
}

//签订合同
function sign(orderNo){

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
            if(data.msg=='000'){
                var jsondata={};
                jsondata.orderno=orderNo;
                addoderid(jsondata);
            }else{
                layer.msg(data.msg,{offset: 't',anim: 6});
            }
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


//添加编号
function   addoderid(jsondata){
    /*var index1=layer.prompt({title: '签订合同前需输入合同编号', formType: 2}, function(text, index){
        layer.close(index1);
        var idnex2=layer.confirm('您输入的合同编号为：'+text, {
              btn: ['确定','取消'] //按钮
            }, function(){
                layer.close(idnex2);
                jsondata.contentno=text;
                processContent(jsondata);
            }, function(){
                addoderid(jsondata);
            });
      });*/

    var reqdata={"aucid":jsondata.orderno};
    pairequest("/pai/tprocesstemplent/getTemplentparams.do",reqdata).then(function(data){

        console.log(data);
        if(data.success==true){
            var  html='<div class="memberCenterContent m-auth-form">';
            html+='<div class="zizhiMange">';
            html+='<div class="head">';
            html+='请填写合同资料';
            html+='<span class="colororange">(合同生成不可更改请确认后提交)</span>';
            html+='</div><table>';
            $.each(data.obj.list,function(index,info){
                var aa=(index+1)%2;
                console.log(aa);
                if((index+1)%2==1){
                    html+='<tr>';
                }
                var textv=data.obj[""+info.name];
                var styleadd="border-color:#009688;";
                if(textv==""||textv==undefined||(textv.indexOf("null")>0)||textv=='nullnullnullnull'){
                    textv="";
                    styleadd="border-color: red;"
                }

                html+='<td>';
                html+='<div class="layui-form-item">';
                html+='<label class="layui-form-label">'+info.authname+'</label>';
                html+='<div class="layui-input-block">';
                html+='<input  id="'+info.name+'" value="'+textv+'"type="text" name="'+info.name+'" lay-verify="title" autocomplete="off" placeholder="请输入'+info.authname+'" style="width:200px;'+styleadd+'" class="'+index+1+'  layui-input date">';
                html+='</div>';
                html+='</div>';
                if(info.name.indexOf("time")>0){
                    html+='<script type="text/javascript">laydate.render({elem: "#'+info.name+'"}); </script>';
                }
                html+='<script type="text/javascript">$(".'+index+1+'").blur(function(){if($(".'+index+1+'").val()!=""){$(".'+index+1+'").css("border-color","#009688");}});</script>';
                html+='</td>';
                if((index+1)%2==0){
                    html+='</tr>';
                }
            });
            html+='</table></div>';
            html+='</div> ';
            var  parama=layer.open({
                anim: 2,
                type: 1,
                title: "签订合同",
                shade: 0.1,
                scrollbar :true,
                skin: '', //没有背景色
                shadeClose: false,
                area: ['80%', '70%'],
                content: html,
                btn: ['生成合同', '关闭']
                ,yes: function(index, layero){
                    //按钮【按钮一】的回调
                    var isp=true;
                    $.each( $($(layero).find("input")),function(i,inf){
                        layer.msg($(inf).attr("name"),{offset: 't',anim: 6});
                        var name=$(inf).attr("name");
                        var placeholder=$(inf).attr("placeholder");
                        /* if("productAmount"!=name){
                             $(inf).val(name);
                         }else{
                             $(inf).val(123);
                         }*/
                        var valu=$(inf).val();
                        if(valu==null||valu==''){
                            isp=false;
                            layer.msg(placeholder,{offset: 't',anim: 6});
                            return false;
                        }else{
                            $(inf).attr("border-color","#009688");
                        }
                        jsondata[name]=valu;
                    });

                    if(isp){
//						 layer.close(parama);
                        processContent(jsondata);
                    }

                    return false ;
                }

                ,btn3: function(index, layero){
                    //关闭
                }
            });

        }else{
            layer.msg(data.msg,{offset: 't',anim: 6});
        }
    });
};


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
        title: '',
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

//生成对账单
function generateCheckorder(orderNo){
    layer.open({
        anim: 2,
        type: 2,
        title: false,
        shade: 0.1,
        scrollbar :true,
        area: ['80%', '70%'],
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: false,
        content: ['/torderform/checkorder/seller_checkorder_add.html?v='+new Date().getTime(), 'yes'],
        success:function(layero, index){
            var body = layer.getChildFrame('body', index);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            body.find('#orderNo').val(orderNo);
            iframeWin.getFormatDateStr();
            iframeWin.getInitData();
        }
    });
}


//管理保证金
function managerMargin(orderNo){
    layer.open({
        anim: 2,
        type: 2,
        title: false,
        shade: 0.1,
        scrollbar :true,
        area: ['80%', '70%'],
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: false,
        content: ['/margin/seller/buyermarginmanager.html?v='+new Date().getTime()+'&param='+orderNo, 'yes'],
        success:function(layero, index){

        }
    });
}

//修改对账单
function editCheckorder(orderNo){
    layer.open({
        anim: 2,
        type: 2,
        title: false,
        shade: 0.1,
        scrollbar :true,
        area: ['80%', '70%'],
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: false,
        content: ['/torderform/checkorder/seller_checkorder_edit.html?v='+new Date().getTime(), 'yes'],
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

//查看对账单
function viewCheckorder(orderNo){
    layer.open({
        anim: 2,
        type: 2,
        title: false,
        shade: 0.1,
        scrollbar :true,
        area: ['80%', '70%'],
        skin: 'layui-layer-nobg', //没有背景色
        shadeClose: false,
        content: ['/torderform/checkorder/seller_checkorder_view.html?v='+new Date().getTime(), 'yes'],
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

//收款
function getMoney(orderNo){
    //直接收款
    $.ajax({
        url:"/pai/torderform/checkorder/getMoney.do",
        type:"post",
        data:{
            'orderNo':orderNo
        },
        dataType:"json",
        success:function(data){
            if(data.success){
                layer.msg(data.msg,{offset: 't',anim: 6});
            }else{//直接收款
                layer.msg(data.msg,{offset: 't',anim: 6});
            }
            window.location.reload();
        },
        failure:function(data){
            layer.msg('请求失败',
                {
                    icon: 2,
                    time: 1500 //1秒关闭（如果不配置，默认是3秒）
                }, function(){
                    //do something
                });
        }
    });
}

//交易完成
function finishOrder(orderNo){
    var reqdata={'orderNo':orderNo};
    pairequest("/pai/torderform/finishOrder.do",reqdata).then(function(data){
        if(data.success==true){
            var obj = data.obj;
            if(obj && obj.code=="02"){
                layer.msg("交易完成",
                    {
                        icon: 1,
                        time: 1000 //1秒关闭（如果不配置，默认是3秒）
                    }
                )
                window.location.reload();
            }
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

/**
 * 上传合同回调
 * @param orderno
 * @param picurl
 * @param pageno
 * @returns
 */
function  uploadContentRefund(orderno,picurl,pageno){
    var reqdata={
        'orderno':orderno,
        'picurl':picurl
    };
    pairequest("/pai/auction/content/uploadContentRefund.do",reqdata).then(function(data){
        console.log(data);
        if(data.success==true){
            layer.msg(data.msg,{offset: 't',anim: 6});
            getOrderList(pageno,3);
        }else{
            layer.msg(data.msg,{offset: 't',anim: 6});
        }
    });
}

/**
 * 上传合同回调
 * @param orderno
 * @param picurl
 * @param pageno
 * @returns
 */
function uploadContent(){
    layui.use('upload', function(){
        var $ = layui.jquery,
            upload = layui.upload;
        for (var i = 1; i <= uparray.length; i++) {

            if(uparray[i]==0){
                return;
            }
            //普通图片上传
            var uploadInst = upload.render({
                elem: '.up'+uparray[i]
                ,url: '/pai/fileUpload/uploadFile.do'
                ,exts: 'zip|rar|7z'
                ,size:15000
                ,done: function(res){
                    //上传完毕回调
                    if(res.success==true){
                        var orderno=$(this.elem[0]).attr("id");
                        var picurl=res.obj.picurl;
                        var pageno=uparray[0];
                        uploadContentRefund(orderno,picurl,pageno)
                    }else{
                        layer.msg(res.msg,{offset: 't',anim: 6});
                    }

                }
                ,error: function(){
                    layer.msg(res.msg,{offset: 't',anim: 6});
                }
            });


        }


    });


}

