import { Purchase } from './Purchase';
import { PurchaseItem } from './PurchaseItem';

export interface IPurchaseDescription {
  id: number | string,
  purchaseId: Purchase['id'],
  items: PurchaseItem[],
  total: number,
}

export class PurchaseDescription implements IPurchaseDescription {
  id: number | string;
  purchaseId: Purchase['id'];
  items: PurchaseItem[];
  total: number;

  constructor(id: number | string, purchaseId: Purchase['id'], items: PurchaseItem[]) {
    this.id = id;
    this.purchaseId = purchaseId;
    this.setPurchaseItem(items);
  }

  private setPurchaseItem(items: PurchaseItem[]): void {
    const itemsTotal = items.map(i => i.total);
    this.total = itemsTotal.reduce((acc, cur) => acc + cur);
  }
}
