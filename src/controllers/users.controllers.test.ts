import { UsersController } from './users.controller';
import { NextFunction, Request, Response } from 'express';
import { Repo } from '../repository/repo.interface';
import { User } from '../entities/user.model';
import { Auth, PayloadToken } from '../helpers/auth';

jest.mock('../helpers/auth.js');

jest.mock('../config.js', () => ({
  _dirname: 'test',
  config: {
    secret: 'test',
  },
}));

describe('Given the UsersController class ', () => {
  const MockRepo = {
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    removeEnemyOrFriends: jest.fn(),
  } as unknown as Repo<User>;

  const controller = new UsersController(MockRepo);

  const res = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  describe('When getAll is called ', () => {
    const req = { body: '' } as Request;
    test('Then if there is info to get it should return a res.json', async () => {
      await controller.getAll(req, res, next);
      expect(MockRepo.query).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
    test('Then if there is NOT info to get it should call next ', async () => {
      (MockRepo.query as jest.Mock).mockRejectedValueOnce('Error');
      await controller.getAll(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When getUserByName is called ', () => {
    test('Then if no name was passed it should throw an Error and next function catch the error', async () => {
      const req = { params: { email: '' } } as unknown as Request;
      await controller.getUserByName(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    test('Then if search does not find data it should throw an Error and next function catch the error', async () => {
      const req = {} as unknown as Request;
      (MockRepo.search as jest.Mock).mockResolvedValue([]);
      await controller.getUserByName(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    test('Then if data was passed correctly it should return a json response', async () => {
      const req = { params: { name: 'test' } } as unknown as Request;
      (MockRepo.search as jest.Mock).mockResolvedValue(['test']);
      await controller.getUserByName(req, res, next);
      expect(res.json).toHaveBeenCalled();
    });
  });
  describe('When login is called ', () => {
    test('Then if no email was passed it should throw an Error and next function catch it', async () => {
      const req = {
        body: {
          password: 'test',
        },
      } as unknown as Request;
      await controller.login(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    test('Then if no password was passed it should throw an Error and next function catch it', async () => {
      const req = {
        body: {
          email: 'test',
        },
      } as unknown as Request;
      await controller.login(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    test('Then if search return an empty array it should return an error and next be called', async () => {
      const req = {
        body: { email: 'test', password: 'test' },
      } as unknown as Request;

      (MockRepo.search as jest.Mock).mockResolvedValue([]);
      await controller.login(req, res, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if Auth.compare is false it should return an error and next be called', async () => {
      const req = {
        body: { email: 'test', password: 'test' },
      } as unknown as Request;
      (MockRepo.search as jest.Mock).mockResolvedValue(['test']);
      (Auth.compare as jest.Mock).mockResolvedValue(false);
      await controller.login(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When register is called ', () => {
    test('Then if no email was passed it should throw an Error and next function catch it', async () => {
      const req = {
        body: {
          password: 'test',
        },
      } as unknown as Request;
      await controller.register(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    test('Then if no password was passed it should throw an Error and next function catch it', async () => {
      const req = {
        body: {
          email: 'test',
        },
      } as unknown as Request;
      await controller.register(req, res, next);

      expect(next).toHaveBeenCalled();
    });
    test('Then if data was passed correctly it should return a json response', async () => {
      const req = {
        body: { email: 'test', password: 'test' },
      } as unknown as Request;

      await controller.register(req, res, next);
      expect(MockRepo.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });
});
