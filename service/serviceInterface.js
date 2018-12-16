//同步访问远程服务的组件
   var httpsync = require('urllib-sync'),
//异步访问的组件
    httpasync = require('urllib'),
//远程服务器的地址 和其他配置信息
    conf = require('./config'),
    //引入node本身的http模块
    http=require('http');
    //对文件的读取操作模块
    fs=require('fs');


//解析远程返回的数据
var toJsonObject = function (buffer, req) {
    var result = '';
    try {
        result=JSON.parse(buffer);
        //result = JSON.parse(eval('(' + buffer + ')'));
    } catch (e) {
        console.log(JSON.stringify(e));
    }
    return result;
};
//异步的get 请求
var callGet = function (url, data,req) {
    var promise=new Promise(function (resolve,reject) {
        var sendURL = 'http://' + conf.hostname + ':' + conf.port+url;
            //formatURL(url, data);
        httpasync.requestWithCallback(sendURL, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                timeout: conf.timeOut,
                data:data
            }, function (err, returnData, res) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(toJsonObject(returnData, req));
                }
            }
        );

    });
    return promise;
};
//异步的post请求
var callPost = function (url, data, req) {
    var sendURL = 'http://' + conf.hostname + ':' + conf.port + url;
    var promise=new Promise(function (resolve,reject) {
        httpasync.request(sendURL, {
                type: 'POST',
                data:data,
                timeout: conf.timeOut
            },
            function (err, returnData, res) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(toJsonObject(returnData, req));
                }
            }
        )
    });
    return promise;
};
//异步的获取远程图片的请求
var callGetImg = function (url, data,req) {
    var promise=new Promise(function (resolve,reject) {
        var sendURL = 'http://' + conf.hostname + ':' + conf.port+url;
        //formatURL(url, data);
        httpasync.requestWithCallback(sendURL, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                timeout: conf.timeOut,
                data:data
            }, function (err, returnData, res) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        type:res.headers['content-type'],
                        body:returnData,
                        traceId:res.headers['set-cookie'][0].split(';')[0].split('=')[1]
                    });
                }
            }
        );

    });
    return promise;
};
//异步的上传文件的post请求
var callUploadFile = function (url, req) {
    var targetFile=req.files.file,
        fileName=targetFile.path.substring(targetFile.path.lastIndexOf('\\')+1,targetFile.path.length),
        boundaryKey = Math.random().toString(16); //随机数，目的是防止上传文件中出现分隔符导致服务器无法正确识别文件起始位置
    var options = {
        host: conf.hostname,
        port: conf.port,
        path: url,
        method: 'POST'
    };
    var promise=new Promise(function (resolve,reject) {
        var reqHttps = http.request(options, function(resHttps) {
            resHttps.on('data', function(returnData) {
                //不管结果如何 都应该将临时文件删除，不然浪费系统空间
                var resData=toJsonObject(returnData, req);
                resolve(resData);

            });
        });
        var payload = '--' + boundaryKey + '\r\n'
                // 文件的后缀名，就是类型名称
            + 'Content-Type: '+targetFile.type+'\r\n'
                // "name" 就是form表单中 取得名字
                // "filename" 就是文件的名字,必须包含文件的后缀名
            + 'Content-Disposition: form-data; name="file"; filename="'+fileName+'"\r\n'
            + 'Content-Transfer-Encoding: binary\r\n\r\n';
        var enddata  = '\r\n--' + boundaryKey + '--';
        reqHttps.setHeader('Content-Type', 'multipart/form-data; boundary='+boundaryKey+'');
        reqHttps.setHeader('Content-Length', Buffer.byteLength(payload)+Buffer.byteLength(enddata)+targetFile.size);
        reqHttps.write(payload);
        var fileStream = fs.createReadStream(targetFile.path);//, { bufferSize: 5 * 1024*1024 }
        fileStream.pipe(reqHttps, {end: false});
        fileStream.on('end', function() {
            //文件流内容写完之后，发送http请求
            reqHttps.end(enddata);

        });
        reqHttps.on('error', function(e) {
            //不管结果如何 都应该将临时文件删除，不然浪费系统空间
            reject(e);
        });
    });
    return promise;
};
//同步的get请求
var callGetSync = function(url,data,req)
{
    var  sendUrl = "http://" + conf.hostname + ":" + conf.port + url;
    var result = httpsync.request(sendUrl, {
        method: 'GET',
        timeout: conf.timeOut,
        data:data,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return toJsonObject(result.data, req);
};
//同步的post请求
var callPostSync = function (url,data,req) {
    var sendUrl = "http://" + conf.hostname + ":" + conf.port + url;
    var result = httpsync.request(sendUrl, {
        method: 'POST',
        timeout: conf.timeOut,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    });
    return toJsonObject(result.data, req);
};

module.exports.callGet = callGet;
module.exports.callPost = callPost;
module.exports.callGetSync = callGetSync;
module.exports.callPostSync = callPostSync;
module.exports.callUploadFile = callUploadFile;
module.exports.callGetImg=callGetImg;