import express from 'express';
import { admin, protect } from './../middleware/authMiddleware.js';
import {
    getAllProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    createProduct
} from './../controllers/productController.js';

const router = express.Router();

router.route('/').get(getAllProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProduct).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct);

export default router;
