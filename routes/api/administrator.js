const express = require('express');
const router = express.Router();
const passport = require('passport');
const Administratork = require('../../models/Administrator');

router.get('/',(req,res) => {
    res.json('测试');
});

router.post('/add',passport.authenticate('jwt',{session:false}),(req,res) => {
    const Admincollection = {};
    Admincollection.user = req.body.user;
    Admincollection.email = req.body.email;
    Admincollection.identity = req.body.identity;
    Admincollection.password = req.body.password;
    //console.log(Admincollection)
    // new Administratork(Admincollection).save()
    //     .then(info => {
    //         console.log(info)
    //     })
})

module.exports = router;