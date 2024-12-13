const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const user = require('../models/user')
const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const {sendMail} = require('../ultils/sendmail')
const crypto = require('crypto')

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
    // Lấy token ở cookie
    const cookie = req.cookies
    // Check xem có token hay không
    console.log(cookie)
    if(!cookie && !cookie.refreshToken) throw new Error("No refresh token in cookie!")
        // Check token có hợp lệ hay không
    const rs = jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    return res.json({
        success: rs ? true : false,
        newAccessToken : rs ? generateAccessToken(rs._id, rs.role) : "Not invalid" 
    })

})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if(!cookie || !cookie.refreshToken) throw new Error('no refresh token in cookie!')
    await User.findOneAndUpdate({refreshToken: cookie.refreshToken}, {refreshToken: ""}, {new: true})
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.json({
        success: true,
        mes: "Logout is done!"
    })

})


const forgotPassword = asyncHandler( async (req, res) => {
    const {email} = req.query
    if(!email) throw new Error('Missing email')
    const user = await User.findOne({email})
    if(!user) throw new Error('User not found')
    const resetToken = await user.createPasswordChangeToken()
    user.save()
    console.log(resetToken)
    const html = `
  <p>Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.</p>
  <b>Link này sẽ hết hạn trong 15 phút kể từ bây giờ</b>
  <p>
    <a href="${process.env.URL_SERVER}/api/user/reset-password/${resetToken}" style="color: blue; ;
    ">
      Click here to reset your password
    </a>
  </p>
`;
    const data = {
        email,
        html
    }
    const rs = await sendMail(data)
    return res.json({
        success: true,
        rs
    })
})

const resetPassword = asyncHandler( async (req, res) => {
    const {password, token} = req.body
    if(!password || !token) throw new Error("Missing input")
        const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const users = await user.findOne({passwordResetToken, passwordResetExpires: {$gt: Date.now()}})
    console.log(users)
    if(!users) throw new Error('Invalid reset token')
    users.password = password
    users.PasswordChangeToken = undefined
    users.passwordChangeAt = Date.now()
    users.passwordResetExpires = undefined
    await users.save()
    return res.json({
        success: users ? true : false,
        mes: users ? "Update password" : " Something went wrong" 
    })

})



module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
}