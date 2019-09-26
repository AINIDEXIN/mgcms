const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const multer = require('multer');
const formidable = require('formidable');
const News = require('../../models/News');

//生成的图片放在uploads文件夹下
const upload = multer({dest: 'uploads/'})
router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    const news = {};
    if (req.body.author) news.author = req.body.author; //作者
    if (req.body.title) news.title = req.body.title; //标题
    if (req.body.content) news.content = req.body.content; //内容
    if (req.body.details) news.details = req.body.details; //详情
    if (req.body.releasedate) news.releasedate = req.body.releasedate; //发布时间
    if (req.body.thumbnailimg) news.thumbnailimg = req.body.thumbnailimg; //缩略图
    new News(news).save()
        .then(info => {
            res.json(info);
        })

})

router.get('/', (req, res) => {
    const Urldz = req.headers['host'];
    const port = 'https://' + Urldz;
    News.find()
        .then(info => {
            if (info.length > 0) {
                const newArray = info.map((item) => {
                    return {
                        author: item.author,
                        title: item.title,
                        content: item.content,
                        details: item.details,
                        releasedate: item.releasedate,
                        thumbnailimg:port + item.thumbnailimg,
                        _id: item._id
                    }
                })
                return res.json(newArray);
            }else {
                return res.json(info);
            }
        })
})

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    News.findOne({_id: req.params.id})
        .then(info => {
            if (info.thumbnailimg) {
                const imgName = info.thumbnailimg.substr(17);
                News.findOneAndDelete({_id: req.params.id})
                    .then(info => {
                        info.save()
                            .then(info => {
                                fs.exists(path.join(__dirname, '../../public/thumbnail/image/' + imgName),(data) => {
                                    if (data){
                                        fs.unlink(path.join(__dirname, '../../public/thumbnail/image/' + imgName), (err) => {
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
                News.findOneAndDelete({_id: req.params.id})
                    .then(info => {
                        info.save()
                            .then(info => {
                                res.json(info)
                            })
                    })
            }
        });
});

//wangeditor上传图片的地址
router.post("/wangeditor/upload", passport.authenticate('jwt', {session: false}), (req, res, next) => {
    // console.log(req)
    //console.log(req);
    var form = new formidable.IncomingForm();
    //设置文件上传存放地址（需要先把这个文件夹，在项目中建好）
    form.uploadDir = "./public/images/wang";
    //执行里面的回调函数的时候，表单已经全部接收完毕了。
    form.parse(req, function (err, fields, files) {
        var oldpath = files.myFileName.path; //myFileName就是我们刚在前台模板里面配置的后台接受的名称；
        //console.log(oldpath)
        var extname = files.myFileName.name; //因为formidable这个时候存在我们刚路径上的，只是一个path，还没有具体的扩展名，如：2.png这样的
        //console.log(extname)
        //新的路径由组成：原父路径 + 拓展名
        var newpath = "./public/images/wang/" + extname;
        fs.rename(oldpath, newpath, function (err) { //把之前存的图片换成真的图片的完整路径
            const Urldz = req.headers['host']
            if (err) {
                myFileName
                res.send({errno: 1, data: []});
            }
            ;
            var mypath = newpath.replace("./public", "http://" + Urldz); //context.ip是我自己设置的后台的ip名，根据环境，可以是localhost,也可以是电脑ip
            //res.send({errno: 0, data: [mypath]}) //返回图片路径，让前端展示
            res.json(mypath);
        });
    });
})

router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const news = {};
    if (req.body.author) news.author = req.body.author; //作者
    if (req.body.title) news.title = req.body.title; //标题
    if (req.body.content) news.content = req.body.content; //内容
    if (req.body.details) news.details = req.body.details; //详情
    if (req.body.releasedate) news.releasedate = req.body.releasedate; //发布时间
    if (req.body.thumbnailimg) news.thumbnailimg = req.body.thumbnailimg; //缩略图
    News.findOneAndUpdate(
        {_id: req.params.id},
        {$set: news},
        {new: true}
    ).then(info => {
        res.json(info);
    });
});

router.get('/:id', (req, res) => {
    News.findOne({_id: req.params.id})
        .then(info => {
            res.json(info)
        })
})


router.post('/add/coverImg', passport.authenticate('jwt', {session: false}), upload.single('coverImg'), (req, res) => {
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
        const Urldz = req.headers['host']
        const pjdzhi = 'http://' + Urldz
        fs.writeFile(path.join(__dirname, '../../public/thumbnail/image/' + keepname), data, (err) => {
            if (err) {
                return res.send(err)
            }
            const iuytre = '/thumbnail/image/' + keepname;
            res.json(iuytre);
        })
    })
})


module.exports = router;