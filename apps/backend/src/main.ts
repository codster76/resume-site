import { Item } from '@resume-site/shared';
import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/itemRoutes';

const app = express();
app.use(express.json());
<<<<<<< Updated upstream
//app.use(cors({ origin: 'http://localhost:4200' })); // Only allow requests from localhost:4200
app.use(
  cors({ origin: 'https://resume-site-d8i5brpo3-codster76.vercel.app/' })
);
=======
app.use(cors({ origin: 'http://localhost:4200' })); // Only allow requests from localhost:4200
// app.use(cors({ origin: '*' })); // Only allow requests from localhost:4200
// app.use(
//   cors({ origin: 'https://resume-site-d8i5brpo3-codster76.vercel.app/' })
// );
>>>>>>> Stashed changes
app.use('/api/items', itemRoutes); // /api/items is the url everything will be accessible from

app.get('/', (req: any, res: any) => {
  res.send('Yep, this is the backend for my site');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Connected on port ${port}`);
});
