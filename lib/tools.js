/**
 * Created by luzhen on 14-11-27.
 */
var moment =require('moment');
var crypto = require('crypto');
moment.locale('zh-cn');

exports.formatDate = function (date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

};

exports.md5=function(str){
    return crypto.createHash('md5').update(str).digest('hex');
}