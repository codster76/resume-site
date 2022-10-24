import express from 'express';
import { itemSchema, newBagSchema } from '@resume-site/shared'; // This is the item type interface
import untypedData from '../assets/items.json';
import { ZodError } from 'zod';
import { getAllItemsFromBag, getSingleItemFromBag, addItemToBag, createNewBag, modifyItem, deleteItem } from '../app/databaseCalls';

const fullItemList = itemSchema.array().parse(untypedData);
const router = express.Router();

// Used for testing
router.get('/', async (req: any, res: any) => {
  // await deleteItem('poopbag', 'poopbagpassword', 'sadfsafaf');
  res.send(await deleteItem('poopbag', 'poopbagpassword', '6d30df7b-56e9-4b0d-b9bd-75f4c00601e0'));
});

// Get all items from a specific bag
router.get('/:bagName/:bagPassword', async (req: any, res: any) => {
  const result = await getAllItemsFromBag(req.params.bagName, req.params.bagPassword);

  if(isDbError(result)) {
    res.status(400).send((result as dbError).dbErrorMessage);
  } else {
    res.send(result);
  }
});

// Get a specific item from a bag based on ID
router.get('/:bagName/:bagPassword/:itemId', async (req: any, res: any) => {
  const result = await getSingleItemFromBag(req.params.bagName, req.params.bagPassword, req.params.itemId);

  if(isDbError(result)) {
    res.status(400).send((result as dbError).dbErrorMessage);
  } else {
    res.send(result);
  }
});

// Add a new item
router.post('/:bagName/:bagPassword', async (req: any, res: any) => {
  try {
    itemSchema.parse(req.body);

    const result = await addItemToBag(req.params.bagName, req.params.bagPassword, req.body);

    if(isDbError(result)) {
      res.status(400).send((result as dbError).dbErrorMessage);
    } else {
      res.send(result);
    }
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

// req.body should be an object with a name and password
router.post('/newbag', async (req: any, res: any) => {
  try {
    console.log(newBagSchema.parse(req.body));

    const result = await createNewBag(req.body.name, req.body.password);

    if(isDbError(result)) {
      res.status(400).send((result as dbError).dbErrorMessage);
    } else {
      res.send(result);
    }
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

router.put('/:bagName/:bagPassword', async (req: any, res: any) => {
  try {
    itemSchema.parse(req.body);

    const result = await modifyItem(req.params.bagName, req.params.bagPassword, req.body);

    if(isDbError(result)) {
      res.status(400).send((result as dbError).dbErrorMessage);
    } else {
      res.send(result);
    }
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

router.delete('/:bagName/:bagPassword/:idToDelete', async (req: any, res: any) => {
  const result = await deleteItem(req.body.bagName, req.body.bagPassword, req.body.idToDelete);

  if(isDbError(result)) {
    res.status(400).send((result as dbError).dbErrorMessage);
  } else {
    res.send(result);
  }
});

function generateErrorMessage(errors: ZodError) {
  let errorMessage = '';
  errors.issues.forEach(
    (error) => (errorMessage += `${error.path[0]} error: ${error.code}, `)
  );

  return errorMessage;
};

export interface dbError {
  dbErrorMessage: string
}

export function isDbError(objectToCheck: any) {
  return 'dbErrorMessage' in objectToCheck;
}

export default router;
