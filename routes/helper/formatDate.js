var moment=require('moment');
module.exports= function (str,template) {
    var time=moment(str),pattern=template||'YYYY-MM-DD';
    if(time.isValid()){
        return time.format(pattern);
    }
    else{
        return '';
    }
};