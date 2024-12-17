const router = require('express').Router()
const ctrl = require("../controllers/product")
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/',[ verifyAccessToken, isAdmin], ctrl.createProduct)
router.get('/', ctrl.getProducts)
router.put('/:pid', [ verifyAccessToken, isAdmin], ctrl.updateProduct)
router.get('/:pid', ctrl.getProduct)
router.delete('/:pid', ctrl.deleteProduct)




module.exports = router