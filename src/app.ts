import express from 'express';
import routes from './routes';
import cors from 'cors';
import passport from 'passport';
import { handleErrors } from './lib/errors';
import './lib/passport';

const app = express();

app.use(express.json());

app.use(cors());

app.use(passport.initialize());

app.use('/', routes);

app.use(handleErrors);

export default app;
