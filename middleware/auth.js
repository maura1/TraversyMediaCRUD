//Protecting the routes, eg, that someone cannot use the app without signing in
//Coding the middleware, and we can export it elsewhere. We can plug the middleware into various routes as an extra argument.

module.exports = {
    ensureAuth: function (req,res,next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: function (req,res,next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}