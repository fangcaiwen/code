$(document).ready(function(){
    projectcom(0);
    projectcommouseoverp(0);
});
function  projectcommouseoverp(index){
    $(".projectcom"+index).mouseover(function(){
        var this_index=$(this);
        var index_goods=$(this_index).attr("id");
        var com=$("input[name='goods["+index_goods+"].company']").val();
        var areaname=$("input[name='goods["+index_goods+"].areaname']").val()
        if(com==""){
            return false;
        }
        layer.tips(com+"<br/>"+areaname.split("@").join("-"), '.projectcom'+index_goods, {
            tips: [1, '#3595CC'],
            time: 2000
        });
    })
}
//projectcom
function  projectcom(index){
    $(".projectcom"+index).click(function(){
        var this_index=$(this);
        var index_goods=$(this_index).attr("id");
        var html='';
        html='<div class="memberCenterContent m-auth-form joinBid" style="display:block;width: 760px;">';
        html+='<li>';
        html+='<label><span>*</span><em>资产采购发标单位:</em></label>';
        html+='<div class="m-input">';
        html+='<input  type="text" placeholder="支持模糊匹配"  name="assetunit" value="" id="assetunit" >';
        html+='<div class="mohuaddress"></div></div>';
        html+='</li>';
        html+='<li>';
        html+=' <label><span>*</span><em>资产采购发标地址：</em></label>';
        html+=' <div class="m-input">';
        html+=' <div class="selesy" style="margin-right: 2px;">';
        html+='	<select id="cmbProvince1" class="provice1"></select>	';
        html+=' </div>';
        html+=' <div class="selesy" style="margin-right: 2px;">';
        html+=' <select id="cmbCity1" class="city1"></select>   ';
        html+='</div>';
        html+='<div class="selesy" style="margin-right: 2px;">';
        html+='<select id="cmbArea1" class="country1"></select>';
        html+='</div>';
        html+='<input type="text" id="input-addr1" class="input-addr1" value="" placeholder="输入详情地址……"/>';
        html+=' </div>';
        html+=' </li>';
        html+=' </div>';
        var  parama=layer.open({
            anim: 2,
            type: 1,
            title:  ['资产采购单位选择', 'font-size:18px;color:#006ad3;'],
            shade: 0.1,
            scrollbar :true,
            skin: '', //没有背景色
            shadeClose: false,
            area: ['820px', '350px'],
            content: html,
            btn: ['确定录入']
            ,yes: function(index, layero){
                var company= $("input[name='assetunit']").val();
                var cmbProvince=$("#cmbProvince1").find("option:selected").text();
                var cmbCity=$("#cmbCity1").find("option:selected").text();
                var cmbArea=$("#cmbArea1").find("option:selected").text();
                var inputaddr=$("#input-addr1").val();

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
                var areaname=cmbProvince+"@"+cmbCity+"@"+cmbArea+"@"+inputaddr;
                area_add(company,areaname)
                $("input[name='goods["+index_goods+"].company']").val(company);
                $("input[name='goods["+index_goods+"].areaname']").val(areaname);
                var aa=$(this_index).html();
                $(this_index).text(company==""?"未选择":(company.substring(0,6)+"..."));
                layer.close(parama);
            }
        });

        //地址
        var com=$("input[name='goods["+index_goods+"].company']").val();
        var areaname=$("input[name='goods["+index_goods+"].areaname']").val();
        $("input[name='assetunit']").val(com);
        if(areaname!=undefined&&areaname!=""){
            var areaname=areaname.split("@");
            addressInit('cmbProvince1', 'cmbCity1', 'cmbArea1', areaname[0], areaname[1], areaname[2]);
            $("#input-addr1").val(areaname[3]);
        }else{
            if(index_goods>0){
                var com=$("input[name='goods["+(index_goods-1)+"].company']").val();
                var areaname=$("input[name='goods["+(index_goods-1)+"].areaname']").val();
                $("input[name='assetunit']").val(com);
                if(areaname!=undefined&&areaname!=""){
                    var areaname=areaname.split("@");
                    addressInit('cmbProvince1', 'cmbCity1', 'cmbArea1', areaname[0], areaname[1], areaname[2]);
                    $("#input-addr1").val(areaname[3]);
                }else{
                    addressInit('cmbProvince1', 'cmbCity1', 'cmbArea1', "", "", "");
                }
            }else{
                addressInit('cmbProvince1', 'cmbCity1', 'cmbArea1', "", "", "");
            }

        }


        //公司模糊
        $("input[name='assetunit']").keyup(function(){
            var company= $("input[name='assetunit']").val();
            if(""==company){
                return false;
            };
            area_serach(company);
        });

    });
};

//地址添加
function area_add(company,areaName){
    var reqdata={"company":company,"areaName":areaName};
    painoloadrequest("/pai/tenderarea/tpusharea.do",reqdata).then(function(data){

    });
};

//搜索
function area_serach(company){
    var reqdata={"company":company};
    painoloadrequest("/pai/tenderarea/check.do",reqdata).then(function(data){
        if(data.success==true){
            var html="";
            $.each(data.obj,function(index,info){
                html+='<span style="color:orange;cursor: pointer;margin-right: 6px;" class="areac"   title="'+info.areaname+'">'+info.company+'</span>';
            });
            $(".mohuaddress").empty();
            $(".mohuaddress").append(html);
            area_c();
        }

    });
}
//地址选择
function area_c(){
    $(".areac").click(function(){
        $("input[name='assetunit']").val($(this).html());
        var areaname=$(this).attr("title");
        if(areaname!=undefined&&areaname!=""){
            var areaname=areaname.split("@");
            addressInit('cmbProvince1', 'cmbCity1', 'cmbArea1', areaname[0], areaname[1], areaname[2]);
            $("#input-addr1").val(areaname[3]);
        }else{
            addressInit('cmbProvince1', 'cmbCity1', 'cmbArea1', "", "", "");
        }
    })
}