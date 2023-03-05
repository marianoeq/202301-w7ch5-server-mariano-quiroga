import { Repo } from './repo.interface.js';
import { UserModel } from './users.mongo.model.js';
import { User } from '../entities/user.model.js';
import createDebug from 'debug';

const debug = createDebug('W7: user-mongo-repo');

export class UsersMongoRepo implements Repo<User> {
  private static instance: UsersMongoRepo;

  public static getInstance(): UsersMongoRepo {
    if (!UsersMongoRepo.instance) {
      UsersMongoRepo.instance = new UsersMongoRepo();
    }

    return UsersMongoRepo.instance;
  }

  private constructor() {
    debug('instanciate');
  }

  async query(): Promise<User[]> {
    const data = await UserModel.find()
      .populate('friends', {
        friends: 0,
        enemies: 0,
      })
      .populate('enemies', { friends: 0, enemies: 0 });
    return data;
  }

  async queryId(id: string): Promise<User> {
    const data = await UserModel.findById(id)
      .populate('friends', {
        friends: 0,
        enemies: 0,
      })
      .populate('enemies', { friends: 0, enemies: 0 });
    if (!data) throw new Error('ID not found');
    return data;
  }

  async create(newUser: Partial<User>): Promise<User> {
    debug('Create method');
    const data = await UserModel.create(newUser);

    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    const data = await UserModel.find({ [query.key]: [query.value] });

    return data;
  }

  async update(user: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(user.id, user);
    if (!data) throw new Error('ID not found');
    return data;
  }
}
