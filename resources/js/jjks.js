var index1
$(document).ready(function(){
    getSerachCataData();
    $("#footer_all").load('public/public_footer.html');
});


function getSerachCataData(){
    var reqdata={};
    pairequest("/pai/serach/catedata.do",reqdata).then(function(data){
        if(data.success==true){
            var html='';
            $.each(data.obj,function(index,info){
                html+='<dl>';
                html+='<dt >'+info.catename+'：</dt>';
                if(info.list.length<8){
                    html+='<dd>';
                }else{
                    html+='<dd style="width:1100px;">';

                }
                $.each(info.list,function(index1,info1){
                    html+='<span class="my'+info.mainid+'" t="' + index1+ '">'+info1.cname+'</span>';
                });
                html+='</dd>';
                html+='</dl>';
            });
            $(".filter").empty();
            $(".filter").append(html);
            serach();
            recommend();
            initpager();
        }else{

        }
    });

}


function  serach(){
    $(".my1").click(function(){
        location.href = '/jjks.html?t=' + $(this).attr('t');
        return;
        var text=$(this).text();
        var thisclass=$(this).attr("class");
        if(text=="全部"){
            if(thisclass.indexOf("allcheck")!=-1){
                $(".my1").removeClass("allcheck");
            }else{
                $(".my1").addClass("allcheck");
            }

        }else{
            if(thisclass.indexOf("allcheck")==-1){
                $(this).siblings().removeClass("allcheck");
            }
            $(this).toggleClass("allcheck");
        }
        initpager(0);
    });

    $(".my2").click(function(){
        var text=$(this).text();
        var thisclass=$(this).attr("class");
        if(text=="全部"){
            if(thisclass.indexOf("allcheck")!=-1){
                $(".my2").removeClass("allcheck");
            }else{
                $(".my2").addClass("allcheck");
            }

        }else{
            if(thisclass.indexOf("allcheck")==-1){
                $(this).siblings().removeClass("allcheck");
            }
            $(this).toggleClass("allcheck");
        }
        initpager(0);
    });

    $(".my3").click(function(){
        var text=$(this).text();
        var thisclass=$(this).attr("class");
        if(text=="全部"){
            if(thisclass.indexOf("allcheck")!=-1){
                $(".my3").removeClass("allcheck");
            }else{
                $(".my3").addClass("allcheck");
            }

        }else{
            if(thisclass.indexOf("allcheck")==-1){
                $(this).siblings().removeClass("allcheck");
            }
            $(this).toggleClass("allcheck");
        }
        initpager(0);
    });

    $(".my4").click(function(){
        var text=$(this).text();
        var thisclass=$(this).attr("class");
        if(text=="全部"){
            if(thisclass.indexOf("allcheck")!=-1){
                $(".my4").removeClass("allcheck");
            }else{
                $(".my4").addClass("allcheck");
            }

        }else{
            if(thisclass.indexOf("allcheck")==-1){
                $(this).siblings().removeClass("allcheck");
            }
            $(this).toggleClass("allcheck");
        }
        initpager(0);
    });
}

//pprice  stime    snum
$(document).ready(function(){
    $(".pprice").click(function(){
        $(".pprice").addClass("curr");
        $(".stime").removeClass("curr");
        $(".stime").attr("id",-1);
        $(".snum").removeClass("curr");
        $(".snum").attr("id",-1);
        if($(this).attr("id")==1){
            $(this).attr("id",0);
            $(this).find("em").removeClass("fs-up");
            $(this).find("em").addClass("fs-down");
        }else{
            $(this).attr("id",1);
            $(this).find("em").removeClass("fs-down");
            $(this).find("em").addClass("fs-up");
        }
        initpager(0);
    });

    $(".stime").click(function(){
        $(".stime").addClass("curr");
        $(".pprice").removeClass("curr");
        $(".pprice").attr("id",-1);
        $(".snum").removeClass("curr");
        $(".snum").attr("id",-1);
        if($(this).attr("id")==1){
            $(this).attr("id",0);
            $(this).find("em").removeClass("fs-up");
            $(this).find("em").addClass("fs-down");
        }else{
            $(this).attr("id",1);
            $(this).find("em").removeClass("fs-down");
            $(this).find("em").addClass("fs-up");
        }
        initpager(0);
    });

    $(".snum").click(function(){
        $(".snum").addClass("curr");
        $(".pprice").removeClass("curr");
        $(".pprice").attr("id",-1);
        $(".stime").removeClass("curr");
        $(".stime").attr("id",-1)
        if($(this).attr("id")==1){
            $(this).attr("id",0);
            $(this).find("em").removeClass("fs-up");
            $(this).find("em").addClass("fs-down");
        }else{
            $(this).attr("id",1);
            $(this).find("em").removeClass("fs-down");
            $(this).find("em").addClass("fs-up");
        }
        initpager(0);
    });
});


