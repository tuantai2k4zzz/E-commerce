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
// Filtering, sorting && pagination
const getProducts = asyncHandler(async (req, res) => {
    const queries = {...req.query}
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fielder']
    excludeFields.forEach(el => delete queries[el])
    
    // Format lại các operator cho đúng cú pháp mongoose

    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, macthedEL => `$${macthedEL}`)
    formatedQueries = JSON.parse(queryString)
    const queryCommand = Product.find(formatedQueries)
    try {
        let responses = null;
        if (formatedQueries?.title) {
            responses = await Product.findOne({
                title: { $regex: formatedQueries.title, $options: 'i' }
            });
        } else {    
            responses = await Product.find(formatedQueries); // Truy vấn các trường khác
        }
        const counts = responses ? 1 : 0; // `countDocuments` không cần thiết vì chỉ tìm một sản phẩm.
        const sort = req.query.sort
        if(sort) {
            const sortBy = sort.split(',').join(' ')
            responses = await queryCommand.sort(sortBy)
        }
        return res.status(200).json({
            success: !!responses,
            counts,
            products: responses ? responses : "Cannot find product!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    
    
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