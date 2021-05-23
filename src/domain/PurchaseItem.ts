export interface IPurchaseItem {
  type: string,
  brand: string,
  quantity: number,
  // use integer for value
  value: number,
  total: number,
}

export class PurchaseItem implements IPurchaseItem {
  type: string;
  brand: string;
  quantity: number;
  value: number;
  total: number;

  constructor(type: string, brand: string, quantity: number, value: number) {
    this.type = type;
    this.brand = brand;
    this.quantity = quantity;
    this.value = value;
    this.setValue();
  }

  private setValue(): void {
    this.total = this.quantity * this.value;
  }
}