/**
 * 列表
 * @param pageNum
 * @returns
 */
function getauctionLists(pageNum){
    var pageSize=9;
    var company=getsParam("c");
    var key=getsParam("t");
    var cates=new Array();
    var areas=new Array();
    var sprices=new Array();
    var sernum=new Array();
    var pprice=$(".pprice").attr("id");
    var stime=$(".stime").attr("id");
    var snum=$(".snum").attr("id");

    $.each($(".my1"),function(index,info){
        if($(info).attr("class").indexOf("allcheck")>0){
            cates.push("'"+$(info).text()+"'");
        }
    });

    $.each($(".my2"),function(index,info){
        if($(info).attr("class").indexOf("allcheck")>0){
            sprices.push($(info).text());
        }
    });
    $.each($(".my3"),function(index,info){
        if($(info).attr("class").indexOf("allcheck")>0){
            sernum.push($(info).text());
        }

    });

    $.each($(".my4"),function(index,info){
        if($(info).attr("class").indexOf("allcheck")>0){
            areas.push("'"+$(info).text()+"'");
        }
    });
    pprice=$(".pprice").attr("id");
    stime=$(".stime").attr("id");
    snum=$(".snum").attr("id");




    var reqdata={
        "pageNo":pageNum+1,
        "pageSize":pageSize,
        "status":2,
        "company":company,
        "title":key,
        "catainfo":cates.join(","),
        "areainfo":areas.join(","),
        "sprice":sprices.join(","),
        "sernum":sernum.join(","),
        "pprice":pprice,
        "stime":stime,
        "snum":snum
    };
    var dataa = {
        '1': [
            '/product_img/石子.jpg', '/product_img/拆迁垃圾.jpg', '/product_img/渣土.jpg', '/product_img/装修垃圾3.jpg'
        ],
        '2': [
            '/product_img/石渣.jpg', '/product_img/渣土.jpg', '/product_img/拆迁垃圾.jpg', '/product_img/烧结砖.jpg'
        ],
        '3': [
            '/product_img/废钢2.jpg', '/product_img/机制砂1.jpg', '/product_img/风化砂1.jpg', '/product_img/石渣.jpg'
        ],
        '4': [
            '/product_img/家装4.jpg', '/product_img/家装超市3.jpg', '/product_img/家装超市_1.jpg', '/product_img/家装超市_2.jpg'
        ]
    }
    function getQueryString(name) {
        var reg = new RegExp("(/?|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.href.match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return '';
    }
    pairequest("/pai/auction/searchAuction.do",reqdata).then(function(data){
        $(".subSoon").empty();
        var result ='';
        if(data.total==0 || data.total == "0"){
            result+="<div class='feed_list_more' id='loadMore'><center><a href='javascript:void(0);'><img src='http://www.ezaisheng.cn/resources/img/nomore.jpg'></a></center></div>";
        }else{
            if(data.content != null){
                var pic = dataa[getQueryString('t')];

                var  auctionids=new Array();
                $.each(data.content, function(index, value) {
                    var name = null;
                    try{
                        var t = pic[index];
                        name = t.substring(t.lastIndexOf('/') + 1, t.lastIndexOf('.'));
                    } catch(e){}

                    console.error(t, getQueryString('t') );
                    auctionids.push("'"+value.id+"'");
                    var areaname="";
                    if(value.areaname==undefined){areaname="暂无信息"}else{areaname=value.areaname.split("@")[1]}
                    if(value.sprice<="0.001"){value.sprice="**"}
                    result += '<div  class="item '+value.id+'p" id="'+value.id+'">';
                    result+='<a href="/auction/sign.html?param='+value.id+'"  class="opennew" target="_blank" >';
                    result += '<div class="product">';
                    result += '<span class="ti">预告中</span>';
                    result += '<div class="img"><img src="'+pic[index]/*value.disagreeinfo*/+'" alt="" srcset=""></div>';
                    if(checkSign(value.endtime)){
                        result += '<div class="datetime '+value.id+'datetime"><i></i><span class="tim '+value.id+'">'+value.starttime.substring(0,19)+' <em>开始</em></span></div>';
                    }
                    result += '<div class="wrap">';
                    result += '<div class="nameAddress">';
                    result += '<div class="name">'+(name||value.title.substring(0,13))+'...</div>';
                    result += '<div class="address"><i class="el-icon-location"></i>'+ areaname +'</div>';
                    result += '</div>';
                    result += '<div class="info">';
                    result += '<div class="basePrice">起拍价：'+value.sprice+'元/'+value.unit+'</div>';
                    result += '<div class="num">数量：'+value.amount+value.unit+'</div>';
                    result += '</div>';
                    result += '</div>';
//                    result +='<img  disabled="disabled" style="display: none" src="/resources/img/home/end.png" alt="" srcset="" class="endicon  '+value.id+'img">';
                    result += '</div>';
                    result += '</div>';
                    result += '</a>';
                    result += '</div>';
                });
            }
            $(".auctionids").val(auctionids.join(","));
        }
        $(".subSoon").append(result);
    });

}
//检查报名时间是否小于当前时间
function checkSign(ot){
    var nowDate = new Date().getTime();
    var myDate = new Date(ot.replace(/-/g,"/").substring(0,19));
    if(ot != 'undefined'){
        if(nowDate < myDate ){
            return true;
        }
    }
};

function getsParam(type){
    var reg = new RegExp("(^|&)"+ type +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null){
        var base64 = new Base64();
        return base64.decode(unescape(r[2]));
    }else{
        return "";
    }
}
/**
 * 分页初始化
 * @returns
 */
function initpager(pageNo){
    var pageSize=9;
    var company=getsParam("c");
    var key=getsParam("t");
    var cates=new Array();
    var areas=new Array();
    var sprices=new Array();
    var sernum=new Array();
    var pprice=$(".pprice").attr("id");
    var stime=$(".stime").attr("id");
    var snum=$(".snum").attr("id");

    $.each($(".my1"),function(index,info){
        if($(info).attr("class").indexOf("allcheck")>0){
            cates.push("'"+$(info).text()+"'");
        }
    });

    $.each($(".my2"),function(index,info){
        if($(info).attr("class").indexOf("allcheck")>0){
            sprices.push($(info).text());
        }
    });
    $.each($(".my3"),function(index,info){
        if($(info).attr("class").indexOf("allcheck")>0){
            sernum.push($(info).text());
        }
    });

    $.each($(".my4"),function(index,info){
        if($(info).attr("class").indexOf("allcheck")>0){
            areas.push("'"+$(info).text()+"'");
        }
    });
    pprice=$(".pprice").attr("id");
    stime=$(".stime").attr("id");
    snum=$(".snum").attr("id");


    //加载竞价列表
    var reqdata={
        "pageNo":pageNo,
        "pageSize":pageSize,
        "status":2,
        "company":company,
        "title":key,
        "catainfo":cates.join(","),
        "areainfo":areas.join(","),
        "sprice":sprices.join(","),
        "sernum":sernum.join(","),
        "pprice":pprice,
        "stime":stime,
        "snum":snum
    };
    pairequest("/pai/auction/searchAuction.do",reqdata).then(function(data){
        $(".subSoon").empty();
        var result ='';
        if(data.total==0 || data.total == "0"){
            layui.use(['laypage', 'layer'], function(){
                var laypage = layui.laypage
                    ,layer = layui.layer;
                laypage.render({
                    elem: 'demo3'
                    ,limit: 9
                    ,count: data.total
                    ,layout: ['count', 'prev', 'page', 'next', 'skip']
                    ,jump: function(obj){
                        getauctionLists(obj.curr-1);
                    }
                });
            });
        }else{
            if(data.content != null){
                layui.use(['laypage', 'layer'], function(){
                    var laypage = layui.laypage
                        ,layer = layui.layer;
                    laypage.render({
                        elem: 'demo3'
                        ,limit: 9
                        ,count: data.total
                        ,layout: ['count', 'prev', 'page', 'next', 'skip']
                        ,jump: function(obj){
                            getauctionLists(obj.curr-1);
                        }
                    });
                });

            }
        }

    });

}




//加载特别推荐
function  recommend(){
    var reqdata={};
    pairequest("/pai/auction/recommend.do",reqdata).then(function(data){

        $(".eitems").empty();
        var obj = data.obj;
        var html="";

        for(var i = 0; i<obj.length ;i++){
            var nprice = "**";
            if(obj[i].nprice > 0){
                nprice = obj[i].nprice;
            }

            html+='<div class="eitem">'
                +'<div class="eimg">'
                +'<img src="'+obj[i].disagreeinfo+'" alt="">'
                +'</div>'
                +'<div class="ename">'+obj[i].title+'</div>'
                +'<div class="eprice">当前价：<em>￥'+nprice+'元</em> </div>'
                +'<a href="/auction/sign.html?param='+obj[i].id+'"  class="opennew" target="_blank" ><div class="evinfo">查看详情&gt;</div></a>'
                +'</div>';


        }
        $(".eitems").html(html);
    });
}


