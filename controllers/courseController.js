var courseController = function(Course, passport){

    var create = function(req, res){
        var course = new Course(req.body);
        course.university = req.params.universityId;

        if(!req.body.name){
            res.status(400);
            res.send({'msg':'Name is required'});
        } else {
            course.save(function(err){
                if(err){
                    res.status(500).send({msg: err})
                } else {
                    res.status(201);
                    res.send(course);
                }
            });
            
        }
    }

    var list = function(req, res){
        var query = {};
        if(req.query.code){
            query.code = req.query.code;
            Course.find({university: req.params.universityId, code: query.code}, function (err, courses) {
                if(err){
                    res.status(500).send({msg: err});
                } else {
                    var returnCourses = new Array();
                    courses.forEach(function(element, index, array){
                        var newCourse  = element.toJSON();
                        newCourse.links = {};
                        newCourse.links.self = 'http://' + req.headers.host + '/api/courses/' + newCourse.university + '/' + newCourse._id;
                        newCourse.links.resources = 'http://' + req.headers.host + '/api/resources/' + newCourse._id;
                        newCourse.links.university = 'http://' + req.headers.host + '/api/universities/' + newCourse.university;
                        newCourse.links.universities = 'http://' + req.headers.host + '/api/universities/';
                        returnCourses.push(newCourse);
                    })
                    res.json(returnCourses);
                }
            })
        } else if(req.query.name) {
            query.name = req.query.name;
             Course.find({university: req.params.universityId, name: query.name}, function (err, courses) {
                if(err){
                    res.status(500).send({msg: err});
                } else {
                    var returnCourses = new Array();
                    courses.forEach(function(element, index, array){
                        var newCourse  = element.toJSON();
                        newCourse.links = {};
                        newCourse.links.self = 'http://' + req.headers.host + '/api/courses/' + newCourse.university + '/' + newCourse._id;
                        newCourse.links.resources = 'http://' + req.headers.host + '/api/resources/' + newCourse._id;
                        newCourse.links.university = 'http://' + req.headers.host + '/api/universities/' + newCourse.university;
                        newCourse.links.universities = 'http://' + req.headers.host + '/api/universities/';
                        returnCourses.push(newCourse);
                    })
                    res.json(returnCourses);
                }
            })
        } else {
             Course.find({university: req.params.universityId}, function (err, courses) {
                if(err){
                    res.status(500).send({msg: err});
                } else {
                    var returnCourses = new Array();
                    courses.forEach(function(element, index, array){
                        var newCourse  = element.toJSON();
                        newCourse.links = {};
                        newCourse.links.self = 'http://' + req.headers.host + '/api/courses/' + newCourse.university + '/' + newCourse._id;
                        newCourse.links.resources = 'http://' + req.headers.host + '/api/resources/' + newCourse._id;
                        newCourse.links.university = 'http://' + req.headers.host + '/api/universities/' + newCourse.university;
                        newCourse.links.universities = 'http://' + req.headers.host + '/api/universities/';
                        returnCourses.push(newCourse);
                    })
                    res.json(returnCourses);
                }
            })
        } 
    }

    var read = function(req, res){
        var returnCourse = req.course.toJSON();
        returnCourse.links = {};
        // var newLink = 'http://' + req.headers.host + '/api/books/?genre=' + returnBook.genre;
        // returnUnviersity.links.FilterByThisGenre = newLink.replace(' ', '%20');
        returnCourse.links.courses = 'http://' + req.headers.host + '/api/courses/'+ returnCourse.university;
        returnCourse.links.university = 'http://' + req.headers.host + '/api/universities/'+ returnCourse.university;
        returnCourse.links.universities = 'http://' + req.headers.host + '/api/universities/';
        returnCourse.links.resources = 'http://' + req.headers.host + '/api/resources/'+ returnCourse._id;
        res.json(returnCourse);
    }

    var update = function(req, res){
        Course.findById(req.params.courseId, function (err, course) {
                req.course.name = req.body.name;
                req.course.code = req.body.code;
                req.course.save(function(err){
                    if(err){
                        res.status(500).send({msg: err});
                    } else {
                        res.json(req.course);
                    }
                });
                //res.json(req.course);
        });
    }

    var patch = function(req, res){
        if(req.body._id){
            delete  req.body._id;   
        }

        for(var p in req.body){
            req.course[p] = req.body[p];
        }

        req.course.save(function(err){
                    if(err){
                        res.status(500).send({msg: err});
                    } else {
                        res.json(req.course);
                    }
            });
    }

    var remove = function(req, res){
        req.course.remove(function(err){
            if(err){
                res.status(500).send({msg: err});
            } else {
                res.status(204).send({msg: 'Removed Book'});
            }
        });
    }
    
    // course middleware
    var findCourseById = function(req, res, next){
        Course.findById(req.params.courseId, function (err, course) {
            if(err){
                res.status(500).send({msg: err});
            } else if (course) {
                req.course = course;
                next();
            } else {
                res.status(404).send({'msg': 'no course found'});
            }
        });
    }

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
        // if they aren't redirect them to the home page
        res.send({'msg':'Login to perfom function'});
    }

    return {
        findCourseById: findCourseById,
        create: create,
        list: list, 
        read: read,
        update: update,
        patch: patch,
        remove: remove,
        isLoggedIn: isLoggedIn
    }

}

module.exports = courseController;