import catchAsync from 'express-async-handler';
import Product from './../models/productModel.js';

const getAllProducts = catchAsync(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: 'i'
              }
          }
        : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

const createProductReview = catchAsync(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed.');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({
            message: 'Review added.'
        });

        res.status(201).json(product);
    } else {
    }
});

export { getAllProducts, getProduct, deleteProduct, createProduct, updateProduct, createProductReview };
