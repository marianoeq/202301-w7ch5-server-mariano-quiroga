import { Repo } from './repo.interface.js';
import { UserModel } from './users.mongo.model.js';
import { User } from '../entities/user.mode.js';
import createDebug from 'debug';

const debug = createDebug('W7: user-mongo-repo');

export class UserMongoRepo implements Repo<User> {
  private static instance: UserMongoRepo;

  public static getInstance(): UserMongoRepo {
    if (!UserMongoRepo.instance) {
      UserMongoRepo.instance = new UserMongoRepo();
    }

    return UserMongoRepo.instance;
  }

  private constructor() {
    debug('instanciate');
  }

  async query(): Promise<User[]> {
    const data = await UserModel.find().populate('friends');
    return data;
  }

  async queryId(id: string): Promise<User> {
    const data = await UserModel.findById(id);
    if (!data) throw new Error('ID not found');
    return data;
  }

  async create(newUser: Partial<User>): Promise<User> {
    const data = await UserModel.create(newUser);
    if (!data) throw new Error('Not found');
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    const data = await UserModel.find({ [query.key]: [query.value] });
    return data;
  }

  async update(user: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(user);
    if (!data) throw new Error('ID not found');
    return data;
  }
}
