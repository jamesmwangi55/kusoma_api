var universityController = function(University, passport){

    var create = function(req, res){
        var university = new University(req.body);

        if(!req.body.name){
            res.status(400);
            res.send({'msg':'Name is required'});
        } else {
            university.save(function(err){
                if(err){
                    res.status(500).send({msg: err})
                } else {
                    res.status(201);
                    res.send(university);
                }
            });
            
        }
    }

    var list = function(req, res){
        University.find(function (err, universities) {
            if(err){
                res.status(500).send({msg: err});
            } else {
                var returnUniversities = new Array();
                universities.forEach(function(element, index, array){
                    var newUnviversity  = element.toJSON();
                    newUnviversity.links = {};
                    newUnviversity.links.self = 'http://' + req.headers.host + '/api/universities/' +newUnviversity._id;
                    newUnviversity.links.courses = 'http://' + req.headers.host + '/api/courses/' +newUnviversity._id;
                    returnUniversities.push(newUnviversity);
                })
                res.json(returnUniversities);
            }
        })
    }

    var read = function(req, res){
        var returnUniversity = req.university.toJSON();
        returnUniversity.links = {};
        // var newLink = 'http://' + req.headers.host + '/api/books/?genre=' + returnBook.genre;
        // returnUnviersity.links.FilterByThisGenre = newLink.replace(' ', '%20');
        returnUniversity.links.universities = 'http://' + req.headers.host + '/api/universities'
        returnUniversity.links.courses = 'http://' + req.headers.host + '/api/courses/' +returnUniversity._id;
        res.json(returnUniversity);
    }

    var update = function(req, res){
        University.findById(req.params.universityId, function (err, university) {
                req.university.name = req.body.name;
                req.university.save(function(err){
                    if(err){
                        res.status(500).send({msg: err});
                    } else {
                        res.json(req.university);
                    }
                });
                //res.json(req.university);
        });
    }

    var patch = function(req, res){
        if(req.body._id){
            delete  req.body._id;   
        }

        for(var p in req.body){
            req.university[p] = req.body[p];
        }

        req.university.save(function(err){
                    if(err){
                        res.status(500).send({msg: err});
                    } else {
                        res.json(req.university);
                    }
            });
    }

    var remove = function(req, res){
        req.university.remove(function(err){
            if(err){
                res.status(500).send({msg: err});
            } else {
                res.status(204).send({msg: 'Removed Book'});
            }
        });
    }
    
    // university middleware
    var findUniversityById = function(req, res, next){
        University.findById(req.params.universityId, function (err, university) {
            if(err){
                res.status(500).send({msg: err});
            } else if (university) {
                req.university = university;
                next();
            } else {
                res.status(404).send({'msg': 'no university found'});
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
        findUniversityById: findUniversityById,
        create: create,
        list: list, 
        read: read,
        update: update,
        patch: patch,
        remove: remove,
        isLoggedIn: isLoggedIn
    }

}

module.exports = universityController;