import { Item } from '@resume-site/shared';
import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/itemRoutes';
import autocompleteRoutes from './routes/autocompleteRoutes';

const app = express();
app.use(express.json());
// app.use(cors({ origin: 'http://localhost:4200' })); // Only allow requests from localhost:4200
app.use(cors({ origin: '*' })); // Only allow requests from localhost:4200
// app.use(
//   cors({ origin: 'https://resume-site-d8i5brpo3-codster76.vercel.app/' })
// );
app.use('/api/items', itemRoutes); // /api/items is the url everything will be accessible from
app.use('/api/autocomplete', autocompleteRoutes);

app.get('/', (req: any, res: any) => {
  res.send('Yep, this is the backend for my site');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Connected on port ${port}`);
});
