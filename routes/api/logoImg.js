const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const multer = require('multer');

const Logofile = require('../../models/Logoimg')

//生成的图片放在uploads文件夹下
const upload = multer({dest: 'uploads/'})

//图片上传
router.post('/img', passport.authenticate('jwt', {session: false}), upload.single('logo'), (req, res) => {
    fs.readFile(req.file.path, (err, data) => {
        if (err) {
           return res.send('上传失败');
        }

        //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        //拓展名
        let extname = req.file.mimetype.split('/')[1]
        //拼接成图片名
        let keepname = time + '.' + extname;

        fs.writeFile(path.join(__dirname, '../../public/image/' + keepname), data, (err) => {
            if (err) {
                return res.send('路径错误')
            }
            //res.json({data: '/image/' + keepname})
            var sss = new Logofile({
                logo: '/image/' + keepname
            })
            sss.save()
                .then(info => {
                  return res.json(info)
                })
        })
    })
});

router.get(
    '/',
    (req, res) => { 
        Logofile.find()
            .then(profile => {
                if (profile.length == 0) {
                    return res.json({data: "logo不存在", status: 404});
                } else {
                    const imgurl = profile[0].logo;
                    const Urldz = req.headers['host'];
                    const pjdzhi = 'https://' + Urldz;
                    return res.json({
                        _id: profile[0]._id,
                        imglogo: pjdzhi + imgurl,
                        status: 200
                    })
                }
            })
    }
);

router.delete('/delete/:id',passport.authenticate('jwt', {session: false}),(req,res) =>{
    Logofile.findOne({_id:req.params.id})
        .then(info => {
            if (info.logo) {
                const productImg = info.logo.substr(7);
                fs.exists(path.join(__dirname, '../../public/image/' + productImg), (data) => {
                    if (data) {
                        Logofile.findOneAndDelete({_id: req.params.id})
                            .then(info => {
                                info.save()
                                    .then(info => {
                                        fs.unlink(path.join(__dirname, '../../public/image/' + productImg), (err) => {
                                            if (err) throw err;
                                        });
                                       return  res.json(info);
                                    })
                            })
                    } else {
                        Logofile.findOneAndDelete({_id: req.params.id})
                            .then(info => {
                                info.save()
                                    .then(info => {
                                       return  res.json(info);
                                    })
                            })
                    }
                })
            } else {
                Logofile.findOneAndDelete({_id: req.params.id})
                    .then(info => {
                        info.save()
                            .then(info => {
                              return res.json(info);
                            })
                    })
            }

        })
})

module.exports = router;