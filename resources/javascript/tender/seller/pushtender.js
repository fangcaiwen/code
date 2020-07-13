
$(document).ready(function(e) {
    $("#header_all").load('/public/public_header.html');
    $(".memberCenterNav").load('/public/tiframeleft.html');
    checkLogin();
    authparams();
});

$(document).ready(function(){
    var pprovice="";
    var pcity="";
    var parea="";
    if(pprovice!=""&& pcity!=""){
        addressInit('cmbProvince', 'cmbCity', 'cmbArea', pprovice, pcity, parea);
    }else{
        addressInit('cmbProvince', 'cmbCity', 'cmbArea', pprovice, pcity, parea);
    }
});

//检查登录状态
function checkLogin(){
    var reqdata={};
    pairequest("/pai/userPro/checkLoginStatus.do",reqdata).then(function(data){
        var header = "";
        if(data.success==true){
            pushTenderInit();
        }else{
            window.location.href="/user/login.html";
        }
        $(".header_newe").html(header);
    });

};

//检查登录状态
function pushTenderInit(){
    var reqdata={};
    pairequest("/pai/tender/pushTenderInit.do",reqdata).then(function(data){
        if(data.success==true){
            pushtendersupport();//
            pushTenderDataInit(data);//缓存基础数据展示
        }else{
            layer.msg(data.msg);
        }

    });

};
//发布采购竞价数据准备
function pushTenderDataInit(data){
    if(undefined==data.obj.tender||null==data.obj.tender){
        //数据支撑回显事件
        cpi++;
        dataroBackUi();
        return;
    }
    var tender=data.obj.tender;//采购竞价信息
    var glist=(undefined==data.obj.gList)?[]:data.obj.gList;//采购竞价产品
    var qList=(undefined==data.obj.qList)?[]:data.obj.qList;//资质列表
    var mList=(undefined==data.obj.mList)?[]:data.obj.mList; //评标人
    var msize=(undefined==data.obj.msize)?0:data.obj.msize; //评标人数量
    var aList=(undefined==data.obj.aList)?[]:data.obj.aList;//附件列表
    var asize=(undefined==data.obj.asize)?0:data.obj.asize;//附件
    var blist=(undefined==data.obj.bList)?[]:data.obj.bList;//黑名单
    var userid=(undefined==data.obj.tender.userid)?0:data.obj.tender.userid;
    var areaname=(undefined==data.obj.tender.areaname)?0:data.obj.tender.areaname;


    if(areaname!=undefined&&areaname!=""){
        $(".tenderInfoareaname").val(areaname);
        var areaname=areaname.split("@");
        addressInit('cmbProvince', 'cmbCity', 'cmbArea', areaname[0], areaname[1], areaname[2]);
        $("#input-addr").val(areaname[3]);
    }else{
        addressInit('cmbProvince', 'cmbCity', 'cmbArea', "", "", "");
    }


    $("input[name='tenderInfo.tid']").val(tender.tid);
    $("input[name='tenderInfo.tname']").val(tender.tname);
    $("input[name='tenderInfo.participate']").val(tender.participate);
    $("input[name='tenderInfo.margin']").val(glist[0].count);

    $("input[name='tenderInfo.contacter']").val(tender.contacter);
    $("input[name='tenderInfo.contacttel']").val(tender.contacttel);
    $("input[name='tenderInfo.assetunit']").val(tender.assetunit);
    $("input[name='tenderInfo.lookstarttime']").val(tender.lookstarttime);
    $("input[name='tenderInfo.lookendtime']").val(tender.lookendtime);
    $("input[name='tenderInfo.pactstarttime']").val(tender.pactstarttime);
    $("input[name='tenderInfo.pactendtime']").val(tender.pactendtime);
    /*富文本*/
    $("input[name='tenderInfo.content']").val(tender.content);
    $("#tendercontent").val(tender.content);
    $("input[name='tenderInfo.opentendertime']").val(tender.opentendertime.substring(0,19));
    $("#isqualication").val(tender.isqualication);

    $("input[name='tenderInfo.basepricename']").val(tender.basepricename);
    $("input[name='tenderInfo.basepricemail']").val(tender.basepricemail);
    $("input[name='tenderInfo.tel']").val(tender.tel);
    $("input[name='tender.opentendertime']").val(tender.opentendertime);

    $("#gLength").val(glist.length);
    //分类筛选
    if(undefined!=tender.cataname||null!=tender.cataname){
        addCertName(tender.cataname,qList);
    }
    //附件是否付费
    var asize =asize;
    var ischarge = tender.ischarge;

    //不收费
    if(ischarge==0){
        $("#fee").hide();
    }else {
        //收费
        $("#fee").show();
    }

    html='<tr><th>产品名称</th><th>数量</th><th>单位</th><th>描述</th><th>图片</th><th>资产采购单位</th></tr>';
    html+='<input type="hidden" value="'+glist.length+'" id="gLength" />';
    $.each(glist,function(index,info){
        html+='<tr id="'+info.goodsid+'">';
        html+='<input type="hidden"  value="'+info.goodsid +'" name="goods['+index+'].goodsid" />';
        html+='<td><input  type="text" id="goodsgoodsname'+index+'" value="'+info.goodsname+'" class="w80" name="goods['+index+'].goodsname" ></td>';
        html+='<td><input  type="text" value="'+info.amount +'" class="w150" name="goods['+index+'].amount"  onkeyup="this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[\'\'])[0]"></td>';
        html+='<td><input  type="text" value="'+info.unit +'" class="w150" name="goods['+index+'].unit" ></td>';
        html+='<td><input  type="text" value="'+info.description+'" class="w80" name="goods['+index+'].description" placeholder="如:数量1000-1500个，材质全新HDPE、容积120L墨绿色，一次成型无焊接，实心轮轴，承重100公斤以上，要求符合CJ/T280-2008行业标准" ></td>';
        html+='<td><input  type="hidden" value="'+info.url +'" class="w150" name="goods['+index+'].url" id="img'+index+'" ></input><input type="button" id="pic'+index+'" class="layui-btn layui-btn-xs layui-btn-danger  layui-btn-radius w150 " value="上传" ></input>&nbsp;<input type="button" onclick="diagnose(this)" class="layui-btn layui-btn-xs  layui-btn-radius w150" value="查看" ><div class="scan hide"> <img src="'+info.url+'" width="500" height="500" id="pre'+index+'"/></div></td>';
        html+='<td>';
        html+='<span class="projectcom'+index+'"  style="cursor: pointer;" id="'+index+'" >'+((info.company==undefined||info.company=="")?"未选择":info.company)+'</span>';
        html+='<input type="hidden" value="'+info.company+'" placeholder=""   class="w150" name="goods['+index+'].company"  ></input>';
        html+='<input type="hidden" value="'+info.areaname+'" class="w150" name="goods['+index+'].areaname"  ></input>';
        html+='<input type="hidden" value="'+info.count+'" class="w150" name="goods['+index+'].count"  ></input>';
        html+='</td>';
        if(index!=0){
            html+='<td><input class="layui-btn layui-btn-xs layui-btn-danger  layui-btn-radius w150 " type="button" name="operate" value="删除" onclick="delGoods('+info.goodsid+')"  onkeyup="this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[\'\'])[0]"></td>';
        }
        html+='</tr>';



    })
    if(html!=''){
        $("#zhaobiaochanpin").empty();
        $("#zhaobiaochanpin").append(html);
    }
    //回显上传
    $.each(glist,function(index,info){
        g_AjxUploadFile(index);
        projectcom(index);
        goods_serach(index);
        desadd(index);
        desaddmouseoverp(index);
        projectcommouseoverp(index);
        goods_serachmouseoverp(index);
    });

    html="";
    if(tender.paymethod==0){
        html+='<input  type="radio" value="1" name="tenderInfo.paymethod">全款支付';
        html+='<input  type="radio" value="0" name="tenderInfo.paymethod" checked="checked">分期付款<br/>';
    }else{
        html+='<input  type="radio" value="1" name="tenderInfo.paymethod" checked="checked">全款支付';
        html+='<input  type="radio" value="0" name="tenderInfo.paymethod" >分期付款<br/>';
    }
    if(html!=''){
        $(".tenderInfopaymethod").empty();
        $(".tenderInfopaymethod").append(html);
    }

    //下载附件是否收费
    html="";
    if(undefined==tender.ischarge||tender.ischarge==null){
        html+='<input  type="radio" value="0" name="tenderInfo.ischarge" checked="checked">否';
        html+='<input  type="radio" value="1" name="tenderInfo.ischarge">是';
        html+='<input type="text" id="fee" name="tenderInfo.fee" value="'+((undefined==tender.fee?0:tender.fee))+'" placeholder="请输入金额"  onkeyup="this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[\'\'])[0]" style="width:100px;"/>';
    }else{
        if(tender.ischarge==0){
            html+='<input  type="radio" value="0" name="tenderInfo.ischarge" checked="checked">否';
            html+='<input  type="radio" value="1" name="tenderInfo.ischarge">是';
            html+='<input type="text" id="fee" name="tenderInfo.fee" value="'+((undefined==tender.fee?0:tender.fee))+'" placeholder="请输入金额"  onkeyup="this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[\'\'])[0]" style="width:100px;"/>';
        }else{
            html+='<input  type="radio" value="0" name="tenderInfo.ischarge" >否';
            html+='<input  type="radio" value="1" name="tenderInfo.ischarge" checked="checked">是';
            html+='<input type="text" id="fee" name="tenderInfo.fee" value="'+((undefined==tender.fee?0:tender.fee))+'" placeholder="请输入金额"  onkeyup="this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[\'\'])[0]" style="width:100px;"/>';
        }
    }
    if(html!=''){
        $(".tenderischarge").empty();
        $(".tenderischarge").append(html);
    }


    html="";
    if(tender.ischarge==1){
        html+='<input type="hidden" value="'+aList.length+'" id="aLength" />';
        $.each(aList,function(index,info){
            html+='<div class="" id="a'+info.id+'">';
            html+='<div style="padding-left:180px" >附件:<input  type="hidden" name="annexs['+index+'].id" ';
            html+='value="'+info.id+'">';
            html+='<input type="hidden" name="annexs['+index+'].filename" id="filename'+index+'"';
            html+='	value="'+info.filename+'"><input  type="text" id="filethumb'+index+'" ';
            html+='		name="annexs['+index+'].filethumb" value="'+info.filethumb+'" >';
            html+='	<input type="button" value="上传" class="layui-btn layui-btn-sm layui-btn-radius layui-btn-xs" id="annex'+index+'" /></input>';
            html+='	</div>';
            html+='</div>';
        })

        if(html!=''){
            $("#annexFile").empty();
            $("#annexFile").append(html);
            $("#annexFile").show();
        }

    }else

    if(tender.ischarge==0){
        html+='<input type="hidden" value="'+aList.length+'" id="aLength" />';
        $.each(aList,function(index,info){
            html+='<div class="" id="a'+info.id+'">';
            html+='<div style="padding-left:180px" >附件:<input  type="hidden" name="annexs['+index+'].id" value="'+info.id+'"><input type="hidden" name="annexs['+(index+1)+'].filename" id="filename'+(index+1)+'" value="'+info.filename+'"><input  type="text" id="filethumb'+index+'" name="annexs['+index+1+'].filethumb" value="'+info.filethumb+'"  ><input type="button" value="上传" class="layui-btn layui-btn-sm layui-btn-radius " id="annex'+index+1+'" />';
            html+='	<input type="button" value="删除" onclick="delAnnex('+info.id+')" class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger"></input>';
            html+='</div>';
            html+='</div>';
        })
        if(html!=''){
            $("#annexFileNoPay").empty();
            $("#annexFileNoPay").append(html);
            $("#annexFileNoPay").show();
        }
    }else{
        if(null== aList){
            html+='<div style="padding-left:180px" >附件:<input type="hidden" name="annexs[0].filename" id="filename0"><input  type="text" id="filethumb0" name="annexs[0].filethumb" value="" ><input type="button" value="上传" class="layui-btn layui-btn-sm layui-btn-radius layui-btn-xs" id="annex0" /><input type="button" class="layui-btn layui-btn-xs layui-btn-danger  layui-btn-radius" name="aopertor" value="删除"></div>';
        }
    }

    for (var i = 0; i < aList.length+1; i++) {
        annexUpload(i);
    }


    html="";
    html+='<input type="hidden" value="'+mList.length+'" id="mLength" />';
    $.each(aList,function(index,info){
        html+='	<div class="" id="'+info.mid+'">';
        html+='<input  type="hidden" name="monitors['+index+'].mid" value="'+info.mid+'"></input><input  type="text" id="jbname'+index+'" name="monitors['+index+'].mname" value="'+info.mname+'" placeholder="姓名" class="w80" > </input><input  type="text" id="jbmail'+index+'" name="monitors['+index+'].mmail" value="'+info.mmail+'" placeholder="输入评标人邮箱" style="width:200px;"> <input  type="text" id="phone'+index+'" name="monitors['+index+'].phone" value="'+info.phone+'" placeholder="输入评标人电话" style="width:150px;">';
        if(index==0){
            html+='<input type="button" value="删除" onclick="delMon('+info.mid +')"></input>';
        }
        html+='</div>';
    });
    if(undefined==mList||null==mList){
        html+='	<div>';
        html+='	<input  type="hidden" name="monitors[0].mid" value=""><input  type="text" id="jbname0" name="monitors[0].mname" value="" placeholder="姓名" class="w80" > <input  type="text" id="jbmail0" name="monitors[0].mmail" value="" placeholder="输入评标人邮箱" style="width:200px;"> <input  type="text" id="phone0" name="monitors[0].phone" value="" placeholder="输入评标人电话" style="width:150px;">';
        html+='	</div>';
    }
    if(""!=html){
        $("#jianbiaoren").empty();
        $("#jianbiaoren").append(html);
    }

    /*黑名单*/
    html="";
    $.each(blist,function(index,info){
        html+='<div class="heimingdan">';
        html+='<input type="hidden" name="memberIds" value="'+info.membername+'"></input><span>'+info.membername+'</span> <a  class="close" href="javascript:;">×</a>';
        html+='</div>';
    })

    if(""!=html){
        $("#heimingdan").empty();
        $("#heimingdan").append(html);
    }
    //数据支撑回显
    dataroBackUi();
}

