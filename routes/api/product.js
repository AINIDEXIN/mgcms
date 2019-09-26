const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const multer = require('multer');
const Product = require('../../models/Product');
//生成的图片放在uploads文件夹下
const upload = multer({dest: 'uploads/'})

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    const Urldz = req.headers['host'];
    const pjdzhi = 'https://' + Urldz;
    const cpformdata = {}
    if (req.body.title) cpformdata.title = req.body.title;
    if (req.body.content) cpformdata.content = req.body.content;
    if (req.body.productdate) cpformdata.productdate = req.body.productdate;
    if (req.body.icon) cpformdata.icon = req.body.icon;
    new Product(cpformdata).save()
        .then(info => {
            res.json(info)
        })
})
router.post('/addicon', passport.authenticate('jwt', {session: false}), upload.single('iconImg'), (req, res) => {
    fs.readFile(req.file.path, (err, data) => {
        if (err) {
            return res.send('上传失败');
        }
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        let extname = req.file.mimetype.split('/')[1]
        let keepname = time + '.' + extname;
        fs.writeFile(path.join(__dirname, '../../public/icon/image/' + keepname), data, (err) => {
            if (err) {
                return res.send(err)
            }
            var indirectIcon = '/icon/image/' + keepname;
            res.json({img: indirectIcon})
        })
    })
});

router.get('/', (req, res) => {
    const Urldz = req.headers['host'];
    const pjdzhi = 'https://' + Urldz;
    // console.log(pjdzhi)
    Product.find()
        .then(info => {
            //console.log(info)
            if (info.length > 0) {
                const newArray = info.map((item) => {
                    return {
                        title: item.title,
                        content: item.content,
                        productdate: item.productdate,
                        icon: pjdzhi + item.icon,
                        _id:item._id
                    }
                })
                return res.json(newArray);
            }else{
                res.json(info);
            }
        })
});

router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Product.findOne({_id: req.params.id})
        .then(info => {
            res.status(200).json(info)
        })
})

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => { //报错，带修改
    Product.findOne({_id: req.params.id})
        .then(info => {
            //console.log(info);
            if (info.icon) {
                const productImg = info.icon.substr(12);
                fs.exists(path.join(__dirname, '../../public/icon/image/' + productImg), (data) => {
                    if (data) {
                        Product.findOneAndDelete({_id: req.params.id})
                            .then(info => {
                                info.save()
                                    .then(info => {
                                        fs.unlink(path.join(__dirname, '../../public/icon/image/' + productImg), (err) => {
                                            if (err) throw err;
                                        });
                                        res.json(info);
                                    })
                            })
                    } else {
                        Product.findOneAndDelete({_id: req.params.id})
                            .then(info => {
                                info.save()
                                    .then(info => {
                                        res.json(info);
                                    })
                            })
                    }
                })
            } else {
                Product.findOneAndDelete({_id: req.params.id})
                    .then(info => {
                        info.save()
                            .then(info => {
                                res.json(info);
                            })
                    })
            }

        })
});
router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const Urldz = req.headers['host'];
    const pjdzhi = 'https://' + Urldz;
    const cpformdata = {};
    if (req.body.title) cpformdata.title = req.body.title;
    if (req.body.content) cpformdata.content = req.body.content;
    if (req.body.productdate) cpformdata.productdate = req.body.productdate;
    if (req.body.icon) cpformdata.icon =  req.body.icon;
    //console.log(cpformdata);
    Product.findOneAndUpdate(
        {_id: req.params.id},
        {$set: cpformdata},
        {new: true}
    )
        .then(info => {
            res.json(info)
        })
})


module.exports = router;
