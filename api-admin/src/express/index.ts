import express from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';

import health from './health';
import root from './root';

const app = express();
app.use(compression());
app.use(cors());
app.use(morgan('dev'));

health(app);
root(app);

export default app;
