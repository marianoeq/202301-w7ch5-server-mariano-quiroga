import { Router as router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { authorization } from '../interceptors/authorization.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';
import createDebug from 'debug';

const debug = createDebug('W7CH5:router');

export const usersRouter = router();
const repoUsers = UsersMongoRepo.getInstance();
const controller = new UsersController(repoUsers);

debug('Users Router');

usersRouter.get('/', authorization, controller.getAll.bind(controller));
usersRouter.get(
  '/get_one_user/:name',
  authorization,
  controller.getUserByName.bind(controller)
);
usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch(
  '/add_friends/:id',
  authorization,
  controller.addFriends.bind(controller)
);
usersRouter.patch(
  '/remove_friends/:id',
  authorization,
  controller.removeFriends.bind(controller)
);
usersRouter.patch(
  '/add_enemies/:id',
  authorization,
  controller.getAll.bind(controller)
);
usersRouter.patch(
  '/remove_enemies/:id',
  authorization,
  controller.addFriends.bind(controller)
);
