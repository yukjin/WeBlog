/**
 * Created by luzhen on 14-11-25.
 */
var eventProxy=require('eventproxy');
var BlogUtil=require('../lib/BlogUtil');
var Post=require('../lib/Post');
var User=require('../lib/User');
function indexPagination(req,res,next){
    var ep=new eventProxy();
    var pageNum=parseInt(req.params.pageNum) || 1;
    var prePage=pageNum-1;
    var nextPage=pageNum+1;
    if(pageNum<1){
        pageNum=1;
    }
    ep.all('getArticles','archive',function(articles,archive){
        res.render('index',{'articles':articles,'archive':archive,'prePaginationUrl':'/page/'+prePage+'/',nextPaginationUrl:'/page/'+nextPage+'/'});
    });
    BlogUtil.archive(function (err,result) {
        ep.emit('archive',result);
    });
    BlogUtil.pagination(pageNum,function(err,result){
        ep.emit('getArticles',result);
    });
}

function homePagination(req,res,next) {
    var ep=new eventProxy();
    var author=req.params.username;
    var pageNum=parseInt(req.params.pageNum)||1;
    var prePage=pageNum-1;
    var nextPage=pageNum+1;
    if(pageNum<1){
        pageNum=1;
    }
    ep.all('getArticles','archive','getUserInfo','getCategories','getFriendLinks',function(articles,archive,userInfo,categories,friendLinks){
        res.render('home',{'articles':articles,'archive':archive,'userInfo':userInfo,'categories':categories,'friendLinks':friendLinks,'prePaginationUrl':'/'+author+'/page/'+prePage+'/',nextPaginationUrl:'/'+author+'/page/'+nextPage+'/'});
    });
    BlogUtil.archiveByYourself(author,function (err,result) {
        ep.emit('archive',result);
    });
    BlogUtil.paginationByYourself({'author':author,'pageNum':pageNum},function(err,result){
        ep.emit('getArticles',result);
    });
    Post.getCategoryByUsername({user_name:author},function(err,result){
        ep.emit('getCategories',result);
    });
    User.getByName(author,function(err,result){
        ep.emit('getUserInfo',result[0]);
    });
    BlogUtil.getFriendLinksByUserName({userName:author}, function (err,result) {
        ep.emit('getFriendLinks',result);
    });
}

function homeArchivePagination(req,res,next){
    var ep=new eventProxy();
    var pageNum=parseInt(req.params.pageNum)||1;
    var prePage=pageNum-1;
    var nextPage=pageNum+1;
    var author=req.params.username;
    var date=req.params.date;
    if(req.params.pageNum<1){
        req.params.pageNum=1;
    }
    ep.all('getArticles','archive','getUserInfo','getCategories','getFriendLinks',function(articles,archive,userInfo,categories,friendLinks){
        res.render('home',{'articles':articles,'archive':archive,'userInfo':userInfo,'categories':categories,'friendLinks':friendLinks,'prePaginationUrl':'/'+author+'/archive/'+date+'/page/'+prePage+'/',nextPaginationUrl:'/'+author+'/archive/'+date+'/page/'+nextPage+'/'});
    });
    BlogUtil.archiveByYourself(author,function (err,result) {
        ep.emit('archive',result);
    });
    BlogUtil.paginationByYourselfByDate({'author':author,'date':date,'pageNum':pageNum},function(err,result){
        ep.emit('getArticles',result);
    });
    Post.getCategoryByUsername({user_name:author},function(err,result){
        ep.emit('getCategories',result);
    });
    User.getByName(author,function(err,result){
        ep.emit('getUserInfo',result[0]);
    });
    BlogUtil.getFriendLinksByUserName({userName:author}, function (err,result) {
        ep.emit('getFriendLinks',result);
    });
}

function indexArchivePagination(req,res,next){
    var ep=new eventProxy();
    var pageNum=parseInt(req.params.pageNum)||1;
    var prePage=pageNum-1;
    var nextPage=pageNum+1;
    var date=req.params.date;
    if(pageNum<1){
        pageNum=1;
    }
    ep.all('getArticles','archive',function(articles,archive){
        res.render('index',{'articles':articles,'archive':archive,'prePaginationUrl':'/archive/'+date+'/page/'+prePage+'/',nextPaginationUrl:'/archive/'+date+'/page/'+nextPage+'/'});
    });
    BlogUtil.archive(function (err,result) {
        ep.emit('archive',result);
    });
    BlogUtil.paginationByDate({date:req.params.date,'pageNum':pageNum},function(err,result){
        ep.emit('getArticles',result);
    });
}

function homeCategoryPagination(req,res,next) {
    var ep=new eventProxy();
    var author=req.params.username;
    var categoryId=req.params.categoryId;
    var pageNum=parseInt(req.params.pageNum)||1;
    var prePage=pageNum-1;
    var nextPage=pageNum+1;
    if(pageNum<1){
        pageNum=1;
    }
    ep.all('getArticles','archive','getUserInfo','getCategories','getFriendLinks',function(articles,archive,userInfo,categories,friendLinks){
        res.render('home',{'articles':articles,'archive':archive,'userInfo':userInfo,'categories':categories,'friendLinks':friendLinks,'prePaginationUrl':'/'+author+'/category/'+categoryId+'/page/'+prePage+'/',nextPaginationUrl:'/'+author+'/category/'+categoryId+'/page/'+nextPage+'/'});
    });
    BlogUtil.archiveByYourself(author,function (err,result) {
        ep.emit('archive',result);
    });
    BlogUtil.paginationByCategory({'category_id':categoryId,'pageNum':pageNum},function (err, result) {
        ep.emit('getArticles', result);
    });
    Post.getCategoryByUsername({user_name:author},function(err,result){
        ep.emit('getCategories',result);
    });
    User.getByName(author,function(err,result){
        ep.emit('getUserInfo',result[0]);
    });
    BlogUtil.getFriendLinksByUserName({userName:author}, function (err,result) {
        ep.emit('getFriendLinks',result);
    });
}
exports.indexPagination=indexPagination;
exports.homePagination=homePagination;
exports.homeArchivePagination=homeArchivePagination;
exports.indexArchivePagination=indexArchivePagination;
exports.homeCategoryPagination=homeCategoryPagination;
