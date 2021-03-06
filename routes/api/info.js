// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Pageinfo');

// @route  GET api/profiles/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
    res.json({ msg: '连接成功' });
});

// @route  POST api/profiles/add
// @desc   创建信息接口
// @access Private
router.post(
    '/add',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const profileFields = {};

        if (req.body.webname) profileFields.webname = req.body.webname;
        if (req.body.describe) profileFields.describe = req.body.describe;
        if (req.body.headerTitle) profileFields.headerTitle = req.body.headerTitle;

        new Profile(profileFields).save().then(profile => {
            res.json(profile);
        });
    }
);

// @route  GET api/profiles
// @desc   获取所有信息
// @access Private

router.get(
    '/',
    (req, res) => {
        Profile.find()
            .then(profile => {
            	
                if (profile.length == 0) {
                    return res.json({data:'没有任何内容',error:404});
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route  GET api/profiles/:id
// @desc   获取单个信息
// @access Private

router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOne({ _id: req.params.id })
            .then(profile => {
                if (!profile) {
                    return res.status(404).json('没有任何内容');
                }

                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route  POST api/profiles/edit
// @desc   编辑信息接口
// @access Private
router.post(
    '/edit/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const profileFields = {};

        if (req.body.webname) profileFields.webname = req.body.webname;
        if (req.body.describe) profileFields.describe = req.body.describe;
        if (req.body.headerTitle) profileFields.headerTitle = req.body.headerTitle;

        Profile.findOneAndUpdate(
            { _id: req.params.id },
            { $set: profileFields },
            { new: true }
        ).then(profile => res.json(profile));
    }
);

// @route  POST api/profiles/delete/:id
// @desc   删除信息接口
// @access Private
router.delete(
    '/delete/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Profile.findOneAndRemove({ _id: req.params.id })
            .then(profile => {
                profile.save().then(profile => res.json(profile));
            })
            .catch(err => res.status(404).json('删除失败!'));
    }
);

module.exports = router;
