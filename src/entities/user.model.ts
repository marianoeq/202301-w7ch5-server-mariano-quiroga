export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  friends: User[];
  enemies: User[];
};
