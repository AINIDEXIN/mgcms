const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const multer = require('multer');
const ClientServers = require('../../models/ClientServer');
const upload = multer({dest: 'uploads/'})

router.get('/', (req, res) => {
    res.header("Content-Type", "application/json;charset=utf-8");
    const Urldz = req.headers['host']
    const pjdzhi = 'https://' + Urldz
    ClientServers.find()
        .then(info => {
            if (info.length > 0) {
                const newArray = info.map((item) => {
                    return {
                        title: item.title,
                        content: item.content,
                        ClientImg: pjdzhi + item.ClientImg,
                        _id: item._id
                    }
                })
                return res.json(newArray);
            } else {
                res.json(info)
            }
        })
})

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    const clienTdata = {}
    if (req.body.title) clienTdata.title = req.body.title;
    if (req.body.content) clienTdata.content = req.body.content;
    if (req.body.ClientImg) clienTdata.ClientImg = req.body.ClientImg;
    new ClientServers(clienTdata).save()
        .then(info => {
            res.json(info)
        })
})

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    ClientServers.findOne({_id: req.params.id})
        .then(info => {
            
            if (info.ClientImg) {
                   const productImg = info.ClientImg.substr(15);
                   
                fs.exists(path.join(__dirname, '../../public/clients/image/' + productImg), (data) => {
                    if (data) {
                        ClientServers.findOneAndDelete({_id: req.params.id})
                            .then(info => {
                                info.save()
                                    .then(info => {
                                        fs.unlink(path.join(__dirname, '../../public/clients/image/' + productImg), (err) => {
                                            if (err) throw err;
                                        });
                                        res.json(info);
                                    })
                            })
                    } else {
                        ClientServers.findOneAndDelete({_id: req.params.id})
                            .then(info => {
                                info.save()
                                    .then(info => {
                                        res.json(info);
                                    })
                            })
                    }
                })
            }
            else {
                ClientServers.findOneAndDelete({_id: req.params.id})
                    .then(info => {
                        info.save()
                            .then(info => {
                                res.json(info);
                            })
                    })
            }

        })
})

router.get('/:id',(req,res) =>{
    ClientServers.findOne({_id:req.params.id})
        .then(info =>{
            res.json(info)
        })
        .catch(err =>{
            res.json(err)
        })
})

router.post('/edit/:id',passport.authenticate('jwt',{session:false}),(req,res) => {
    const clienTdata = {};
    if (req.body.title) clienTdata.title = req.body.title;
    if (req.body.content) clienTdata.content = req.body.content;
    if (req.body.ClientImg) clienTdata.ClientImg = req.body.ClientImg;
   
    ClientServers.findOneAndUpdate(
        {_id: req.params.id},
        {$set: clienTdata},
        {new: true}
    )
        .then(info =>{
            res.json(info)
        })
})

router.post('/ClientImg', passport.authenticate('jwt', {session: false}), upload.single('ClientImg'), (req, res) => {
    fs.readFile(req.file.path, (err, data) => {
        if (err) {
            return res.send('上传失败');
        }
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        let extname = req.file.mimetype.split('/')[1] //图片后缀
        let keepname = time + '.' + extname;
        fs.writeFile(path.join(__dirname, '../../public/clients/image/' + keepname), data, (err) => {
            if (err) {
                return res.send(err)
            }
            var indirectIcon = '/clients/image/' + keepname;
            res.json({img: indirectIcon})
        })
    })
});


module.exports = router;