/**
 * 绑定事件相关
 * @param data
 * @returns
 */
var cpi=0;

//数据展示3脚架
function  pushtendersupport(){
    //默认分类加载
    catadatashow();
    //黑名单 资质要求事件绑定
    commonbind();
    goodsbind();
    //商品参数选择
    goodsparamch();
    //评标
    pingbiao();
    //勾选协议
    tenderaggree();
    //时间选择
//
//	 tenderData();
    //保存采购竞价信息
    tenderchache();
}



//加载默认分类
function catadatashow(){
    //加载一级分类
    var reqdata={};
    pairequest("/pai/auction/getFirstCategory.do",reqdata).then(function(data){
        var categoryOne = data.obj;
        var categoryOneHtml = "";
        for(var i = 0 ; i<categoryOne.length;i++){
            categoryOneHtml += '<option value='+categoryOne[i].cid+'>'+categoryOne[i].catname+'</option>';
        }
        $("#fcategory").html(categoryOneHtml);

        var pid = $('#fcategory').val();
        if (pid == 16){
            $("#scategory").hide();
            $('#zizhi_txt').val('');
        }else {
            var reqdata={"parentid":pid};
            pairequest("/pai/auction/getSecondCategory.do",reqdata).then(function(data){
                var categoryTwo = data.obj;
                var categoryTwoHtml = "";
                var certname = "";
                for(var i = 0 ; i<categoryTwo.length;i++){
                    categoryTwoHtml += '<option value='+categoryTwo[i].certname+'>'+categoryTwo[i].catname+'</option>';
                }
                var  html=categoryTwo[0].certname;
                if(html!=''&&html!=undefined){
                    html=html.split("@");
                }
                $("#active-zizhi").empty();

                $.each(html,function(index,info){
                    $("#active-zizhi").append('<div class="active-zizhi"> <span name = "qualification">'+info+'</span> <a  class="closezz" href="javascript:;">×</a></div>');
                });
                $("#scategory").html(categoryTwoHtml);
                //分类
                $(".tenderInfocataname").val("");
                $(".tenderInfocataname").val($("#fcategory").find("option:selected").text()+"@"+$("#scategory").find("option:selected").text());

            });
        }

    });
}

