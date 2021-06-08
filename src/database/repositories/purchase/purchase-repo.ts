import pg from '../../helpers/connect-helper';
import { PurchaseRepository as IPurchaseRepository } from '../../protocols';
import {
  Purchase,
  CreatePurchaseDto,
  UpdatePurchaseDto
} from '../../../domain/Purchase';
import { NotMatchedError } from '../../errors';

export class PurchaseRepository implements IPurchaseRepository {
  async create(dto: CreatePurchaseDto): Promise<Purchase> {
    const { userId, houseId, date, description, value } = dto;
    const { rows } = await pg.query(
      'INSERT INTO purchase ("userId", "houseId", description, value, date) SELECT $1, $2, $3, $4, $5 WHERE EXISTS (SELECT 1 FROM house WHERE $1=ANY(members) and id=$2) RETURNING *',
      [userId, houseId, description, value, date]
    );
    const purchase = rows[0];

    if (!purchase) throw new NotMatchedError();

    return { ...purchase, date: Number(purchase.date) };
  }

  async get(
    userId: string | number,
    houseId: string | number
  ): Promise<Purchase[]> {
    const { rows: purchases } = await pg.query(
      'SELECT purchase.id, purchase."userId", description, date, "houseId", value  FROM purchase INNER JOIN house ON house.id="houseId" AND "houseId"=$2 AND $1=ANY(house.members)',
      [userId, houseId]
    );

    return purchases.map((p) => ({
      id: p.id,
      description: p.description,
      houseId: p.houseId,
      userId: p.userId,
      value: p.value,
      date: Number(p.date),
    }));
  }

  async update(dto: UpdatePurchaseDto): Promise<Purchase> {
    const { id, userId, date, description, value } = dto;
    const { rows } = await pg.query(
      'UPDATE purchase SET date=$3, description=$4, value=$5 WHERE id=$1 AND "userId"=$2 RETURNING *',
      [id, userId, date, description, value]
    );
    const purchase = rows[0];
    if (!purchase) throw new NotMatchedError();

    return purchase;
  }

  async delete(id: string | number, userId: string | number): Promise<void> {
    const { rows } = await pg.query(
      'DELETE FROM purchase WHERE id=$1 AND "userId"=$2 RETURNING *',
      [id, userId]
    );
    if (rows.length === 0) throw new NotMatchedError();
  }
}
