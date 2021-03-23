export interface House {
  id: number | string,
  userId: number | string,
  name: string,
  members: Array<number | string>,
}

export interface CreateHouseDto {
  name: string,
  members: Array<number | string>,
  userId: string | number,
}
