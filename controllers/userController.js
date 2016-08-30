var passport = require('passport');
var userController = function (User) {

    var register = function (req, res, next) {
        // User.find(function (err, users) {
        //     if (users.length == 0) {
        //         User.register(new User({ username: "jamesmwangi55@gmail.com" }), "mojeskijamo123", function (err, user) {
        //             if (err) {
        //                 res.status(500).send(err);
        //             }

        //             passport.authenticate('local')(req, res, function () {
        //                 req.session.save(function (err) {
        //                     if (err) {
        //                         return next(err);
        //                     }
        //                     res.send(user);
        //                 });
        //             });
        //         })
        //     }
        // })
        User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
            if (err) {
                res.status(500).send(err);
            }

            passport.authenticate('local')(req, res, function () {
                req.session.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.send(user);
                });
            });

        });
    }

    var login = function (req, res) {
        passport.authenticate('local')(req, res, function (err, user) {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                } else {
                    res.send(req.user);
                }
            });

        })
    }

    var logout = function (req, res) {
        req.logout();
        res.send('logged out');
    }


    var list = function (req, res) {

    }


    var read = function (req, res) {

    }

    var update = function (req, res) {

    }

    var patch = function (req, res) {

    }

    var remove = function (req, res) {

    }

    // user middleware
    var findUserById = function (req, res, next) {
        User.findById(req.params.userId, function (err, user) {
            if (err) {
                res.status(500).send(err);
            } else if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).send('no user found');
            }
        });
    }

    return {
        findUserById: findUserById,
        register: register,
        login: login,
        logout: logout,
        list: list,
        read: read,
        update: update,
        patch: patch,
        remove: remove
    }

}

module.exports = userController;