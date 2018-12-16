var express = require('express'),
    router = express.Router(),
    apiService = require('../service/serviceInterface'),
    tool = require('../service/tool'),
    apiUrl = require('../service/remoteURL');
/* GET home page. */
router.get('/', function (req, res, next) {
    tool.responsePage('map', {
        title: '成中-忠诚到永远'
    }, req, res);
});

module.exports = router;
