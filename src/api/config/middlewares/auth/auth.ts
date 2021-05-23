import { Request, Response, NextFunction } from 'express';
import { Jwt } from '../../../utils';
import { User } from '../../../protocols';
import { notAuthorizedError } from '../../../helper/handleError';

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.token;
    const jwt = new Jwt();
    const user: User = jwt.decode(token);
    req.body.userId = user.id;
    next();
  } catch {
    const { status, body } = notAuthorizedError();
    res.status(status).send(body);
  }
};
