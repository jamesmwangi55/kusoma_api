var resourceController = function (Resource, passport) {

    var Course = require('../models/courseModel.js');
    var azure = require('azure-storage');
    var blobSvc = azure.createBlobService();
    var multiparty = require('multiparty');
    var fs = require('fs');
    var form = new multiparty.Form();
    var inspect = require('util').inspect;
    var fileType = require('file-type');

    var Busboy = require('busboy');
    var pauseStream = require('pause-stream');

    var containerName;

    if (process.env.ENV == 'Test') {
        containerName = 'test-container'
    } else {
        containerName = 'kusoma-container'
    }

    blobSvc.createContainerIfNotExists(containerName, function (err, result, response) {
        if (err) {
            console.log("Couldn't create container %s", containerName);
            console.error(err);
        } else {
            if (result) {
                console.log('Container %s created', containerName);
            } else {
                console.log('Container %s already exists', containerName);
            }
        }
    });

    var create = function (req, res) {
        var busboy = new Busboy({ headers: req.headers });
        var resource = new Resource(req.body);
        resource.course = req.params.courseId;
        // resource.university = req.body.university;
        // find course first in order to get the university ID
        Course.findById(req.params.courseId, function (err, course) {
            console.log('we are here');
            if (err) {

            } else {
                console.log('then we come here');
                busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
                    function readFirstBytes() {

                        var chunk = file.read(5);
                        if (!chunk) {
                            return file.once('readable', readFirstBytes);
                        }

                        var blobStream = blobSvc.createWriteStreamToBlockBlob(containerName, filename, function (error, result, response) {
                            if (error) {
                                res.send({ 'msg': ' Blob create: error ' });
                            } else {
                                console.log('uploading complete')
                                console.log(response);
                                //console.log(req)
                                // create the resource
                                resource.university = course.university;
                                resource.name = filename;
                                resource.url = "https://kusoma.blob.core.windows.net/" + containerName + "/" + filename.replace(/ /g, "%20");
                                resource.save(function (err) {
                                    if (err) {
                                        res.status(500).send({ msg: err })
                                    } else {
                                        res.status(201);
                                        res.send(resource);
                                    }
                                });
                            }
                        });

                        file.unshift(chunk);
                        file.pipe(blobStream);
                    }

                    readFirstBytes();

                });

                busboy.on('field', function (fieldname, val) {
                    /*get all non-file field here*/
                    //console.log(fieldname);
                });

                // Listen for event when Busboy is finished parsing the form.
                // busboy.on('finish', function () {
                //     res.statusCode = 200;
                //     res.end();
                // });

                req.pipe(busboy);
            }
        });
    }

    var list = function (req, res) {
        Resource.find({ course: req.params.courseId }, function (err, resources) {
            if (err) {
                res.status(500).send({ msg: err });
            } else {
                var returnResources = new Array();
                resources.forEach(function (element, index, array) {
                    var newResource = element.toJSON();
                    newResource.links = {};
                    newResource.links.self = 'http://' + req.headers.host + '/api/resources/' + newResource.course + '/' + newResource._id;
                    newResource.links.course = 'http://' + req.headers.host + '/api/courses/' + newResource.university + '/' + newResource.course;
                    newResource.links.courses = 'http://' + req.headers.host + '/api/courses/' + newResource.university;
                    newResource.links.university = 'http://' + req.headers.host + '/api/universities/' + newResource.university;
                    newResource.links.universities = 'http://' + req.headers.host + '/api/universities/';
                    returnResources.push(newResource);
                })
                res.json(returnResources);
            }
        })
    }

    var read = function (req, res) {
        var returnResource = req.resource.toJSON();
        returnResource.links = {};
        // var newLink = 'http://' + req.headers.host + '/api/books/?genre=' + returnBook.genre;
        // returnUnviersity.links.FilterByThisGenre = newLink.replace(' ', '%20');
        returnResource.links.resources = 'http://' + req.headers.host + '/api/resources/' + returnResource.course
        returnResource.links.course = 'http://' + req.headers.host + '/api/courses/' + returnResource.university + '/' + returnResource.course;
        returnResource.links.courses = 'http://' + req.headers.host + '/api/courses/' + returnResource.university;
        returnResource.links.university = 'http://' + req.headers.host + '/api/universities/' + returnResource.university;
        returnResource.links.universities = 'http://' + req.headers.host + '/api/universities/';
        // res.download(blobStream);
        res.json(returnResource);
    }

    var update = function (req, res) {
        Resource.findById(req.params.resourceId, function (err, resource) {
            req.resource.name = req.body.name;
            req.resource.save(function (err) {
                if (err) {
                    res.status(500).send({ msg: err });
                } else {
                    res.json(req.resource);
                }
            });
            //res.json(req.resource);
        });
    }

    var patch = function (req, res) {
        if (req.body._id) {
            delete req.body._id;
        }

        for (var p in req.body) {
            req.resource[p] = req.body[p];
        }

        req.resource.save(function (err) {
            if (err) {
                res.status(500).send({ msg: err });
            } else {
                res.json(req.resource);
            }
        });
    }

    var remove = function (req, res) {
        req.resource.remove(function (err) {
            if (err) {
                res.status(500).send({ msg: err });
            } else {
                res.status(204).send({ msg: 'Removed Book' });
            }
        });
    }

    // resource middleware
    var findResourceById = function (req, res, next) {
        Resource.findById(req.params.resourceId, function (err, resource) {
            if (err) {
                res.status(500).send({ msg: err });
            } else if (resource) {
                req.resource = resource;
                next();
            } else {
                res.status(404).send({ 'msg': 'no resource found' });
            }
        });
    }

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
        // if they aren't redirect them to the home page
        res.send({ 'msg': 'Login to perfom function' });
    }

    return {
        findResourceById: findResourceById,
        create: create,
        list: list,
        read: read,
        update: update,
        patch: patch,
        remove: remove,
        isLoggedIn: isLoggedIn
    }

}

module.exports = resourceController;