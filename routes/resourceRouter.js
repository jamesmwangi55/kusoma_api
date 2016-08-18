var express = require('express');
var timeout = require('connect-timeout');
var longTimeout = timeout(1200000)

var routes = function(Resource, passport){
    var resourceRouter = express.Router();
    var resourceController = require('../controllers/resourceController.js')(Resource, passport);

    // resource collection routes
    resourceRouter.route('/:courseId')
        // add this middlware once testing is complete resourceController.isLoggedIn
        .post([longTimeout], resourceController.create)
        .get(resourceController.list);

    // tie to resource middleware
    resourceRouter.use('/:courseId/:resourceId', resourceController.findResourceById);    

    // single resource routes
    resourceRouter.route('/:courseId/:resourceId')
        .get(resourceController.read)
        .put([resourceController.isLoggedIn], resourceController.update)
        .patch([resourceController.isLoggedIn], resourceController.patch)
        .delete([resourceController.isLoggedIn], resourceController.remove);

        // return router
        return resourceRouter;
        
}

module.exports = routes;