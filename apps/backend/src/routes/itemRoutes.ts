import express from 'express';
import { uid } from 'uid';
import { Item } from '@resume-site/shared'; // This is the item type interface
import untypedData from '../assets/items.json';

const data = untypedData as unknown as Item[];
const router = express.Router();
// const data: Item[] = require('../../items.json'); // This is my fake database.

// Send all items
router.get('/', (req: any, res: any) => {
  res.send(data);
});

// Send a specific item
router.get('/:id', (req: any, res: any) => {
  const requestedItem: Item | undefined = data.find((item) => {
    return item.id === req.params.id;
  });

  if (requestedItem === undefined) {
    res.status(404);
    res.send('No item matching that name');
    return;
  }
  res.send(requestedItem);
});

// Add a new item
router.post('/', (req: any, res: any) => {
  // Input checking
  if (checkIfItem(req.body)) {
    res.status(400).send('Invalid item');
    return;
  }

  // We are assuming the request will be a valid item
  const newItem: Item = {
    id: uid(),
    name: req.body.name,
    description: req.body.description,
    value: req.body.value,
    weight: req.body.weight,
    quantity: req.body.quantity,
  };
  data.push(newItem);
  res.send(newItem);
});

// Modify an existing item
router.put('/:id', (req: any, res: any) => {
  // Checking if the item to modify exists
  const itemToFind: Item | undefined = data.find((item) => {
    return item.id === req.params.id;
  });

  if (itemToFind === undefined) {
    res.status(404).send('Item does not exist');
    return;
  }

  // Input checking
  if (checkIfItem(req.body)) {
    res.status(400).send('Invalid item');
    return;
  }

  // Modify the item
  itemToFind.name = req.body.name;
  itemToFind.description = req.body.description;
  itemToFind.value = req.body.value;
  itemToFind.weight = req.body.weight;
  itemToFind.quantity = req.body.quantity;

  res.send(data);
});

router.delete('/:id', (req: any, res: any) => {
  // Checking if the item to modify exists
  const itemToFind: Item | undefined = data.find((item) => {
    return item.id === req.params.id;
  });

  if (itemToFind === undefined) {
    res.status(404).send('Item does not exist');
    return;
  }

  const itemIndex = data.indexOf(itemToFind);
  res.send(data.splice(itemIndex, 1));
});

function checkIfItem(item: Item): boolean {
  if (
    !item.name ||
    !item.description ||
    !item.value ||
    !item.weight ||
    !item.quantity
  ) {
    return true;
  } else {
    return false;
  }
}

export default router;
