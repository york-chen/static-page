var conf=require('./config');
var baseUrl =conf.baseUrl;
//重定向页面 并且返回数据
var responsePage = function (pageName, data, request, response) {
    var returnData = {
        data: data
    };
    response.render(pageName, returnData);
};
//返回给前端的ajax的数据
var responseData = function (data, request, response) {
    var returnData = {
        data: data
    };
    response.send(returnData);
};
//重定向页面
var redirectPage = function (page, request, response) {
    response.redirect(baseUrl+"/"+page);
};

module.exports.responsePage = responsePage;
module.exports.responseData = responseData;
module.exports.redirectPage = redirectPage;