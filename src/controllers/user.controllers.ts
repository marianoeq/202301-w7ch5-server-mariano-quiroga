import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Repo } from '../repository/repo.interface';
import { User } from '../entities/user.model';
import { Auth } from '../helpers/auth';
const debug = createDebug('W7: controller');

export class UserControllers {
  constructor(public repo: Repo<User>) {
    this.repo = repo;
  }

  async getAllUsers(_req: Request, res: Response, next: NextFunction) {
    debug('Get all users');
    try {
      const data = await this.repo.query();
      res.json({ results: data });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      debug('Register User');
      if (!req.body.email || !req.body.password)
        throw new Error('Unauthorized');
      req.body.password = await Auth.createHash(req.body.password);
      req.body.Knowledge = [];
      const data = await this.repo.create(req.body);

      console.log('register: ', data);
      res.status(200);
      res.json({ results: [data] });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('login', req.body);
      debug('login User');
      if (!req.body.email || !req.body.password)
        throw new Error('Unauthorized');

      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      console.log('login: ', data);
      if (!data.length) throw new Error('Unauthorized');

      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new Error('Unauthorized');

      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'Admin',
      };
      console.log('payload: ', payload);
      const token = Auth.createJWT(payload);
      res.status(202);
      res.json({ results: { token } });
    } catch (error) {
      next(error);
    }
  }

  async addFriend(req: RequesPlus, res: Response, next: NextFunction) {
    try {
      debug('add friend');
      const userId = req.dataPlus?.id;
      if (!userId) throw new Error('User not found');
      const actualUser = await this.repo.queryId(userId);
      const newFriend = await this.repo.queryId(req.params.id);
      if (!newFriend) throw new Error('New user not found');
      actualUser.enemies.push(newFriend);
      this.repo.update(actualUser);
    } catch (error) {
      next(error);
    }
  }
}
