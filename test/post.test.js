/**
 * Created by luzhen on 14-11-19.
 */
var should = require('should');
var Post=require('../lib/Post');
var newPost=new Post({
    categoryId:'1',
    title:'title',
    content:'content',
    userId:8
});
describe('test/post.test.js',function(){
    it('Post.getCategory()',function(){
        Post.getCategory(function(err,result){
            (err === null).should.be.true;
        });
    });
    it('Post.getArticlesByYourself()',function(){
        Post.getArticlesByYourself('yukjin',function(err,result){
            (err === null).should.be.true;
        });
    });

    it('Post.getArticlesByDate()',function(){
        Post.getArticlesByDate('2014-11',function(err,result){
            (err === null).should.be.true;
        });
    });

    it('Post.getArticles()',function(){
        Post.getArticles(function(err,result){
            (err === null).should.be.true;
        });
    });
});
