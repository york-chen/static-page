//格式化图片地址 然后返回给前端
var remoteHost=require('../../service/config').hostname;
module.exports= function (strUrl) {
	var txt = ''
    if(strUrl==''||strUrl==null){
        return txt = '';
    }
    else{
        strUrl = strUrl.replace('zip_','');
        var index = strUrl.lastIndexOf('/'),temp = strUrl.split('');
        temp.splice(index+1,0,'screen_');
        var extend = strUrl.lastIndexOf('.');
        temp = temp.slice(0,extend+1);
        txt = temp.join('');
        return 'http://'+remoteHost+'/hwt/img'+txt + '.jpg';
    }
};