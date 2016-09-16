var express = require('express');

var routes = function(University, passport){
    var universityRouter = express.Router();
    var universityController = require('../controllers/universityController.js')(University, passport);

    // university collection routes
    universityRouter.route('/')
        .post( universityController.create)
        .get(universityController.list);

    // tie to university middleware
    universityRouter.use('/:universityId', universityController.findUniversityById);    

    // single university routes
    universityRouter.route('/:universityId')
        .get(universityController.read)
        .put(universityController.update)
        .patch(universityController.patch)
        .delete(universityController.remove);

        // return router
        return universityRouter;
        
}

module.exports = routes;