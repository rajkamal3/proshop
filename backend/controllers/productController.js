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

const createProduct = catchAsync(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

const updateProduct = catchAsync(async (req, res) => {
    // const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json(product);
});

export { getAllProducts, getProduct, deleteProduct, createProduct, updateProduct };
