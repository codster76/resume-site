import { Item } from '@resume-site/shared';
import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/itemRoutes';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Only allow requests from localhost:3000
app.use('/api/items', itemRoutes); // /api/items is the url everything will be accessible from

app.get('/', (req: any, res: any) => {
  res.send('asdgasdg');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Connected on port ${port}`);
});
