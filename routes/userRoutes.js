var express = require('express');

var routes = function(User){
    var userRouter = express.Router();
    var userController = require('../controllers/userController.js')(User);

    // user collection routes
    userRouter.route('/')
        .get(userController.list);

    userRouter.route('/register')
        .post(userController.register);

    userRouter.route('/login')
        .post(userController.login);    

    userRouter.route('/logout')
        .get(userController.logout)

    // tie to user middleware
    userRouter.use('/:userId', userController.findUserById);    

    // single user routes
    userRouter.route('/:userId')
        .get(userController.read)
        .put(userController.update)
        .patch(userController.patch)
        .delete(userController.remove);

        return userRouter;
        
}

module.exports = routes;