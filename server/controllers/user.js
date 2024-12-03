const user = require('../models/user')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')

const register = asyncHandler( async(req, res) => {
    const {email, password, lastname, firstname} = req.body
    if (!email || !password || !lastname || !firstname) 
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
    })

    const user = await User.findOne({email: email})
    if(user) {
        throw new Error("User has existed!")
    }else{
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? "Register is successfully. Please login!" : "Some thing went wrong!"
        })
    }

})

const login = asyncHandler( async(req, res) => {
    const {email, password} = req.body
    if (!email || !password) 
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
    })
    const response = await User.findOne({email})
    if(response && await response.isCorrectPassword(password)) {
        const {password, role, ...userData} = response.toObject()
        return res.status(200).json({
            success: true,
            userData
        })
    }else {
        throw new Error('Invalid credentials!')
    }

})

module.exports = {
    register,
    login
}