import express from 'express';
import { routeAdapter } from '../adapter';
import { mountPurchase } from '../../controllers/purchase';

const router = express.Router({ mergeParams: true });

const purchaseController = mountPurchase();

router.post('/', routeAdapter(purchaseController));
router.get('/', routeAdapter(purchaseController));
router.put('/:id', routeAdapter(purchaseController));
router.delete('/:id', routeAdapter(purchaseController));

export default router;
