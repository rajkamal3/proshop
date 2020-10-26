import express from 'express';
import { admin, protect } from './../middleware/authMiddleware.js';
import { getAllProducts, getProduct, deleteProduct } from './../controllers/productController.js';

const router = express.Router();

router.route('/').get(getAllProducts);
router.route('/:id').get(getProduct).delete(protect, admin, deleteProduct);

export default router;
