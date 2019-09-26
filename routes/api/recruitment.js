const express = require('express');
const router = express.Router();
const passport = require('passport');
const Describec = require('../../models/Recruitment');

router.get('/', (req, res) => {
    Describec.find()
        .then(info => {
            res.status(200).json(info);
        })
})

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    const recruitment = {};
    if (req.body.name) recruitment.name = req.body.name;
    if (req.body.describe) recruitment.describe = req.body.describe;
    new Describec(recruitment).save()
        .then(info => {
            res.status(200).json(info)
        })
})

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Describec.findOneAndDelete({_id: req.params.id})
        .then(info => {
            info.save()
                .then(info => {
                    res.json(info);
                })
        })
})

router.post('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const recruitment = {};
    if (req.body.name) recruitment.name = req.body.name;
    if (req.body.describe) recruitment.describe = req.body.describe;
    Describec.findOneAndUpdate(
        {_id: req.params.id},
        {$set: recruitment},
        {new: true}
    )
        .then(info => {
            res.json(info)
        })
})

//wangeditor上传图片的地址
router.post('/describe', passport.authenticate('jwt', {session: false}), (req, res) => {
    // console.log(req)
    var form = new formidable.IncomingForm();
    //设置文件上传存放地址（需要先把这个文件夹，在项目中建好）
    form.uploadDir = "./public/recruitment/image";
    //执行里面的回调函数的时候，表单已经全部接收完毕了。
    form.parse(req, function (err, fields, files) {
        var oldpath = files.myFileName.path; //myFileName就是我们刚在前台模板里面配置的后台接受的名称；
        //console.log(oldpath)
        var extname = files.myFileName.name; //因为formidable这个时候存在我们刚路径上的，只是一个path，还没有具体的扩展名，如：2.png这样的
        //console.log(extname)
        //新的路径由组成：原父路径 + 拓展名
        var newpath = "./public/recruitment/image/" + extname;
        fs.rename(oldpath, newpath, function (err) { //把之前存的图片换成真的图片的完整路径
            const Urldz = req.headers['host']
            if (err) {
                myFileName
                res.send({errno: 1, data: []});
            }
            ;
            var mypath = newpath.replace("./public", "http://" + Urldz); //context.ip是我自己设置的后台的ip名，根据环境，可以是localhost,也可以是电脑ip
            res.send({errno: 0, data: [mypath]}) //返回图片路径，让前端展示
        });
    });
});

module.exports = router;