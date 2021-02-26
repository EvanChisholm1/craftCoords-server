import { config } from 'dotenv';
config();
import mongoose from 'mongoose';
import app from './app';

mongoose
  .connect('mongodb://localhost/craftCoords', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to db'))
  .catch(err => {
    console.log(err);
  });

const PORT = process.env.PORT || 8080;
app.listen(8080, () => console.log(`listening on port: ${PORT}`));
