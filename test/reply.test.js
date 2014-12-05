/**
 * Created by luzhen on 14-11-26.
 */
var should = require('should');
var Reply=require('../lib/Reply');

var newReply=new Reply({'content':'呵呵','article_id':53});

describe('test/reply.test.js',function(){
//    it('Reply.addReply',function(){
//        newReply.addReply(function(err,result){
//            (err===null).should.be.true;
//        });
//    });

    it('Reply.getRepliesByArticleId',function(){
        Reply.getRepliesByArticleId(53,function(err,result){
            console.log(result);
            (err===null).should.be.true;
        })
    });
});