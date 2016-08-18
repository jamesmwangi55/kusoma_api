var express = require('express');

var routes = function(University, passport){
    var universityRouter = express.Router();
    var universityController = require('../controllers/universityController.js')(University, passport);

    // university collection routes
    universityRouter.route('/')
        .post(universityController.isLoggedIn, universityController.create)
        .get(universityController.list);

    // tie to university middleware
    universityRouter.use('/:universityId', universityController.findUniversityById);    

    // single university routes
    universityRouter.route('/:universityId')
        .get(universityController.read)
        .put([universityController.isLoggedIn], universityController.update)
        .patch([universityController.isLoggedIn], universityController.patch)
        .delete([universityController.isLoggedIn], universityController.remove);

        // return router
        return universityRouter;
        
}

module.exports = routes;