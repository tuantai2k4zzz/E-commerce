const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
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
// refresh token  => cấp mới access token
// access token => xác thực người dùng , phân quyền

const login = asyncHandler( async(req, res) => {
    const {email, password} = req.body
    if (!email || !password) 
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
    })
    // plain Object
    const response = await User.findOne({email})
    if(response && await response.isCorrectPassword(password)) {
        // Tách password và role ra khỏi response
        const {password, role, ...userData} = response.toObject()
        // Tạo access token
        const accessToken = generateAccessToken(response._id, role)
        // Tạo refresh token
        const refreshToken = generateRefreshToken(response._id)
        // Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, {refreshToken}, {new: true})
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    }else {
        throw new Error('Invalid credentials!')
    }

})

const getCurrent = asyncHandler( async(req, res) => {
    const {_id} = req.user
    

    const user = await User.findById({_id})
    return res.status(200).json({
        success: false,
        rs: user ? user : 'User not found!'
    })

})

const refreshAccessToken = asyncHandler( async (req, res) => {
    
})

module.exports = {
    register,
    login,
    getCurrent
}