//事件回显 美化
function  dataroBackUi(){
    //添加采购竞价产品
    if(undefined!=$("#gLength").val()&&null!=$("#gLength").val()&&''!=$("#gLength").val()){
        cpi = $("#gLength").val()-1;
    }else {
        cpi = 0;
        g_AjxUploadFile(cpi)
    }
    //是否评标回显
    var participate=$("#participate").val();
    if(participate !=null){
        if(participate == "0"){
            $("#join1").attr("checked",'checked');
            $("#join2").attr("checked",'checked');
            $("#join3").attr("checked",'checked');
        }else if(participate == "1"){
            $("#join1").attr("checked",'checked');
            $("#join2").attr("checked",'checked');
        }else if(participate == "2"){
            $("#join1").attr("checked",'checked');
            $("#join3").attr("checked",'checked');
        }else if(participate == "3"){
            $("#join2").attr("checked",'checked');
            $("#join3").attr("checked",'checked');
        }else if(participate == "4"){
            $("#join2").attr("checked",'checked');
        }else if(participate == "5"){
            $("#join3").attr("checked",'checked');
        }else {
            $("#join1").attr("checked",'checked');
        }
    }
    //资质要求回显
    var isqualication = $("#isqualication").val();
    if(isqualication == 'false'){
        $('.zizhiinput').hide();
        $("#zizhiCategory").hide();
        $("#active-zizhi").hide();
        $("#no").attr("checked",'checked');
    }else{
        $("#yes").attr("checked",'checked');
        $("#zizhiCategory").show();
    }


    /*富文本*/
    layui.use('layedit', function(){
        var layedit = layui.layedit;
        layedit.set({
            uploadImage: {
                url: '/pai/fileUpload/uploadFile.do' //接口url
                ,type: 'post' //默认post
            }
        });
        layedit.build('tendercontent'); //建立编辑器
    });

    /*富文本*/

    //添加评标人
    if($("#mLength").val() !=null ){
        var jbi = $("#mLength").val()-1;
    }else {
        var jbi = 1;
    }
    if(jbi == "-1"){
        jbi = 0;
    }
    $("#add_jianbiaoren").click(function(){
        jbi++;
        $("#jianbiaoren div:last").after('<div> <input  id="jbname'+jbi+'" name="monitors['+jbi+'].mname" type="text" value="" placeholder="姓名" class="w80"> <input  type="text" id="jbmail'+jbi+'" name="monitors['+jbi+'].mmail" value="" placeholder="输入评标人邮箱" style="width:200px;"> <input  type="text" id="phone'+jbi+'" name="monitors['+jbi+'].phone" value="" placeholder="输入评标人电话" style="width:150px;"> <input type="button" name="mopertor" value="删除"></input> </div>');
    });


    //附件添加
    if($("#aLength").val() !=undefined &&$("#aLength").val() !=null && $("#aLength").val()!=""){
        var aai = $("#aLength").val();
    }else {
        var aai = 1;
    }
    if(aai == "-1"){
        aai = 1;
    }
    $("#add_annex").click(function(){
        aai++;
        $("#annexFileNoPay").append('<div style="padding-left:180px" >附件:<input type="hidden" name="annexs['+aai+'].filename" id="filename'+aai+'" ><input   type="text" id="filethumb'+aai+'" name="annexs['+aai+'].filethumb" value="" ><input type="button" value="上传" class="layui-btn layui-btn-sm layui-btn-radius layui-btn-xs" id="annex'+aai+'" /><input type="button" class="layui-btn layui-btn-xs layui-btn-danger  layui-btn-radius" name="aopertor" value="删除"></div>');
        annexUpload(aai);
    });




}

