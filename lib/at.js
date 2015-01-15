/**
 * Created by luzhen on 15-1-15.
 */
var User=require('../lib/User');
var Message=require('../lib/Message');
var eventproxy=require('eventproxy');
function fetchUsers(text) {
    var ignore_regexs = [
        /```.+?```/g, // 去除单行的 ```
        /^```[\s\S]+?^```/gm, // ``` 里面的是 pre 标签内容
        /`[\s\S]+?`/g, // 同一行中，`some code` 中内容也不该被解析
        /^    .*/gm, // 4个空格也是 pre 标签，在这里 . 不会匹配换行
        /\b.*?@[^\s]*?\..+?\b/g, // somebody@gmail.com 会被去除
        /\[@.+?\]\(\/.+?\)/g // 已经被 link 的 username
    ];

    ignore_regexs.forEach(function(ignore_regex) {
        text = text.replace(ignore_regex, '');
    });
    var results = text.match(/@[a-z0-9\-_]+\b/igm);
    var names = [];
    if (results) {
        for (var i = 0, l = results.length; i < l; i++) {
            var s = results[i];
            //remove leading char @
            s = s.slice(1);
            names.push(s);
        }
    }
    return names;
};

exports.sendMessageToMentionUsers = function (text, article_id, from_person,callback) {
    User.getByNames(fetchUsers(text), function (err, users) {
        if(err){
            callback(err);
        }else{
            var ep = new eventproxy();
            ep.after('sent', users.length, function () {
                callback();
            });

            users.forEach(function (user) {
                var message=new Message({
                    'type':'at',
                    'status':'0',
                    'from_person':from_person,
                    'to_person':user.id,
                    'article_id':article_id
                });

                message.save(ep.done('sent'));
            });
        }

    });
};


exports.linkUsers=function(text){
    var users = fetchUsers(text);
    for (var i = 0, l = users.length; i < l; i++) {
        var name = users[i];
        text = text.replace(new RegExp('@' + name + '\\b', 'g'), '[@' + name + '](/'+name+'/home)');
    }
    return text;
};