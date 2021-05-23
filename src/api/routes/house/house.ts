import express from 'express';
import { routeAdapter } from '../adapter';
import { mountHouse } from '../../controllers/house';

const router = express.Router();

const houseController = mountHouse();

router.post('/', routeAdapter(houseController));
router.get('/', routeAdapter(houseController));
router.put('/:id', routeAdapter(houseController));
router.delete('/:id', routeAdapter(houseController));

export default router;
