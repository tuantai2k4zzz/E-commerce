const router = require('express').Router()
const ctrl = require('../controllers/user')
const { verifyAccessToken } = require('../middlewares/verifyToken')

router.post('/register', ctrl.register)
router.post('/login', ctrl.login )
router.get('/current', verifyAccessToken ,ctrl.getCurrent)


module.exports = router