import express from 'express';
import { routeAdapter } from '../adapter';
import { mountHouse } from '../../controllers/house';

const router = express.Router();

router.all('/', routeAdapter(mountHouse()));

export default router;
