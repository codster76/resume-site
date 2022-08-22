import express from 'express';
import { uid } from 'uid';
import { Item, itemSchema } from '@resume-site/shared'; // This is the item type interface
import untypedData from '../assets/items.json';
import { ZodError } from 'zod';

const data = untypedData as unknown as Item[];
const router = express.Router();

// Get all items
router.get('/', (req: any, res: any) => {
  res.send(data);
});

// Get a specific item based on ID
router.get('/:id', (req: any, res: any) => {
  const requestedItem: Item | undefined = data.find((item) => {
    return item.id === req.params.id;
  });

  if (requestedItem === undefined) {
    res.status(404);
    res.send(`Item with ID: ${req.params.id} could not be found`);
    return;
  }
  res.send(requestedItem);
});

// Add a new item
router.post('/', (req: any, res: any) => {
  try {
    itemSchema.parse(req.body);

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
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).send(generateErrorMessage(e));
      return;
    } else {
      res.status(400).send('Invalid item');
      return;
    }
  }
});

// Modify an existing item
router.put('/:id', (req: any, res: any) => {
  // Checking if the item to modify exists
  const itemToFind: Item | undefined = data.find((item) => {
    return item.id === req.params.id;
  });

  if (itemToFind === undefined) {
    res.status(404).send(`Item with ID: ${req.params.id} could not be found`);
    return;
  }

  try {
    itemSchema.parse(req.body);

    // Modify the item
    itemToFind.name = req.body.name;
    itemToFind.description = req.body.description;
    itemToFind.value = req.body.value;
    itemToFind.weight = req.body.weight;
    itemToFind.quantity = req.body.quantity;

    res.send(data);
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).send(generateErrorMessage(e));
      return;
    } else {
      res.status(400).send('Invalid item');
      return;
    }
  }
});

router.delete('/:id', (req: any, res: any) => {
  // Checking if the item to modify exists
  const itemToFind: Item | undefined = data.find((item) => {
    return item.id === req.params.id;
  });

  if (itemToFind === undefined) {
    res.status(404).send(`Item with ID: ${req.params.id} could not be found`);
    return;
  }

  const itemIndex = data.indexOf(itemToFind);
  res.send(data.splice(itemIndex, 1));
});

const generateErrorMessage = (errors: ZodError): string => {
  let errorMessage = '';
  errors.issues.forEach(
    (error) => (errorMessage += `${error.path[0]} error: ${error.code}, `)
  );

  return errorMessage;
};

export default router;
