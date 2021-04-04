import { PurchaseController } from './purchase';
import { mountPurchaseService } from '../../../domain/services';

export const mountPurchase = (): PurchaseController => {
  const service = mountPurchaseService();
  return new PurchaseController(service);
};
