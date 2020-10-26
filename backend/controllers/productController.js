import catchAsync from 'express-async-handler';
import Product from './../models/productModel.js';

const getAllProducts = catchAsync(async (req, res) => {
    const products = await Product.find();

    res.json(products);
});

const getProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error(`Product not found.`);
    }
});

const deleteProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.remove();
        res.json({
            status: 'success',
            message: 'Product removed.'
        });
    } else {
        res.status(404);
        throw new Error(`Product not found.`);
    }
});

export { getAllProducts, getProduct, deleteProduct };
