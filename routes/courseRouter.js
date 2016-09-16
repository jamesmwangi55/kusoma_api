var express = require('express');

var routes = function(Course, passport){
    var courseRouter = express.Router();
    var courseController = require('../controllers/courseController.js')(Course, passport);

    // course collection routes
    courseRouter.route('/:universityId')
        .post(courseController.create)
        .get(courseController.list);

    // tie to course middleware
    courseRouter.use('/:universityId/:courseId', courseController.findCourseById);    

    // single course routes
    courseRouter.route('/:universityId/:courseId')
        .get(courseController.read)
        .put(courseController.update)
        .patch(courseController.patch)
        .delete(courseController.remove);

        // return router
        return courseRouter;
        
}

module.exports = routes;