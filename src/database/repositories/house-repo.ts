import { HouseRepository as IHouseRepository } from '../protocols';
import { CreateHouseDto, House } from '../../domain/House';
import pg from '../helpers/connect-helper';
import { NotMatchedError } from '../errors';

export class HouseRepository implements IHouseRepository {
  async create(dto: CreateHouseDto): Promise<House> {
    const parsedMembers = `'{${dto.members}}'`;
    const query = `INSERT INTO house (name, members, "userId") VALUES ('${dto.name}', ${parsedMembers}, ${dto.userId}) RETURNING *`; ;
    const { rows } = await pg.query(query, null);
    const house = rows[0];

    return {
      id: house.id,
      name: house.name,
      members: house.members,
      userId: house.userId,
    };
  }

  async get(memberId: Number | String): Promise<House[]> {
    const query = `SELECT *  FROM house WHERE '${memberId}' = ANY(members)`;
    const { rows } = await pg.query(query, null);
    const houses = rows.map((h: any) => ({ id: h.id, name: h.name, members: h.members, userId: h.userId }));
    return houses;
  }

  async updateName(dto: House): Promise<House> {
    const { rows } = await pg.query('UPDATE house SET name = $1 WHERE id = $2 AND $3 = ANY(members) RETURNING *', [dto.name, dto.id, dto.userId]);
    const house = rows[0];
    if (!house) throw new NotMatchedError();

    return {
      id: house.id,
      name: house.name,
      members: house.members,
      userId: house.userId,
    };
  }

  async update(dto: House): Promise<House> {
    const parsedMembers = `'{${dto.members}}'`;
    const { rows } = await pg.query(`UPDATE house SET name = $1, members = ${parsedMembers}  WHERE id = $2 and "userId" = $3 RETURNING *`, [dto.name, dto.id, dto.userId]);
    const house = rows[0];
    if (!house) throw new NotMatchedError();

    return {
      id: house.id,
      name: house.name,
      members: house.members,
      userId: house.userId,
    };
  }

  async delete(id: string | number, userId: string | number): Promise<void> {
    await pg.query('DELETE FROM house WHERE id = $1 and  "userId" = $2', [id, userId]);
  }
}
