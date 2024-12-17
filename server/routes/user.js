const router = require('express').Router()
const ctrl = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/register', ctrl.register)
router.post('/login', ctrl.login )
router.get('/current', verifyAccessToken ,ctrl.getCurrent)
router.post('/refreshAccessToken', ctrl.refreshAccessToken)
router.get('/logout', ctrl.logout)
router.get('/forgotPassword', ctrl.forgotPassword)
router.put('/resetpassword', ctrl.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], ctrl.getUsers)
router.delete('/',[verifyAccessToken, isAdmin], ctrl.deleteUser)
router.put('/updateUser', ctrl.updateUser)
router.put('/updateUserByAdmin',[verifyAccessToken, isAdmin], ctrl.updateUserByAdmin)



module.exports = router