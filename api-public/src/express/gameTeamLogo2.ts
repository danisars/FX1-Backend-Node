import * as admin from 'firebase-admin';
import {Express} from 'express';

export default function (app: Express) {
  app.get(/\/photos\/game\/team\/test\/logo\/(.*)/, async (req: any, res: any) => {
    try {
      const param = req.params['0'];
      res.type(param.substring(param.lastIndexOf('.') + 1));
      const file = admin.storage().bucket(global.storageBucketName).file(`game/team/test/logo/${param}`);
      const [exists] = await file.exists();
      if (!exists) {
        return res.status(404).json(null).end();
      }
      res.setHeader('Cache-control', 'public, max-age=31536000');
      file.createReadStream({decompress: true}).pipe(res);
    } catch (e) {
      console.error(e);
      res.sendStatus(404).end();
    }
  });
}
