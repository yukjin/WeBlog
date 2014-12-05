/**
 * Created by luzhen on 14-11-25.
 */

function checkLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}
function checkNotLogin(req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}

exports.checkLogin=checkLogin;
exports.checkNotLogin=checkNotLogin;