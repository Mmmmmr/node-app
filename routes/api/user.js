const express = require('express')
const router = express.Router()
const User = require('../../db/model/User')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const passport = require("passport")
const keys = require('../../config/keys')

// 注册路由
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
                return res.status(400).json({email: '邮箱已被注册'})
            } else {
                var avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
                const newUser = new User({
                    name: req.body.name,
                    avatar,
                    password: req.body.password,
                    email: req.body.email,
                    identity: req.body.identity
                })

                //密码加密
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) throw err
                        newUser.password = hash
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
})

// 登录路由
router.post('/login', (req, res) => {
    const password = req.body.password
    const email = req.body.email
    User.findOne({email})
        .then(user => {
            if (!user) {
                return res.status(404).json({email: '用户不存在'})
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // 定义token
                        let content = {id: user.id, name: user.name, identity: user.identity, avatar: user.avatar}
                         jwt.sign(content, keys.secretOrPrivateKey, {expiresIn: 3600}, (err, token) => {
                             if (err) throw err
                             res.json({
                                 success: true,
                                 token: 'Bearer ' + token
                             })
                         })

                    } else {
                        return res.status(400).json({password: '密码错误'})
                    }
                })
        })
})

//使用passport-jwt验证token
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        identity: req.user.identity,
        email: req.user.email
    })
})

module.exports = router