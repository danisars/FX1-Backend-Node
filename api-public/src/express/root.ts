import {Express} from 'express';

export default function (app: Express) {
  app.get('/', (req, res, next) => {
    res.sendStatus(200);
    next();
  });
}