//黑名单 资质要求事件绑定
function  commonbind(){
    $("#add_zizhiyaoqiu").click(function(){
        $("#zizhiyaoqiu div:last").after(
            '<div class="m10"> <input  type="text" value="" placeholder="" class="w150" name="qualification" > </div>');
    });

    $("#active-hmd").on("click",".close",function(){
        $(this).parent().remove();
    });

    $("#radio-zizhi #no").click(function(){
        $("#active-zizhi").empty();

        var flag = true;
        $("span[name=qualification]").each(function(){
            if($(this).html() == "委托授权书" ){
                flag = false;
            }
        });
        if(flag){
            $('.zizhiinput').hide();
            $("#zizhiCategory").hide();
        }else {
            $("#yes").attr("checked","checked");
            $("#no").attr("disabled", false);
        }

    });
    $("#radio-zizhi #yes").click(function(){
        getSecondCategory();
        $("#active-zizhi").show();
        $('.zizhiinput').show();
        $("#zizhiCategory").show();

    });
    $("#add-active-zizhi").click(function(){
        var zizhi_txt = $("#zizhi_txt").val();
        console.info(zizhi_txt);
        if(zizhi_txt){
            var flag = true;

            $("span[name=qualification]").each(function(){
                if($(this).html() == zizhi_txt){
                    flag = false;
                }
            });

            if(flag){
                $("#active-zizhi").append('<div class="active-zizhi"> <span name="qualification">'+zizhi_txt+'</span> <a  class="closezz" href="javascript:;">×</a></div>');
                $("#zizhi_txt").val('');

            }else {
                layer.msg('已经添加过,请重新添加',{offset: 't',anim: 6});
            }

        }else{
            layer.msg('请正确输入资质要求',{offset: 't',anim: 6});
        }

    });
    $("#clear-active-zizhi").click(function(){
        $("#zizhi_txt").val('');
    });

    $("#active-zizhi").on("click",".closezz",function(){
        $(this).parent().remove();
    });

    // 资质要求
    $(".m-input input[name=join]").click(function(){
        if($("#join2").is(":checked")){
            $("#yes").attr("checked",'checked');
            $("#no").attr("disabled", true);
            if (!($("#ex_only").length > 0)){
                var flag = true;
                $("span[name=qualification]").each(function(){
                    if($(this).html() == "委托授权书" ){
                        flag = false;
                    }
                });
                if(flag){
                    $("#active-zizhi").prepend('<div class="active-zizhi" id="ex_only"> <span name="qualification">委托授权书</span> </div>');}
            }
            if (($("#ex_only .closezz").length > 0)){$("#ex_only .closezz").remove();}
            $('.zizhiinput').show();
            $('#zizhiCategory').show();
        }else{
            $("#no").attr("disabled", false);
            if (!($("#ex_only .closezz").length > 0)){$("#ex_only").append('<a  class="closezz" href="javascript:;">×</a> ');
            }
        }
    });


    // 黑名单
    $("#add-active-hmd").click(function(){
        var hmd_txt = $("#hmd_txt").val();
        if(hmd_txt){
            $("#heimingdan").append('<div class="heimingdan"> <input type="hidden" name="memberIds" value="'+hmd_txt+'"></input><span>'+hmd_txt+'</span> <a  class="close" href="javascript:;">×</a></div>');
            $("#hmd_txt").val('');
        }else{
            layer.msg('请正确输入黑名单企业',{offset: 't',anim: 6});
        }
    });
}


