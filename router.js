/**
 * Created by luzhen on 14-11-17.
 */
var sign=require('./controller/sign');
var site=require('./controller/site');
var article=require('./controller/article');
var filter=require('./controller/filter');
var reply=require('./controller/reply');
var pagination=require('./controller/pagination');
var pSettings=require('./controller/pSetting');
var bSettings=require('./controller/bSetting');
var express=require('express');
var router = express.Router();

    //页面访问控制
    router.get('/login',filter.checkNotLogin);
    router.post('/login',filter.checkNotLogin);
    router.get('/logout', filter.checkLogin);
    router.get('/register', filter.checkNotLogin);
    router.post('/register', filter.checkNotLogin);
    router.get('/post',filter.checkLogin);
    router.post('/post',filter.checkLogin);
    router.post('/uploadImg',filter.checkLogin);
    router.get('/pSettings',filter.checkLogin);
    router.get('/bSettings',filter.checkLogin);
    router.post('/headSettings',filter.checkLogin);
    router.post('/infoSettings',filter.checkLogin);
    router.get('/article/edit/:articleId/',filter.checkLogin);
    router.post('/article/edit/:articleId/',filter.checkLogin);
    router.get('/article/delete/:articleId/',filter.checkLogin);
    router.post('/category/add/',filter.checkLogin);
    router.post('/friendLinks/add/',filter.checkLogin);
    router.get('/friendLinks/delete/:friendLinkId/',filter.checkLogin);
    router.get('/category/delete/:categoryId/',filter.checkLogin);
    router.post('/category/edit/:categoryId/',filter.checkLogin);



    router.get('/page/:pageNum?',pagination.indexPagination);
    router.get('/:username/page/:pageNum?',pagination.homePagination);
    router.get('/:username/archive/:date/page/:pageNum?',pagination.homeArchivePagination);
    router.get('/archive/:date/page/:pageNum?',pagination.indexArchivePagination);
    router.get('/:username/category/:categoryId/page/:pageNum?',pagination.homeCategoryPagination);

    router.get('/',site.index);
    router.get('/:username/home',site.home);
    router.get('/archive/:date/',site.queryArticlesByIndexArchive);
    router.get('/:username/archive/:date',site.queryArticlesByHomeArchive);
    router.get('/article/detail/:articleId',site.queryArticleDetail);
    router.get('/article/detail/:articleId/:messageId',site.queryArticleDetailFromMessage);
    router.get('/:username/category/:categoryId/',site.queryArticlesByHomeCategory);
    router.post('/:username/:articleId/reply',reply.addReply);

    router.get('/login',sign.showLogin);
    router.post('/login',sign.login);

    router.get('/logout',sign.logout);

    router.get('/register',sign.showRegister);
    router.post('/register',sign.register);


    router.get('/post',article.showPost);
    router.post('/post',article.post);

    router.get('/article/edit/:articleId/',article.showEdit);
    router.post('/article/edit/:articleId/',article.edit);
    router.get('/article/delete/:articleId/',bSettings.deleteArticle);

    router.get('/pSettings',site.pSettings);
    router.get('/bSettings',site.bSettings);


    router.post('/infoSettings',pSettings.userInfoSet);
    router.post('/headSettings',pSettings.headImgSet);

    router.post('/category/add/',bSettings.addCategory);
    router.post('/friendLinks/add/',bSettings.addFriendLink);
    router.get('/friendLinks/delete/:friendLinkId/',bSettings.deleteFriendLink);
    router.get('/category/delete/:categoryId/',bSettings.deleteCategory);
    router.post('/category/edit/:categoryId/',bSettings.editCategory);

    router.get('/myMessage',site.showMessage);
module.exports=router;