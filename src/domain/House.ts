export interface House {
  id: number | string,
  name: string,
  members: number[] | string[],
}

export interface CreateHouseDto {
  name: string,
  members: number[] | string[],
}
