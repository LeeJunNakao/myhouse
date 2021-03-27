import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../protocols';

export const routeAdapter = (controller: Controller) => {
  return async(req: Request, res: Response) => {
    const httpRequest: HttpRequest = { body: { ...req.body, ...req.params } };
    if (req.method === 'GET') {
      const { status, body } = await controller.get(httpRequest);
      res.status(status).send(body);
    } else if (req.method === 'POST') {
      const { status, body } = await controller.post(httpRequest);
      res.status(status).send(body);
    } else if (req.method === 'PUT') {
      const { status, body } = await controller.put(httpRequest);
      res.status(status).send(body);
    } else if (req.method === 'DELETE') {
      const { status, body } = await controller.put(httpRequest);
      res.status(status).send(body);
    };
  };
};
