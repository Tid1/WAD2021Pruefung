var express = require('express');
var router = express.Router();

var mongo = require("../mongoDBClient");


/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.query != null) {
        if (req.query.username && req.query.password && req.query.username !== "" && req.query.password !== "") {
            mongo().collection("users").findOne({
                username: req.query.username,
                password: req.query.password
            }, function (err, result) {
                if (result != null ) {
                    res.status(200).json(result);
                } else {
                    res.status(401).end();
                }
            })
        }
    } else {
        mongo().collection("users").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).json(result)
        });
    }
});

router.post('/', function (req, res, next) {
    if (req.body != null) {
        let userToInsert = {
            username: req.body.username, password: req.body.password, firstname: req.body.firstname,
            lastname: req.body.lastname, isAdmin: req.body.isAdmin
        };

        mongo().collection("users").findOne(userToInsert, function (err, result) {
            if (err) throw err
            if (result != null) {
                res.status(400);
            } else {
                mongo().collection("users").insertOne(userToInsert, function (err, result) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    res.status(200);
                })
            }
        })
    }

    res.end();
});

router.delete('/', function (req, res, next) {
    if (req.body != null) {
        mongo().collection("users").deleteOne(req.body, function (err, result) {
            if (err) throw err
            res.status(200);
        });
    } else {
        res.status(400);
    }
    res.end();
});


module.exports = router;