//TODO 绑定事件
//商品图片查看
function goodsbind(){
    //商品添加
    $("#add_zhaobiaochanpin").click(function(){
        cpi++;
        var html='';
        html+='<tr>';
        html+='<td>';
        html+='<input  type="text" value="" id="goodsgoodsname'+cpi+'" name="goods['+cpi+'].goodsname" class="w80">';
        html+='</td>';
        html+='<td>';
        html+='<input  onkeyup="this.value=(this.value.match(/\\d+(\\.\\d{0,2})?/)||[\'\'])[0]" type="text" name="goods['+cpi+'].amount" value="" class="w150"/>';
        html+='</td>';
        html+='<td><input  type="text" name="goods['+cpi+'].unit" value="" class="w150">';
        html+='</td> ';
        html+='<td>';
        html+='<input  type="text" placeholder="如:数量1000-1500个，材质全新HDPE、容积120L墨绿色，一次成型无焊接，实心轮轴，承重100公斤以上，要求符合CJ/T280-2008行业标准" name="goods['+cpi+'].description" value="" class="w80">';
        html+='</td> ';
        html+='<td>';
        html+='<input  type="hidden" value=""  class="w150" name="goods['+cpi+'].url" id="img'+cpi+'" placeholder="上传500*500px图片" readonly="readonly" >';
        html+='<input type="button" class="layui-btn layui-btn-xs layui-btn-danger  layui-btn-radius w150 " id="pic'+cpi+'" value="上传"></input>&nbsp;';
        html+='<input type="button" name="preview" class="layui-btn layui-btn-xs  layui-btn-radius w150" value="查看" >';
        html+='<div class="scan hide">';
        html+='<img src="" width="500" height="500" id="pre'+cpi+'"/>';
        html+='</div>';
        html+='</td>';
        html+='<td>';
        html+='<span class="projectcom'+cpi+'" id="'+cpi+'" style="cursor: pointer;">未选择</span>';
        html+='<input type="hidden" value="" placeholder=""   class="w150" name="goods['+cpi+'].company"  ></input>';
        html+='<input type="hidden" value="" class="w150" name="goods['+cpi+'].areaname"  ></input>';
        html+='<input type="hidden" value="" class="w150" name="goods['+cpi+'].count"  ></input>';
        html+='</td>';
        html+='<td>';
        html+='<input class="layui-btn layui-btn-xs layui-btn-danger  layui-btn-radius w150 "  type="button" name="operate" value="删除" >';
        html+='</td>';
        html+='</tr>';
        $("#zhaobiaochanpin tr:last").after(html);
        g_AjxUploadFile(cpi);
        projectcom(cpi);
        goods_serach(cpi);
        desadd(cpi);
        desaddmouseoverp(cpi);
        projectcommouseoverp(cpi);
        goods_serachmouseoverp(cpi);
    });
    //商品图片查看
    $("input[name='preview']").live("click",function(){
        diagnose(this);
    });
}
//商品参数选择
function  goodsparamch(){
    $("input[name='operate']").live("click",function(){
        $(this).parent().parent().empty();
    }) ;

    $("input[name='mopertor']").live("click",function(){
        $(this).parent().empty();
    }) ;

    $("input[name='aopertor']").live("click",function(){
        $(this).parent().empty();
    }) ;

    $("input[name='tenderInfo.type']").live("click",function(){
        var tt = $("input[name='tenderInfo.type']:checked").val();
        var flag = $(this).val();
        if(tt == 0 ){
            $("#bidd1").attr("checked","checked");
            /* var mhtml ='<div><input type="hidden" name="monitors[0].mid" value=""><input  type="text" id="jbname0" name="monitors[0].mname" value="" placeholder="姓名" class="w80" > <input  type="text" id="jbmail0" name="monitors[0].mmail" value="" placeholder="输入评标人邮箱" style="width:200px;"> <input  type="text" id="phone0" name="monitors[0].phone" value="" placeholder="输入评标人电话" style="width:150px;"></div>';
               $("#jianbiaoren").html(mhtml); */
            $("#jianbiaoren").show();
            $("#bidd").show();
            $("#add_zhaobiaochanpin").hide();
        }else {
            $("#add_zhaobiaochanpin").show();
        }
    }) ;
}
//评标
function pingbiao(){
    $("input[name='tenderInfo.bidd']").live("click",function(){
        var tt = $("input[name='tenderInfo.type']:checked").val();
        var flag = $(this).val();
        if(tt == 1 ){

            if(flag == "0"){
                $("#bidd").hide();
                $("#jianbiaoren").hide();
            }else {
                var mhtml ='<div><input type="hidden" name="monitors[0].mid" value=""><input  type="text" id="jbname0" name="monitors[0].mname" value="" placeholder="姓名" class="w80" > <input  type="text" id="jbmail0" name="monitors[0].mmail" value="" placeholder="输入评标人邮箱" style="width:200px;"> <input  type="text" id="phone0" name="monitors[0].phone" value="" placeholder="输入评标人电话" style="width:150px;"></div>';
                if($("#jianbiaoren").html() == ""){
                    $("#jianbiaoren").html(mhtml);
                }
                $("#jianbiaoren").show();
                $("#bidd").show();
            }
        }else {
            $("#bidd1").attr("checked","checked");
        }
    }) ;

    $("input[name='tenderInfo.ischarge']").live("click",function(){
        var flag = $(this).val();
        if(flag == "1"){
//			$("#annexFile").show();
//			$("#annexFileNoPay").hide();
//			$("#add_annex").show();
            $("#fee").show();
        }else {
//			$("#annexFile").hide();
//			$("#annexFileNoPay").show();
//			$("#add_annex").show();
            $("#fee").hide();
        }
    });
}
//勾选协议
function tenderaggree(){
    $("#greet").live("click",function(){
        if ($('#greet').attr('checked')) {
            $('#release').removeClass("layui-btn-disabled");
            $("#release").attr('disabled',false);
        }else{
            $("#release").attr('disabled',true);
            $('#release').addClass("layui-btn-disabled");
        }
    }) ;
}


