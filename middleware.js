module.exports.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('error', 'You are not logged in');
        if (req.session){
            req.session.returnTo = req.originalUrl || req.url;
        }
        
        res.redirect('/login')
    }
}