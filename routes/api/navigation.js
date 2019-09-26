const express = require('express');
const router = express.Router();
const passport = require('passport'); // 引入token请求时候携带，最后一步啦
const Navgitemd = require('../../models/Navgite.js'); //引入模型

//导航栏数据
router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    //console.log(req.body);
    const newObject = {};
    newObject.name = req.body.name;
    newObject.hyperlins = req.body.hyperlins;
    if (req.body.secondarydata) newObject.secondarydata = JSON.parse(req.body.secondarydata);
    //console.log(newObject)
    Navgitemd(newObject).save()
        .then(info => {
            return res.json(info);
        });
});
router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Navgitemd.findOneAndDelete({_id: req.params.id})
        .then( info => {
            info.save()
                .then( info => {
                    return res.json(info)
                })
        })
});

router.post('/edit/:id',passport.authenticate('jwt',{session:false}),(req,res) => {
    const newObject = {};
    newObject.name = req.body.name;
    newObject.hyperlinks = req.body.hyperlinks;
    if (req.body.secondarydata) newObject.secondarydata = JSON.parse(req.body.secondarydata);
    //console.log(newObject);
    Navgitemd.findOneAndUpdate(
        {_id: req.params.id},
        {$set: newObject},
        {new: true}
    )
        .then(info => {
           return res.json(info);
        })
});

//查询接口
router.get('/', (req, res) => {
    Navgitemd.find()
        .then(info => {
            res.json(info)
        })
})

module.exports = router;