module.exports = function(req, res, next) {
    if (!req.user) {
        req.flash('error', 'you must be logged in to view this page');
        res.redirect('/auth/login'); //whoa, not so fast
    } else {
        next(); //good to go proceed as planned
    }
}
