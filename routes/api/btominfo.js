const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})
const BtomInfoc = require('../../models/BtomInfo');

router.get('/',(req,res) =>{
    const Urldz = req.headers['host']
    const pjdzhi = 'https://' + Urldz
    BtomInfoc.find()
        .then(info =>{
            if (info.length > 0){
                res.status(200).json({
                    weburl:info[0].weburl,
                    telephone:info[0].telephone,
                    address:info[0].address,
                    icp:info[0].icp,
                    erweima:pjdzhi + info[0].erweima,
                    _id: info[0]._id
                })
            }
        })
})

router.post('/add',passport.authenticate('jwt',{session:false}),(req,res) =>{
    const btominfoc = {}
    if (req.body.telephone) btominfoc.telephone = req.body.telephone;
    if (req.body.weburl) btominfoc.weburl = req.body.weburl;
    if (req.body.address) btominfoc.address = req.body.address;
    if (req.body.icp) btominfoc.icp = req.body.icp;
    if (req.body.erweima) btominfoc.erweima = req.body.erweima
    new BtomInfoc(btominfoc).save()
        .then(info =>{
            res.status(200).json(info)
        })
    //console.log(btominfoc)
})

router.post('/edit/:id',passport.authenticate('jwt',{session:false}),(req,res) =>{
    const btominfoc = {}
    if (req.body.telephone) btominfoc.telephone = req.body.telephone;
    if (req.body.weburl) btominfoc.weburl = req.body.weburl;
    if (req.body.address) btominfoc.address = req.body.address;
    if (req.body.icp) btominfoc.icp = req.body.icp;
    if (req.body.erweima) btominfoc.erweima = req.body.erweima.substr(21);
    //console.log(btominfoc)
    BtomInfoc.findOneAndUpdate(
        {_id: req.params.id},
        {$set: btominfoc},
        {new: true}
    )
        .then(info =>{
            res.status(200).json(info)
        })
})

router.post('/qrcode',passport.authenticate('jwt',{session: false}),upload.single('erweima'),(req,res) =>{
    fs.readFile(req.file.path, (err, data) => {
        if (err) {
            return res.send('上传失败');
        }
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        let extname = req.file.mimetype.split('/')[1] //图片后缀
        let keepname = time + '.' + extname;
        fs.writeFile(path.join(__dirname, '../../public/btominfo/image/' + keepname), data, (err) => {
            if (err) {
                return res.send(err)
            }
            var erweimag = '/btominfo/image/' + keepname;
            res.json({img: erweimag})
        })
    })
})

module.exports = router;