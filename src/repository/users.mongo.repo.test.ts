import { User } from '../entities/user.model.js';
import { UserModel } from './users.mongo.model.js';
import { UsersMongoRepo } from './users.mongo.repo.js';
jest.mock('./users.mongo.model.js');

describe('Given UsersMongoRepo repository', () => {
  const repo = UsersMongoRepo.getInstance();

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of UsersMongoRepo', () => {
      expect(repo).toBeInstanceOf(UsersMongoRepo);
    });
  });

  describe('When the query method is used', () => {
    test('Then it should return an empty array', async () => {
      const mockData = [] as unknown as User;
      (UserModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue(mockData),
      }));
      const result = await repo.query();
      expect(result).toEqual([]);
    });
  });

  describe('When the queryId method is used', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await repo.queryId('1');
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  describe('When the search method is used', () => {
    test('Then if it has an mock query object, it should return find resolved value', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([{ id: '1' }]);
      const mockQuery = { key: 'test', value: 'test' };
      const result = await repo.search(mockQuery);
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('When the create method is used', () => {
    test('Then if it has an object to create, it should return the created object', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({ email: 'test' });
      const result = await repo.create({ email: 'test' });
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({ email: 'test' });
    });
  });

  describe('When the update method is used', () => {
    const mockUser = {
      email: 'test',
    } as Partial<User>;

    test('Then if the findByIdAndUpdate method resolve value to an object, it should return the object', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        email: 'test',
      });
      const result = await repo.update(mockUser);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ email: 'test' });
    });

    test('Then if the findByIdAndUpdate method resolve value to null, it should throw an Error', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      expect(async () => repo.update(mockUser)).rejects.toThrow();
    });
  });
});
