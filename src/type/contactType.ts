export interface INewContact {
  name: string;
  email: string;
  telephone: number;
  group: string;
}

export interface IContact {
  _id: string;
  name: string;
  telephone: number;
  email: string;
  group: string;
  isFavorite: boolean;
  company: string;
  office: string;
  description: string;
  deleted_at: string;
}
