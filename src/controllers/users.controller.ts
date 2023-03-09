import { User } from '../entities/user.model.js';
import { Repo } from '../repository/repo.interface.js';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Auth, PayloadToken } from '../helpers/auth.js';
import { RequestPlus } from '../interceptors/authorization.js';

const debug = createDebug('W7CH5:users-controller');

export class UsersController {
  constructor(public repoUser: Repo<User>) {
    this.repoUser = repoUser;
    debug('Controller instanced');
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      debug('getAll method');

      const data = await this.repoUser.query();

      res.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserByName(req: Request, res: Response, next: NextFunction) {
    try {
      debug('get user by name');
      if (!req.params.name) throw new Error('user name was not provided');
      const data = await this.repoUser.search({
        key: 'name',
        value: req.params.name,
      });
      if (!data) throw new Error('data not found');
      res.json({
        result: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post method');

      if (!req.body.email || !req.body.password)
        throw new Error('Unauthorized');

      req.body.password = await Auth.createHash(req.body.password);

      req.body.friends = [];
      req.body.enemies = [];

      const data = await this.repoUser.create(req.body);

      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.body.email || !req.body.password)
        throw new Error('Unauthorized');

      const data = await this.repoUser.search({
        key: 'email',
        value: req.body.email,
      });

      if (!data.length) throw new Error('Unauthorized');

      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new Error('Unauthorized');

      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
      };

      const token = Auth.createJWT(payload);

      resp.status(202);
      resp.json({
        results: [{ token }],
      });
    } catch (error) {
      next(error);
    }
  }

  async addEnemyOrFriend(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('addFriends method');

      const userId = req.dataPlus?.id;
      if (!userId) throw new Error('Not found');

      const actualUser = await this.repoUser.queryId(userId);

      const userToAdd = await this.repoUser.queryId(req.params.id);

      if (!userToAdd) throw new Error('Not found');

      if (req.url.startsWith('/add_friends')) {
        if (actualUser.friends.find((item) => item.id === userToAdd.id))
          throw new Error('Not allowed');
        actualUser.friends.push(userToAdd);
      }

      if (req.url.startsWith('/add_enemies')) {
        if (actualUser.enemies.find((item) => item.id === userToAdd.id))
          throw new Error('Not allowed');
        actualUser.enemies.push(userToAdd);
      }

      this.repoUser.update(actualUser);

      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async removeEnemyOrFriends(
    req: RequestPlus,
    resp: Response,
    next: NextFunction
  ) {
    try {
      debug('removeFriends method');

      const userId = req.dataPlus?.id;

      if (!userId) throw new Error('Not found');

      const actualUser = await this.repoUser.queryId(userId);

      const userToAdd = await this.repoUser.queryId(req.params.id);

      if (!userToAdd) throw new Error('Not found');

      if (req.url.startsWith('/remove_friends')) {
        if (actualUser.friends.find((item) => item.id !== userToAdd.id))
          throw new Error('User you try to remove is not in your list');
        actualUser.friends = actualUser.friends.filter(
          (item) => item.id !== userToAdd.id
        );
      }

      if (req.url.startsWith('/remove_enemies')) {
        if (actualUser.enemies.find((item) => item.id !== userToAdd.id))
          throw new Error('User you try to remove is not in your list');
        actualUser.enemies = actualUser.enemies.filter(
          (item) => item.id !== userToAdd.id
        );
      }

      this.repoUser.update(actualUser);

      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }
}
