const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Company = require('../../models/Company');
const upload = multer({dest: 'uploads/'})

router.get('/', (req, res) => {
    const Urldz = req.headers['host'];
    const pjdzhi = 'https://' + Urldz;
    Company.find()
        .then(info => {
            if (info.length > 0) {
                const newArrray = info.map((item) => {
                    return {
                        company_img: pjdzhi + item.company_img,
                        conpany_content: item.conpany_content,
                        _id: item._id
                    }

                })
                return res.json(newArrray);
            } else {
                res.json(info);
            }
        })
});

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    const companyinfo = {}
    if (req.body.conpany_content) companyinfo.conpany_content = req.body.conpany_content;
    if (req.body.company_img) companyinfo.company_img = req.body.company_img;
    new Company(companyinfo).save()
        .then(info => {
            res.status(200).json(info);
        })
});

router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const companyinfo = {}
    if (req.body.conpany_content) companyinfo.conpany_content = req.body.conpany_content;
    if (req.body.company_img) companyinfo.company_img = req.body.company_img;
    Company.findOneAndUpdate(
        {_id: req.params.id},
        {$set: companyinfo},
        {new: true}
    )
        .then(info => {
            res.status(200).json(info);
        })
});

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Company.findOne({_id: req.params.id})
        .then(info => {
            
            if (info.company_img) {
                const company_img = info.company_img.substr(15);
               
                Company.findOneAndDelete({_id: req.params.id})
                    .then(info => {
                        info.save()
                            .then(info => {
                                fs.exists(path.join(__dirname, '../../public/company/image/' + company_img),(data) => {
                                    if (data){
                                        fs.unlink(path.join(__dirname, '../../public/company/image/' + company_img), (err) => {
                                            if (err) throw err; //这里报错了，未解决
                                        });
                                        res.json(info);
                                    }else {
                                        res.json(info);
                                    }
                                })
                            })
                    })
            } else {
                Company.findOneAndDelete({_id: req.params.id})
                    .then(info => {
                        info.save()
                            .then(info => {
                                res.json(info)
                            })
                    })
            }
        })
});

router.post('/company_img', passport.authenticate('jwt', {session: false}), upload.single('company_img'), (req, res) => {
    fs.readFile(req.file.path, (err, data) => {
        if (err) {
            return res.send('上传失败');
        }
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        let extname = req.file.mimetype.split('/')[1] //图片后缀
        let keepname = time + '.' + extname;
        fs.writeFile(path.join(__dirname, '../../public/company/image/' + keepname), data, (err) => {
            if (err) {
                return res.send(err)
            }
            var indirectIcon = '/company/image/' + keepname;
            res.json({img: indirectIcon})
        })
    })
})

module.exports = router;