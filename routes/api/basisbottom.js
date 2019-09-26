const express = require('express');
const router = express.Router();
const passport = require('passport');
const Basisbottomc = require('../../models/Basisbottom');

router.get('/', (req, res) => {
    Basisbottomc.find()
        .then(info =>{
            res.status(200).json(info);
        })
});

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    const bootominfo = {};
    if (req.body.name){
        bootominfo.name = req.body.name
    }
    if (req.body.hyperlink){
        bootominfo.hyperlink = req.body.hyperlink
    }
    new Basisbottomc(bootominfo).save()
        .then(info =>{
            res.json(info)
        })
});

router.delete('/delete/:id',passport.authenticate('jwt',{session: false}),(req,res) => {
    Basisbottomc.findOneAndDelete({_id:req.params.id})
        .then(info =>{
            info.save()
                .then(info => {
                    res.json(info)
                })
        })
});

module.exports = router;