//保存采购竞价信息
function  tenderchache(){
    $(".buon_relfo").on("click",function(){
        var ids="";
        //获得参与要求的值
        $(".m-input input[name=join]").each(function(){
            if($(this).attr('checked') == 'checked' ){
                ids += $(this).attr('value');
            }
        });
        if(ids.length == 3){
            $('#participate').val(0);
        }else if(ids.length == 2){
            if(ids == '64'){
                $('#participate').val(1);
            }else if(ids == '65'){
                $('#participate').val(2);
            }else {
                $('#participate').val(3);
            }
        }else {
            $('#participate').val(ids[0]);
        }

        //获取资质证书
        var qualificationHTML = "";
        $("span[name=qualification]").each(function(){
            qualificationHTML +=$(this).html()+","
        });
        var isqualication=$("input[name='tenderInfo.isqualication']:checked").val();
        if(isqualication==1){
            $('#qualification').val(qualificationHTML);
        }


        var tname = $("#tname").val();//采购竞价名称
        var margin=$("#margin").val();//保证金

        var opentendertime=$("#tenderopentime").val();//开标时间
        var baseMail =$("input[name='tenderInfo.basepricemail']").val();//标底邮箱
        var baseName =$("input[name='tenderInfo.basepricename']").val();//标底姓名
        var basePhone =$("input[name='tenderInfo.tel']").val();//标底电话
        var monitorName =$("input[name='monitors[0].mname']").val();
        var monitorMail =$("input[name='monitors[0].mmail']").val();

        var qualification = $('#qualification').val();
        var participate=$("#participate").val();//参加要求



        var isBidd = $("input[name='tenderInfo.bidd']:checked").val();
        var isCharge = $("input[name='tenderInfo.ischarge']:checked").val();
        //var thumb = $('#thumb').val();
        if(isBidd == "0"){
            $("#jianbiaoren").html("");
        }

        //邮箱验证
        var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        //验证手机号码 验证规则：11位数字，以1开头。
        var phonereg= /^1\d{10}$/;

        if(tname ==""){
            layer.msg("采购竞价项目不能为空.",{offset: 't',anim: 6});
            return ;
        }

        var nflag = 0;
        $("input[name$='goodsname']").each(function(){
            var cpName = $(this).val();
            if(cpName == ""){
                nflag = 1;
            }
        });

        if(nflag){
            layer.msg("产品名称不能为空",{offset: 't',anim: 6});
            return ;
        }

        var aflag = 0;
        $("input[name$='amount']").each(function(){
            var cpAmount = $(this).val();
            if(cpAmount == "" || cpAmount == "0" || cpAmount == "0.0" || cpAmount == "0.00"){
                aflag = 1;
            }
        });
        if(aflag){
            layer.msg("现货数量不能为空,并且大于0",{offset: 't',anim: 6});
            return ;
        }
        //保证金
        var margin=$("input[name='tenderInfo.margin']").val();
        if(undefined==margin||""==margin){
            layer.msg("请输入保证金金额",{offset: 't',anim: 6});
            return ;
        }else{
            $("input[name$='count']").val(margin);
        }
        //单笔保证金
        var bflag = 0;
        $("input[name$='count']").each(function(){
            var count = $(this).val();
            if(count == "" || count == "0" || count == "0.0" || count == "0.00"){
                bflag = 1;
            }
        });

        if(bflag){
            layer.msg("保证金不能为空,并且大于0",{offset: 't',anim: 6});
            return ;
        }

        var uflag = 0;
        $("input[name$='unit']").each(function(){
            var cpUnit = $(this).val();
            if(cpUnit == ""){
                uflag = 1;
            }
        });

        if(uflag){
            layer.msg("产品单位不能为空",{offset: 't',anim: 6});
            return ;
        }

        var uflag = 0;
        $("input[name$='unit']").each(function(){
            var cpUnit = $(this).val();
            if(cpUnit == ""){
                uflag = 1;
            }
        });

        if(uflag){
            layer.msg("产品单位不能为空",{offset: 't',anim: 6});
            return ;
        }

        var comflag = 0;
        $("input[name$='company']").each(function(index,info){
            var cpDescription = $(this).val();
            if(cpDescription == ""){
                dflagcomflag = 1;
            }
        });

        if(comflag){
            layer.msg("资产采购单位不能为空",{offset: 't',anim: 6});
            return ;
        }

        var urlflag = 0;
        $("input[name$='url']").each(function(){
            var cpUrl = $(this).val();
            if(cpUrl == ""){
                urlflag = 1;
            }
        });

        if(urlflag){
            layer.msg("产品图片不能为空",{offset: 't',anim: 6});
            return ;
        }



        if(isqualication == undefined){
            layer.msg("资质要求必选",{offset: 't',anim: 6});
            return ;
        }

        if(participate == ""){
            layer.msg("参与要求不能为空",{offset: 't',anim: 6});
            return ;
        }

        if( isqualication==0 && qualification !=""){
            layer.msg("无资质要求请检查输入项",{offset: 't',anim: 6});
            return ;
        }
        if(isqualication==1 && qualification ==""){
            layer.msg("有资质要求请添加资质",{offset: 't',anim: 6});
            return ;
        }

        if(margin == "" || margin == "0" || margin=="0.0" || margin =="0.00"){
            layer.msg("保证金不能为空且大于0",{offset: 't',anim: 6});
            return;
        }

        var fee = $("input[name='tenderInfo.fee']").val();
        if(isCharge == "1"){
            if(fee == ""){
                layer.msg("附件收费金额不能为空."),{offset: 't',anim: 6};
                return ;
            }
        }

        var athumbflag = 0 ;
        $("input[name$='filethumb']").each(function(){
            var filethumb = $(this).val();
            if(filethumb == ""){
                athumbflag=1;
            }
        });

        if(athumbflag){
            layer.msg("附件不能为空",{offset: 't',anim: 6});
            return;
        }

        if(undefined==opentendertime&&opentendertime ==""){
            layer.msg("开标时间不能为空",{offset: 't',anim: 6});
            return ;
        }

        var quotedeadline = $("#quotedeadline").val();
        if(quotedeadline !=null || quotedeadline !=""){
            if(quotedeadline > opentendertime ){
                layer.msg("不能大于开标时间");
                return ;
            }
        }
        var mnameflag = 0;

        $("input[name$='mname']").each(function(){
            var mname = $(this).val();
            if(mname == ""){
                mnameflag=1;
            }
        });

        if(mnameflag){
            layer.msg("评标人不能为空");
            return;
        }

        var mmailflag = 0;
        $("input[name$='mmail']").each(function(){
            var mmail = $(this).val();
            if(mmail !==""){
                if(!myreg.test(mmail)){
                    mmailflag=1;
                }
            }else {
                mmailflag=1;
            }
        });

        if(mmailflag){
            layer.msg("评标人邮箱格式不正确或不能为空",{offset: 't',anim: 6});
            return ;
        }

        var phoneflag = 0;
        $("input[name$='phone']").each(function(){
            var tel = $(this).val();
            if(tel !==""){
                if(!phonereg.test(tel)){
                    phoneflag=1;
                }
            }else{
                phoneflag=1;
            }
        });

        if(phoneflag){
            layer.msg("评标人电话不能为空,或格式不正确.",{offset: 't',anim: 6});
            return ;
        }


        if($(this).val()=="发布"){
            if(baseMail == "" ){
                layer.msg("标底揭示人邮箱不能为空",{offset: 't',anim: 6});
                return ;
            }

            if(!myreg.test(baseMail)){
                layer.msg("请输入有效的标底揭示人邮箱",{offset: 't',anim: 6});
                myreg.focus();
                return ;
            }

            if(baseName == ""){
                layer.msg("标底揭示人姓名不能为空",{offset: 't',anim: 6});
                return ;
            }

            if(basePhone == ""){
                layer.msg("标底揭示人电话不能为空",{offset: 't',anim: 6});
                return ;
            }
        }
        if(basePhone != ""){
            if(!phonereg.test(basePhone)){
                layer.msg("标底揭示人电话格式错误请输入有效的11位手机号码",{offset: 't',anim: 6});
                phonereg.focus();
                return ;
            }
        }

        //库存地址选择
        var cmbProvince=$("#cmbProvince").find("option:selected").text();
        var cmbCity=$("#cmbCity").find("option:selected").text();
        var cmbArea=$("#cmbArea").find("option:selected").text();
        var inputaddr=$("#input-addr").val();


        if(cmbProvince == ""){
            layer.msg("请选择库存省级地址",{offset: 't',anim: 6});
            return ;
        }
        if(cmbCity == ""){
            layer.msg("请选择库存市级地址",{offset: 't',anim: 6});
            return ;
        }
        if(cmbArea == ""){
            layer.msg("请选择库存县/区级地址",{offset: 't',anim: 6});
            return ;
        }
        if(inputaddr == ""){
            layer.msg("请输入库存详细地址",{offset: 't',anim: 6});
            return ;
        }
        $(".tenderInfoareaname").val(cmbProvince+"@"+cmbCity+"@"+cmbArea+"@"+inputaddr)

        var contacter = $("#contacter").val();
        if(contacter == ""){
            layer.msg("联系人不能为空",{offset: 't',anim: 6});
            return ;
        }

        var contacttel = $("#contacttel").val();
        if(contacttel == ""){
            layer.msg("联系电话不能空",{offset: 't',anim: 6});
            return;
        }

        var phonereg= /^1\d{10}$/;
        if(!phonereg.test(contacttel)){
            layer.msg("请正确填写电话格式，为11位数字",{offset: 't',anim: 6});
            return ;
        }

        var assetunit = $("#assetunit").val();
        if(assetunit == ""){
            layer.msg("资产处置单位不能空",{offset: 't',anim: 6});
            return ;
        }

        if(isBidd == "0"){
            $("#jianbiaoren").html("");
        }
        if($(this).val()=="保存"){
            $("#audit").val("5");
        }else {
            $("#audit").val("0");
        }
        var  qdata=$("#tenderInfo").serialize();
        var reqdata=qdata;
        if($(this).val()=="保存"){
            pairequest("/pai/tender/saveTenderEmp.do",reqdata).then(function(data){
                layer.msg(data.msg,{offset: 't',anim: 6});
            });

        }else{
            layer.msg('小易提示:建议您提前预览公告', {
                time: 20000, //20s后自动关闭
                btn: ['直接发布', '预览']
                ,btn2: function(index, layero){
                    preview();
                    return false ;
                }

                ,yes: function(index, layero){
                    pairequest("/pai/tender/saveTenderEmp.do",reqdata).then(function(data){
                        if(data.success==true&&($("#audit").val()!=5)){
                            paiAlert("发布成功","./tendermanageraudit.html","去审核列表")
                        }else{
                            layer.msg(data.msg,{offset: 't',anim: 6});
                        }
                    });
                    return false ;
                }
            });
        }

    });
}



