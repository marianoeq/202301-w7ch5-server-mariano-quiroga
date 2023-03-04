export interface Repo<T> {
  query(): Promise<T[]>;
  queryId(_id: string): Promise<T>;
  search(query: { key: string; value: unknown }): Promise<T[]>;
  create(newUser: Partial<T>): Promise<T>;
  update(user: Partial<T>): Promise<T>;
}
