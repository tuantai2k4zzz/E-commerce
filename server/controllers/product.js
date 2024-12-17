const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    console.log(req.body)
    if(!Object.keys(req.body).length === 0) throw new Error('Missing input!')
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct : newProduct ? newProduct : "Cannot create new product!"
    })
}) 
const getProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        product: product ? product : "Cannot find this product!"
    })
})
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find()
    return res.status(200).json({
        success: products ? true : false,
        products: products ? products : "Cannot find product!"
    })
})

const updateProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    if(req.body && req.body.title) req.body.title = slugify(req.body.title)
    const updateP = await Product.findByIdAndUpdate(pid, req.body, {new: true})
    return res.status(200).json({
        success: updateP ? true : false,
        products: updateP ? updateP : "Cannot update product!"
    })
})

const deleteProduct = asyncHandler(async (req, res) => {
    const {pid} = req.params
    if(req.body && req.body.title) req.body.title = slugify(req.body.title)
    const deleteP = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deleteP ? true : false,
        deleteProduct: deleteP ? `Delete id: ${pid} is successfully!` : "Cannot delete product!"
    })
})

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct
}