//TODO 基础事件
//加载二级分类
function getSecondCategory(){
    var pid = $('#fcategory').val();
    if (pid == 16){
        $("#scategory").hide();
        $('#zizhi_txt').val('');
    }else {
        var reqdata={"parentid":pid};
        pairequest("/pai/auction/getSecondCategory.do",reqdata).then(function(data){
            var categoryTwo = data.obj;
            var categoryTwoHtml = "";
            var certname = "";
            for(var i = 0 ; i<categoryTwo.length;i++){
                categoryTwoHtml += '<option value='+categoryTwo[i].certname+'>'+categoryTwo[i].catname+'</option>';
            }
            var  html=categoryTwo[0].certname;
            if(html!=''&&html!=undefined){
                html=html.split("@");
            }
            $("#active-zizhi").empty();

            $.each(html,function(index,info){
                $("#active-zizhi").append('<div class="active-zizhi"> <span name = "qualification">'+info+'</span> <a  class="closezz" href="javascript:;">×</a></div>');
            });

            /* $('#zizhi_txt').val(categoryTwo[0].certname);*/
            $("#scategory").html(categoryTwoHtml);
            //分类
            $(".tenderInfocataname").val("");
            $(".tenderInfocataname").val($("#fcategory").find("option:selected").text()+"@"+$("#scategory").find("option:selected").text());

        });
    }
}

//展示资质所有项
function addCertName(certname,qList){
    var  html=certname;
    if(html!=''&&html!=undefined){
        html=html.split("@");
    }
    setTimeout(function() {
        $("#fcategory").find("option:contains('"+html[0]+"')").attr("selected",true);
        getSecondCategory()
        setTimeout(function(){
            $("#scategory").find("option:contains('"+html[1]+"')").attr("selected",true);
            setTimeout(function() {
                var html="";
                $.each(qList,function(index,info){
                    html+='<div class="active-zizhi"> <span name="qualification" id="qualification'+index+'">'+info+'</span> ';
                    html+='<a  class="closezz" href="javascript:;">×</a>';
                    html+='</div>';
                })
                if(html!=''){
                    $("#active-zizhi").empty();
                    $("#active-zizhi").append(html);
                }
            }, 500);
        },500);
    }, 500);
}

//图片查看
function diagnose(obj) {
    var picHtml = $(obj).parent().find('.scan').find('img').attr('src');
    if(picHtml !=""){
        var photo={
            "title": picHtml, //相册标题
            "id": new Date().getTime(), //相册id
            "start": 0, //初始显示的图片序号，默认0
            "data": [   //相册包含的图片，数组格式
                {
                    "alt": picHtml,
                    "pid": new Date().getTime(), //图片id
                    "src": picHtml, //原图地址
                    "thumb": picHtml //缩略图地址
                }
            ]
        }

        layer.photos({
            photos: photo //格式见API文档手册页
            ,anim: 1 //0-6的选择，指定弹出图片动画类型，默认随机
        });


    }
    return false;
}

//普通文件上传
function g_AjxUploadFile(btn) {
    layui.use('upload', function(){
        var $ = layui.jquery,
            upload = layui.upload;

        //普通图片上传
        var uploadInst = upload.render({
            elem: '#pic'+btn
            ,url: '/pai/fileUpload/uploadFile.do'
            ,done: function(res){
                if(res.success){
                    $("#img"+btn).val(res.obj.picurl);
                    $("#pre"+btn).attr('src',res.obj.picurl);
                    $('#img'+btn).val(res.obj.picurl);
//	        			$(obj).parent().find('.scan').find('img').attr('src')
                    layer.msg(res.msg, {time: 5000, icon:6,offset: 't',anim: 6});
                }else{
                    layer.msg(res.msg, {time: 5000, icon:6,offset: 't',anim: 6});
                }
            }
            ,error: function(){
                //演示失败状态，并实现重传
                var demoText = $('#demoText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function(){
                    uploadInst.upload();
                });
            }
        });

    });


}

