function setCookie(name, value, expires, path, domain, secure) {
        var curCookie = name + "=" + escape(value) +
                ((expires) ? "; expires=" + expires.toGMTString() : "") +
                ((path) ? "; path=" + path : "") +
                ((domain) ? "; domain=" + domain : "") +
                ((secure) ? "; secure" : "");
        if ( (name + "=" + escape(value)).length <= 4000)
                document.cookie = curCookie;
        else
                if (confirm("Cookie exceeds 4KB and will be cut!"))
                        document.cookie = curCookie;
}
function getCookie(name) {
        var prefix = name + "=";
        var cookieStartIndex = document.cookie.indexOf(prefix);
        if (cookieStartIndex == -1)
                return null;
        var cookieEndIndex = document.cookie.indexOf(";", cookieStartIndex + prefix.length);
        if (cookieEndIndex == -1)
                cookieEndIndex = document.cookie.length;
        return unescape(document.cookie.substring(cookieStartIndex + prefix.length, cookieEndIndex));
}
function savecookie(nowurl){
	   var date = new Date();
	   date.setTime(date.getTime()+(20*60*1000));
       setCookie("SOUNDSTATICPAGECACHED",nowurl,date,"/");
}
//window.onload=function(){
//    var cont=getCookie("soundstaticpagecached");
//    if(cont) document.getElementById("cook").innerText=cont;
//}
