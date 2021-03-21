import { HouseRepository } from "./house-repo";
import { CreateHouseDto, House } from "../../domain/House";
import { truncateDatabase } from "../helpers/query-helper";

const createHouseDto: CreateHouseDto = {
  name: "Casa de alguém",
  members: [1, 2, 3],
};

describe("House Repository", () => {
  beforeAll(async () => await truncateDatabase());
  afterEach(async () => await truncateDatabase());

  test("Should insert into database successfully", async () => {
    const repo = new HouseRepository();
    const house = await repo.create(createHouseDto);
    expect(house).toEqual({ ...createHouseDto, id: 1 });
  });

  test("Should insert get by id successfully", async () => {
    const repo = new HouseRepository();
    const { id, name, members } = await repo.create(createHouseDto);
    const house = await repo.get(createHouseDto.members[0]);
    expect(house).toEqual([{ id, name, members }]);
  });

  test("Should update successfully", async () => {
    const repo = new HouseRepository();
    const { id } = await repo.create(createHouseDto);
    const house = await repo.update({ id, name: "Novo nome", members: [1, 2] });
    expect(house).toEqual({ id, name: "Novo nome", members: [1, 2] });
  });

  test("Should get all houses that user owns", async () => {
    const commomMember = 1;
    const houseDto = { name: "Casa de Fulano", members: [commomMember, 2, 3] };
    const houseDto2 = { name: "Casa de Beltrano", members: [commomMember, 7, 8] };
    const repo = new HouseRepository();
    const house1 = await repo.create(houseDto);
    const house2 = await repo.create(houseDto2);
    const houses = await repo.get(commomMember);
    expect(houses.length).toEqual(2);
    expect(houses).toContainEqual(house1);
    expect(houses).toContainEqual(house2);
  });
});
