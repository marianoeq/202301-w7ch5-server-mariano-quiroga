export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  friend: User[];
  enemy: User[];
};
