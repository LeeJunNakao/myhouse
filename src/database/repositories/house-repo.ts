import { HouseRepository as IHouseRepository } from '../protocols';
import { CreateHouseDto, House } from '../../domain/House';
import pg from '../helpers/connect-helper';

export class HouseRepository implements IHouseRepository {
  async create(dto: CreateHouseDto): Promise<House> {
    const parsedMembers = `'{${dto.members}}'`;
    const query = `INSERT INTO house (name, members) VALUES ('${dto.name}', ${parsedMembers}) RETURNING *`;
    const { rows } = await pg.query(query, null);
    const house = rows[0];

    return {
      id: house.id,
      name: house.name,
      members: house.members,
    };
  }

  async get(memberId: Number | String): Promise<House[]> {
    const query = `SELECT *  FROM house WHERE '${memberId}' = ANY(members)`;
    const { rows } = await pg.query(query, null);
    const houses = rows.map((h: any) => ({ id: h.id, name: h.name, members: h.members }));
    return houses;
  }

  async update(dto: House): Promise<House> {
    const parsedMembers = `'{${dto.members}}'`;
    const { rows } = await pg.query(`UPDATE house SET name = $1, members = ${parsedMembers} WHERE id = $2 RETURNING *`, [dto.name, dto.id]);
    const house = rows[0];

    return {
      id: house.id,
      name: house.name,
      members: house.members,
    };
  }
}
