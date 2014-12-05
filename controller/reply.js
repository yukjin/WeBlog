/**
 * Created by luzhen on 14-11-26.
 */
var Reply=require('../lib/Reply');
var eventproxy=require('eventproxy');
var markdown=require('markdown-js');

function addReply(req,res,next) {
    var articleId=req.params.articleId||'';
    var author=req.params.username||'';
    var content=req.body.content||'';
    var user=req.session.user||'';
    if(user===''){
        res.redirect('/login');
        return;
    }
    var replyer_id=user.id;
    var ep=eventproxy();
    ep.on('reply_error',function(tip){
        req.flash('error',tip);
        res.redirect('/article/detail/'+articleId);
    });
    if ([articleId,content].some(function (item) { return item === ''; })) {
        ep.emit('reply_error', '内容不能为空或评论的文章不存在!');
        return;
    }

    var newReply=new Reply({'content':markdown.parse(content),'articleId':articleId,'replyer_id':replyer_id});

    newReply.addReply(function(err,result){
        if(err){
            ep.emit('reply_error',err);
            return;
        }else{
            res.redirect('/'+author+'/article/detail/'+articleId);
        }
    });
}

exports.addReply=addReply;