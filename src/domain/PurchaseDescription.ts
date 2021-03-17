import { Purchase } from './Purchase';
import { PurchaseItem } from './PurchaseItem';

export interface PurchaseDescription {
  id: number | string,
  purchaseId: Purchase['id'],
  item: PurchaseItem[],
  total: number,
}