//附件文件上传
function annexUpload(btn){
    layui.use('upload', function(){
        var $ = layui.jquery,
            upload = layui.upload;

        //普通图片上传
        var uploadInst = upload.render({
            elem: '#annex'+btn
            ,url: '/pai/fileUpload/uploadFile.do'
            ,exts: 'zip|rar|7z|pdf'
            ,size:30*1024*1024
            ,done: function(res){
                if(res.success){
                    $("#filethumb"+btn).val(res.obj.picurl);
                    $("#filename"+btn).val(res.obj.filename);
                    layer.msg(res.msg, {time: 5000, icon:6,offset: 't',anim: 6});
                }else{
                    layer.msg(res.msg, {time: 5000, icon:6,offset: 't',anim: 5});
                }
            }
            ,error: function(){
                //演示失败状态，并实现重传
                var demoText = $('#demoText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function(){
                    uploadInst.upload();
                });
            }
        });

    });


}

//删除评标人
function delMon(mid){
    $.ajax({
        type: "POST",
        url: "tender/delMon.do",
        data: "mid="+mid,
        success: function(data){
        }
    });
    $("#"+mid).empty();
}

//删除附件
function delAnnex(aid){
    $.ajax({
        type: "POST",
        url: "tender/delAnnex.do",
        data: "aid="+aid,
        success: function(data){
        }
    });
    $("#a"+aid).empty();
}

//删除商品
function delGoods(gid){
    $.ajax({
        type: "POST",
        url: "/pai/tender/delGoods.do",
        data: "gid="+gid,
        success: function(data){
        }
    });
}

//是否认证
function  authparams(){
    var reqdata={};
    pairequest("/pai/memberAuth/toMemberAuth.do",reqdata).then(function(data){
        if(data.success==true){
            var status=data.obj.status;
            userinfo=data.obj.upistr;
            //0 1  3审核中  4 已通过 5 未通过
            $(".isauth").hide();
            $(".noauth").hide();
            $(".authing").hide();
            $(".authfaile").hide();
            if(status==3||status==4||status==5){
                if(status!=5){
                    var html="";
                    if(status==3){
                        $(".authing").show();
                    }else{
                        $(".isauth").show();
                    }
                }else{
                    $(".authfaile").show();
                }
            }else{
                $(".noauth").show();
            }
        }else{
            window.location.href="/user/login.html";
        }
    });
};


//公告预览
function preview(){
    var tname = $("#tname").val();//采购竞价名称
    var margin=$("#margin").val();//保证金
    var opentendertime=$("#tenderopentime").val();//开标时间
    var catanames=$("#fcategory").find("option:selected").text()+""+$("#scategory").find("option:selected").text();

    //库存地址选择
    var cmbProvince=$("#cmbProvince").find("option:selected").text();
    var cmbCity=$("#cmbCity").find("option:selected").text();
    var cmbArea=$("#cmbArea").find("option:selected").text();
    var inputaddr=$("#input-addr").val();


    if(cmbProvince == ""){
        layer.msg("请选择库存省级地址",{offset: 't',anim: 6});
        return ;
    }
    if(cmbCity == ""){
        layer.msg("请选择库存市级地址",{offset: 't',anim: 6});
        return ;
    }
    if(cmbArea == ""){
        layer.msg("请选择库存县/区级地址",{offset: 't',anim: 6});
        return ;
    }
    if(inputaddr == ""){
        layer.msg("请输入库存详细地址",{offset: 't',anim: 6});
        return ;
    }
    $(".tenderInfoareaname").val(cmbProvince+"@"+cmbCity+"@"+cmbArea+"@"+inputaddr)

    var contacter = $("#contacter").val();
    if(contacter == ""){
        layer.msg("联系人不能为空",{offset: 't',anim: 6});
        return ;
    }

    var contacttel = $("#contacttel").val();
    if(contacttel == ""){
        layer.msg("联系电话不能空",{offset: 't',anim: 6});
        return;
    }

    var phonereg= /^1\d{10}$/;
    if(!phonereg.test(contacttel)){
        layer.msg("请正确填写电话格式，为11位数字",{offset: 't',anim: 6});
        return ;
    }

    var assetunit = $("#assetunit").val();
    if(assetunit == ""){
        layer.msg("资产处置单位不能空",{offset: 't',anim: 6});
        return ;
    }

    if(catanames!=undefined&&catanames!=null&&catanames!=''){
        if(catanames.indexOf("@")>-1){
            catanames = catanames.substring(0,catanames.indexOf("@"));
        }
        if(catanames.indexOf("废油")>-1){
            template = feiyouTemplate;
        }else if(catanames.indexOf("废钢")>-1){
            template = feigangTemplate;
        }
    }
    template = trashTemplate;
    var opentendertime = $("input[name='tenderInfo.opentendertime']").val();
    var area = $(".tenderInfoareaname").val().split("@").join("-");
    if(area!=null && area!=undefined){
        area = area.replace(/@/g,"");
    }
    var beginTime = new Date(opentendertime);
    beginTime = new Date(beginTime.getTime()-30*60*1000);
    beginTime = getTime(beginTime);

    template = template.replace(/@company/g,$("input[name='tenderInfo.tname']").val());
    template = template.replace(/@goodsName/g,$("input[name='goods[0].goodsname']").val());
    template = template.replace(/@auctionStartTime/g,beginTime);
    template = template.replace(/@auctionEndTime/g,opentendertime);
    template = template.replace(/@goodsAddress/g,area);
    template = template.replace(/@goodsamount/g,$("input[name='goods[0].amount']").val());
    template = template.replace(/@goodsunit/g,$("input[name='goods[0].unit']").val());
    template = template.replace(/@goodsdes/g,$("input[name='goods[0].description']").val());
    template = template.replace(/@pactStartTime/g,$("input[name='tenderInfo.pactstarttime']").val());
    template = template.replace(/@pactEndTime/g,$("input[name='tenderInfo.pactendtime']").val());
    template = template.replace(/@goodBonds/g,$("input[name='goods[0].count']").val());
    template = template.replace(/@goodsCate/g,catanames);
//	template = template.replace(/@formula/g,/*$("#formula").val()*/);
    template = template.replace(/@lookstarttime/g,$("input[name='tenderInfo.lookstarttime']").val());
    template = template.replace(/@lookendtime/g,$("input[name='tenderInfo.lookendtime']").val());
    layer.open({
        anim: 2,
        type: 1,
        title: "公告预览",
        shade: 0.1,
        scrollbar :true,
        shadeClose: false,
        area: ['80%', '70%'],
        content:template
    });
}

//时间戳格式化为年月日时分秒
function getTime(timestamp) {
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
