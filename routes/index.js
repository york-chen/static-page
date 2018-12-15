var express = require('express'),
    router = express.Router(),
    apiService = require('../service/serviceInterface'),
    tool = require('../service/tool'),
    apiUrl = require('../service/remoteURL');
/* GET home page. */
router.get('/', function (req, res, next) {
    tool.responsePage('index', {
        title: '欢迎来到模切易得通',
    }, req, res);
});

module.exports = router;
