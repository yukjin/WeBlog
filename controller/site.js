/**
 * Created by luzhen on 14-11-25.
 */
var eventProxy=require('eventproxy');
var BlogUtil=require('../lib/BlogUtil');
var User=require('../lib/User');
var Post=require('../lib/Post');
var reply=require('../lib/Reply');

function index(req,res,next){//广场
    var ep=new eventProxy();
    ep.all('getArticles','archive',function(articles,archive){
        res.render('index',{'articles':articles,'archive':archive,'prePaginationUrl':'/page/',nextPaginationUrl:'/page/2'});
    });
    BlogUtil.archive(function (err,result) {
        ep.emit('archive',result);
    });
    BlogUtil.pagination(1,function(err,result){
        ep.emit('getArticles',result);
    });
}

function bSettings(req,res,next){//博客设置
    var user=req.session.user;
    var ep=new eventProxy();
    ep.all('getArticles','getCategories','getFriendLinks',function(articles,categories,friendLinks){
        res.render('bSettings',{'articles':articles,'categories':categories,'friendLinks':friendLinks});
    });

    BlogUtil.getArticlesByYourself({author:user.user_name},function(err,result){
        ep.emit('getArticles',result);
    });
    Post.getCategoryByUserId({user_id:user.id},function(err,result){
        ep.emit('getCategories',result);
    });
    BlogUtil.getFriendLinksByUserId({'user_id':user.id},function(err,result){
        ep.emit('getFriendLinks',result);
    });

}
function pSettings(req,res,next){//个人设置
        res.render('pSettings');
}

function home(req,res,next){//每个人的主页
    var author=req.params.username;
    User.getByName(author,function(err,rows){
        if(err||rows.length<=0){
            return res.redirect('/');
        }

        var ep=new eventProxy();
        ep.all('getArticles','archive','getUserInfo','getCategories','getFriendLinks',function(articles,archive,userInfo,categories,friendLinks){
            res.render('home',{'articles':articles,'archive':archive,'userInfo':userInfo,'categories':categories,'friendLinks':friendLinks,'prePaginationUrl':'/'+author+'/page/0/',nextPaginationUrl:'/'+author+'/page/2'});
        });
        BlogUtil.archiveByYourself(author,function (err,result) {
            ep.emit('archive',result);
        });
        BlogUtil.paginationByYourself({'author':author,'pageNum':1},function(err,result){
            ep.emit('getArticles',result);
        });
        Post.getCategoryByUsername({user_name:author},function(err,result){
            ep.emit('getCategories',result);
        });
        
        BlogUtil.getFriendLinksByUserName({userName:author}, function (err,result) {
            ep.emit('getFriendLinks',result);
        });
        ep.emit('getUserInfo',rows[0]);
    });

}

function queryArticlesByIndexArchive(req,res,next){
    var ep=new eventProxy();
    var date=req.params.date;
    ep.all('getArticles','archive',function(articles,archive){
        res.render('index',{'articles':articles,'archive':archive,'prePaginationUrl':'/archive/'+date+'/page/','nextPaginationUrl':'/archive/'+date+'/page/2/'});
    });
    BlogUtil.paginationByDate({'date':req.params.date,pageNum:1},function (err,result) {
        ep.emit('getArticles',result);
    });
    BlogUtil.archive(function(err,result){
        ep.emit('archive',result);
    });
}

function queryArticlesByHomeArchive(req,res,next){
    var ep = new eventProxy();
    var author=req.params.username;
    var date=req.params.date;
    ep.all('getArticles', 'archive','getUserInfo','getCategories','getFriendLinks', function (articles, archive,userInfo,categories,friendLinks) {
        res.render('home', {'articles': articles, 'archive': archive,'userInfo':userInfo,'categories':categories,'friendLinks':friendLinks,'prePaginationUrl':'/'+author+'/archive/'+date+'/page/','nextPaginationUrl':'/'+author+'/archive/'+date+'/page/2/'});
    });
    BlogUtil.archiveByYourself(author,function (err, result) {
        ep.emit('archive', result);
    });

    BlogUtil.paginationByYourselfByDate({'author':author,'date':date,'pageNum':1},function (err, result) {
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

function queryArticleDetail(req,res,next){
    var articleId=req.params.articleId;
    var author=req.params.username;
    var ep=eventProxy();
    ep.all('getArticle','getReply',function(article,replies){
        res.render('articleDetail',{'article':article,'replies':replies});
    });

    BlogUtil.updateArticleVisitNum(articleId,function(err,result){
        if(err){
            req.flash('error',err);
            res.redirect('/errPage');
        }
    });
    Post.queryDetail({id:articleId,'author':author},function(err,result){
        if(err){
            req.flash('error',err);
            res.redirect('/errPage');
        }else{
            ep.emit('getArticle',result);
        }
    });

    reply.getRepliesByArticleId(articleId,function(err,result){
        if(err){
            req.flash('error',err);
            res.redirect('/errPage');
        }else{
            ep.emit('getReply',result);
        }
    });
}

function queryArticlesByHomeCategory(req,res,next){
    var ep = new eventProxy();
    var author=req.params.username;
    var categoryId=req.params.categoryId;
    ep.all('getArticles', 'archive','getUserInfo','getCategories','getFriendLinks', function (articles, archive,userInfo,categories,friendLinks) {
        res.render('home', {'articles': articles, 'archive': archive,'userInfo':userInfo,'categories':categories,'friendLinks':friendLinks,'prePaginationUrl':'/'+author+'/category/'+categoryId+'/page/','nextPaginationUrl':'/'+author+'/category/'+categoryId+'/page/2/'});
    });
    BlogUtil.archiveByYourself(author,function (err, result) {
        ep.emit('archive', result);
    });

    BlogUtil.paginationByCategory({'category_id':categoryId,'pageNum':1},function (err, result) {
        ep.emit('getArticles', result);
    });

    User.getByName(author,function(err,result){
        ep.emit('getUserInfo',result[0]);
    });
    Post.getCategoryByUsername({user_name:author},function(err,result){
        ep.emit('getCategories',result);
    });
    BlogUtil.getFriendLinksByUserName({userName:author}, function (err,result) {
        ep.emit('getFriendLinks',result);
    });
}
exports.index=index;
exports.home=home;
exports.queryArticlesByIndexArchive=queryArticlesByIndexArchive;
exports.queryArticlesByHomeArchive=queryArticlesByHomeArchive;
exports.queryArticleDetail=queryArticleDetail;
exports.bSettings=bSettings;
exports.pSettings=pSettings;
exports.queryArticlesByHomeCategory=queryArticlesByHomeCategory;

