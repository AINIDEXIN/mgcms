const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})
const Productc = require('../../models/productShow');

router.get('/', (req, res) => {
    const Urldz = req.headers['host'];
    const pjdzhi = 'https://' + Urldz;
    Productc.find()
        .then(info => {
            if (info.length > 0) {
                const newArr = info.map((item) => {
                    return {name: item.name, content: item.content, productImg: pjdzhi + item.productImg, _id: item._id}
                })
                return res.json(newArr);
            } else {
                res.json(info);
            }
        })
});

router.get('/:id',(req,res) => {
    Productc.findOne({_id:req.params.id})
        .then( info => {
            //console.log(info);
            res.json(info);
        })
})

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    const productshow = {};
    if (req.body.name) productshow.name = req.body.name;
    if (req.body.productImg) productshow.productImg = req.body.productImg;
    if (req.body.content) productshow.content = req.body.content;
    new Productc(productshow).save()
        .then(info => {
            res.json(info);
        });
});

router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const productshow = {};
    if (req.body.name) productshow.name = req.body.name;
    if (req.body.productImg) productshow.productImg = req.body.productImg;
    if (req.body.content) productshow.content = req.body.content;
    Productc.findOneAndUpdate(
        {_id: req.params.id},
        {$set: productshow},
        {new: true}
    ).then(info => {
        res.status(200).json(info);
    })
});

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Productc.findOne({_id: req.params.id})
        .then(info => {
            //console.log(info);
            if (info.productImg) {
                const productImg = info.productImg.substr(19);
                // Productc.findOneAndDelete({id:req.params.id})
                //     .then()
                fs.exists(path.join(__dirname, '../../public/productshow/image/' + productImg), (data) => {
                    if (data) {
                        Productc.findOneAndDelete({_id: req.params.id})
                            .then(info => {
                                info.save()
                                    .then(info => {
                                        fs.unlink(path.join(__dirname, '../../public/productshow/image/' + productImg), (err) => {
                                            if (err) throw err;
                                        });
                                        res.json(info);
                                    })
                            })
                    } else {
                        Productc.findOneAndDelete({_id: req.params.id})
                            .then(info => {
                                info.save()
                                    .then(info => {
                                        res.json(info);
                                    })
                            })
                    }
                })
            } else {
                Productc.findOneAndDelete({_id: req.params.id})
                    .then(info => {
                        info.save()
                            .then(info => {
                                res.json(info);
                            })
                    })
            }

        })
});

//上传图片
router.post('/productImg', passport.authenticate('jwt', {session: false}), upload.single('productImg'), (req, res) => {
    fs.readFile(req.file.path, (err, data) => {
        if (err) {
            return res.send('上传失败');
        }
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        let extname = req.file.mimetype.split('/')[1]
        let keepname = time + '.' + extname;
        //console.log(keepname)
        const Urldz = req.headers['host']
        //const pjdzhi = 'http://' + Urldz
        fs.writeFile(path.join(__dirname, '../../public/productshow/image/' + keepname), data, (err) => {
            if (err) {
                return res.send(err)
            }
            var productImg = '/productshow/image/' + keepname;
            res.json({img: productImg})
        })
    })
});

module.exports = router;