$(document).ready(function(){
    goods_serach(0);
    goods_serachmouseoverp(0);
});
function  goods_serachmouseoverp(index){
    $(".input[name='goods["+index+"].goodsname']").mouseover(function(){
        var this_index=$(this);
        var index_goods=$(this_index).attr("id");
        if($(this).val()==""){
            return false;
        }
        layer.tips($(this).val(), '#goodsgoodsname'+index_goods, {
            tips: [2, '#3595CC'],
            time: 2000
        });
    })
};


function  goods_serach(index){
    $("input[name='goods["+index+"].goodsname']").keyup(function(){
        var goods_temp=$(this).val();
        var goods_name=$(this).attr("name");
        if(goods_temp==""){
            return false;
        }
        goods_toserach(goods_temp,index);
    })
}

var  layer_index=0;
//搜索
function goods_toserach(goods_temp,index){
    var reqdata={"serach":goods_temp};
    painoloadrequest("/pai/tenderGoodsTemp/check.do",reqdata).then(function(data){
        if(data.success==true){
            if(null==data.obj||data.obj.length==0){
                return false;
            }
            var html="";
            $.each(data.obj,function(index1,info){
                html+='<span style="color:#fff;cursor: pointer;margin-right: 6px;" class="namec" id="'+index+'"  title="'+info.number+'@'+info.doods_unit+'@'+info.goods_des+'">'+info.goods_name+'</span>';
            });
            layer_index=layer.tips(data.obj[0].goods_cate+"<br/>"+html, "#goodsgoodsname"+index, {
                tips: [1, '#3595CC'],
                time: 50000
            });

            name_c(index);
        }

    });
};

//地址选择
function name_c(index){
    $(".namec").click(function(){
        var index=$(this).attr("id");
        var goodsdetail=$(this).attr("title");
        var goodsname=$(this).html();
        var number=goodsdetail.split("@")[0];
        var unit=goodsdetail.split("@")[1];
        var des=goodsdetail.split("@")[2];
        $("input[name='goods["+index+"].goodsname']").val(goodsname);
        $("input[name='goods["+index+"].unit']").val(unit);
        if(""==$("input[name='goods["+index+"].description']").val()){
            $("input[name='goods["+index+"].description']").val(des);
        }

        layer.close(layer_index);
    })
};
