let express = require('express');
let router = express.Router();

const mongo = require("../mongoDBClient");
const {ObjectId} = require("mongodb");


router.get('/', function (req, res, next) {
    if (req.query?.userID != null) {
        let userID = req.query.userID;
        mongo().collection("contacts").find({owner: userID}).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        });
    } else {
        mongo().collection("contacts").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        });
    }
});

router.get('/:id', function (req, res, next) {
    if (req.params?.id != null) {
        let id = req.params.id;
        mongo().collection("contacts").findOne({"_id": ObjectId(id)}, function (err, result) {
            if (err) throw err;
            res.status(200).json(result);
        })
    } else {
        res.status(400).end();
    }
});

router.put('/:id', function (req, res, next) {
    if (req.params?.id != null && req.body != null) {
        let id = req.params.id;
        let userToUpdate = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            street: req.body.street,
            plz: req.body.plz,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            isPrivate: req.body.isPrivate,
            owner: req.body.owner,
            lon: req.body.lon,
            lat: req.body.lat
        }
        mongo().collection("contacts").replaceOne({"_id": ObjectId(id)}, userToUpdate, function (err, result) {
            if (err) throw err;
            res.status(204).end();
        });
    }
});

router.delete('/:id', function (req, res, err) {
    if (req.params?.id != null) {
        let id = req.params.id;
        console.log(id)
        mongo().collection("contacts").deleteOne({"_id": ObjectId(id)}, function (err, result) {
            if (err) throw err;
            if (result.deletedCount > 0){
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        });
    }

    //res.end();
})

router.post("/", function (req, res, next) {
    if (req.body != null) {
        let contactToInsert = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            street: req.body.street,
            plz: req.body.plz,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            isPrivate: req.body.isPrivate,
            owner: req.body.owner,
            lon: req.body.lon,
            lat:  req.body.lat
        }
        console.log(contactToInsert);
        mongo().collection("contacts").findOne(contactToInsert, function (err, result) {
            if (err) throw err;
            if (result != null) {
                res.status(400).end();
            } else {
                mongo().collection("contacts").insertOne(contactToInsert, function (err, result) {
                    if (err) throw err;
                    let contactToInsertID = contactToInsert._id;
                    res.status(201).json(contactToInsertID);
                });
            }
        });
    }
});

module.exports = router;
