/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class requireLoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.json({
        message: 'User must be logged in!',
      });
    }
    const token = authorization.replace('Bearer ', '');
    verify(token, process.env.SECRET, (err: Error, payload: any) => {
      if (err) {
        return res.json({
          message: 'Not Authorized!',
        });
      }
      req.body = { ...req.body, auth_user: payload };
      next();
    });
  }
}
