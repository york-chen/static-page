var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//这里引入自定义的函数 在ejs模板里面使用
var formatDate=require('./routes/helper/formatDate'),
    formatImgUrl=require('./routes/helper/formatImgUrl')
    formatText=require('./routes/helper/formatText'),
    formatVideoScreen = require('./routes/helper/formatVideoScreen');
var routes = require('./routes/index'),
    map = require('./routes/map');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

if (app.get('env') == 'development') {
    var logger = require('morgan');
    app.use(logger('dev'));
}

if (app.get('env') === 'production') {
    var log4js = require('log4js');
    log4js.configure({
        appenders: [{
            "type": "dateFile",
            "filename": "logs/access.log",
            "pattern": "-yyyy-MM-dd",
            "category": "normal",
            "level": "INFO"
        }]
    });
    var logger = log4js.getLogger('normal');
    logger.setLevel('INFO');
    app.use(log4js.connectLogger(logger, {level: log4js.levels.INFO}));
}

app.use('/', routes);
app.use('/map', map);
//格式化日期，使用了moment函数
app.locals.dateFormat=formatDate;
//格式化图片的地址
app.locals.imgUrlFormat=formatImgUrl;
//将文本中的换行符替换为html中的换行标签<br>
app.locals.textFormat=formatText;
//处理视频缩略图
app.locals.formatVideoScreen = formatVideoScreen;
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
if (app.get('env') === 'production') {

}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
