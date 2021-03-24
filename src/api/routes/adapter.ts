import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../protocols';

export const routeAdapter = (controller: Controller) => {
  return async(req: Request, res: Response) => {
    const httpRequest: HttpRequest = { body: req.body };
    if (req.method === 'GET') {
      const httpResponse = await controller.get(httpRequest);
      res.status(httpResponse).send(httpResponse.body);
    } else if (req.method === 'POST') {
      const httpResponse = await controller.post(httpRequest);
      res.status(httpResponse).send(httpResponse.body);
    } else if (req.method === 'PUT') {
      const httpResponse = await controller.put(httpRequest);
      res.status(httpResponse).send(httpResponse.body);
    } else if (req.method === 'DELETE') {
      const httpResponse = await controller.put(httpRequest);
      res.status(httpResponse).send(httpResponse.body);
    };
  };
};
