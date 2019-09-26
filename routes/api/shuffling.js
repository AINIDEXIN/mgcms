const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const multer = require('multer');
const Shufflings = require('../../models/Shuffling');

//生成的图片放在uploads文件夹下
const upload = multer({dest: 'uploads/'})

router.post('/add', passport.authenticate('jwt', {session: false}), upload.single('url'), (req, res) => {
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
                return res.send(err)
            }
            res.json({data: '/image/' + keepname})
            var lunbo = new Shufflings({
                name:keepname,
                url: '/image/' + keepname
            })
            lunbo.save()
                .then(info => {
                    res.json(info)
                })
        })
    })
});

router.get(
    '/',
    (req, res) => {
        Shufflings.find()
            .then(profile => {
                const listImg = []
                const Urldz = req.headers['host']
                const pjdzhi = 'https://' + Urldz
                profile.forEach(element =>{
                    //console.log(element)
                    const we = {
                        _id:element._id,
                        name:element.name,
                        url:pjdzhi + element.url
                    }
                    //console.log(we)
                    listImg.push(we)
                })
                //console.log(popo)
                return res.json(listImg)
            })
    }
);

router.delete('/delete/:id',passport.authenticate('jwt', {session: false}),(req,res) =>{
    Shufflings.findOne({_id:req.params.id})
        .then( info =>{
            //console.log(info)
            var imgName = info.name;
            Shufflings.findOneAndRemove({_id: req.params.id})
                .then( info =>{
                    info.save()
                        .then(info => {
                            fs.unlink(path.join(__dirname, '../../public/image/' + imgName), (err) => {
                                if (err) throw err; //这里报错了，未解决
                            });
                            res.status(200).json({success:"删除成功"})
                        })
                })
                .catch(error => res.status(404).json(error));
        })
})

module.exports = router;