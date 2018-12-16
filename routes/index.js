var express = require('express'),
    router = express.Router(),
    apiService = require('../service/serviceInterface'),
    tool = require('../service/tool'),
    apiUrl = require('../service/remoteURL');
/* GET home page. */
router.get('/', function (req, res, next) {
    tool.responsePage('index', {
        title: '新闻详情',
    }, req, res);
});

module.exports = router;
