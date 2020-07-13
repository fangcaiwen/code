$(document).ready(function(){
    baseinput();
});

function baseinput(){
    var reqdata={};
    painoloadrequest("/pai/tenderGoodsTemp/baseinput.do",reqdata).then(function(data){
        if(data.success==true){
            var info=data.obj;
            var areaname=info.areaname.split("@");
            addressInit('cmbProvince', 'cmbCity', 'cmbArea', areaname[0], areaname[1], areaname[2]);
            $("#input-addr").val(areaname[3]);
            $("input[name='tenderInfo.assetunit']").val(info.assetunit);
            $("input[name='tenderInfo.contacter']").val(info.contacter);
            $("input[name='tenderInfo.contacttel']").val(info.contacttel);
            $("input[name='tenderInfo.basepricename']").val(info.basepricename);
            $("input[name='tenderInfo.basepricemail']").val(info.basepricemail);
            $("input[name='tenderInfo.tel']").val(info.tel);
        }

    });

}