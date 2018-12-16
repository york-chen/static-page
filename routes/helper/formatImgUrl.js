//格式化图片地址 然后返回给前端
var remoteHost=require('../../service/config').hostname;
module.exports= function (strUrl) {
    if(strUrl==''||strUrl==null){
        return '/images/noimg.jpg';
    }
    else{
        var img=strUrl.split(',')[0];
        return 'http://'+remoteHost+'/hwt/img'+img;
    }
};