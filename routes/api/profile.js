const express = require('express')
const router = express.Router()
const Profile = require('../../db/model/Profile')
const passport = require("passport")

router.get('/test', (req, res) => {
    res.send('test')
})

// @route POST api/profile/add
// @desc  创建信息接口
// @access private
router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    const profileField = {}

    if (req.body.type) {
        profileField.type = req.body.type
    }
    if (req.body.describe) {
        profileField.describe = req.body.describe
    }
    if (req.body.income) {
        profileField.income = req.body.income
    }
    if (req.body.expend) {
        profileField.expend = req.body.expend
    }
    if (req.body.cash) {
        profileField.cash = req.body.cash
    }
    if (req.body.remark) {
        profileField.remark = req.body.remark
    }

    new Profile(profileField).save().then(profile => {
        res.json(profile)
    })
})

// @route GET api/profile
// @desc  获取所有信息
// @access private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.find().then(profile => {
        if (!profile) {
            return res.status(404).json('没有任何内容')
        }
        res.json(profile)
    }).catch(err => res.status(404).json(err))
})

module.exports = router