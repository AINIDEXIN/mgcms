// @登录和注册接口
const express = require('express');
const router = express.Router();

//引入模型查询数据库
const User = require('../../models/User.js');

//对密码进行加密 bcrypt
const bcrypt = require('bcrypt');

//头像
var gravatar = require('gravatar');

//引入token
const jwt = require('jsonwebtoken');

//引入自己写的加密名称
const keysName = require('../../config/keys.js');

// 引入token请求时候携带，最后一步啦
const passport = require('passport');

// 注册接口 POST api/users/register 返回json数据
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
                return res.status(400).json('邮箱已被注册');
            } else {
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    identity: req.body.identity,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save() //进行存储
                            .then(user => res.json(user)) //把信息返回到客户端或者自己能看到
                            .catch(err => console.log(err))
                    });
                });

            }
        })
});

//登录接口 POST api/users/login 返回token 会用到jwt passport
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.status(404).json('用户不存在')
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // jwt.sign("规则","加密名字","过期时间","箭头函数")
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        } //规则 id+name
                        jwt.sign(rule, keysName.secretName, {expiresIn: 7200}, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            })
                        })
                        // res.json({msg:'登陆成功'})
                    } else {
                        return res.status(400).json('密码错误')
                    }
                })
        })
})

router.post('/modify/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const ypass = req.body.ypass;
    const newPass = req.body.newPass;
    User.findOne({_id: req.params.id})
        .then(info => {
            bcrypt.compare(ypass, info.password)
                .then(isMatch => {
                    if (isMatch) {
                        const newUser = {};
                        newUser.name = info.name;
                        newUser.email = info.email;
                        newUser.avatar = info.avatar;
                        newUser.password = newPass;
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                User.findOneAndUpdate(
                                    {_id: req.params.id},
                                    {$set: newUser},
                                    {new: true}
                                )
                                    .then(info => {
                                        res.json(info)
                                    })
                            });
                        });
                    } else {
                        return res.status(400).json('旧密码错误')
                    }
                })
        })
})

router.get(
    '/current',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            identity: req.user.identity
        });
    }
);

router.get('/',(req,res) => {
    User.find()
        .then( info => {
            res.json(info);
        })
})

module.exports = router;