module.exports = function (content) {
    var reg = new RegExp('\r\n', 'g'),
        reg1 = new RegExp(" ", "g");
    content.replace(reg, '<br>');
    return content.replace(reg1, '<p>');
};