import { Item } from '@resume-site/shared'; // This is the item type interface
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaClient } from '@prisma/client';
import { dbError } from '../routes/itemRoutes';

const prisma = new PrismaClient();

export async function getAllItemsFromBag(bagName: string, bagPassword: string) {
    try {
      const bag = await prisma.bag.findUniqueOrThrow({
        where: { name: bagName },
        include: { items: true }
      });
  
      if(bag.password !== bagPassword) {
        return { dbErrorMessage: 'Wrong password' } as dbError;
      }
    
      return bag.items;
    } catch (e) {
      if(e instanceof NotFoundError) {
        return { dbErrorMessage: 'Bag not found' } as dbError;
      }
    }
  }
  
  export async function getSingleItemFromBag(bagName: string, bagPassword: string, itemId: string) {
    try {
      const bag = await prisma.bag.findUniqueOrThrow({
        where: { name: bagName},
        include: { items: true }
      });
  
      if(bag.password !== bagPassword) {
        return { dbErrorMessage: 'Wrong password' } as dbError;
      }
    
      const itemToFind = bag.items.find(item => item.id === itemId);
      
      if(itemToFind === undefined) {
        return { dbErrorMessage: 'Item not found' } as dbError;
      } else {
        return bag.items.find(item => item.id === itemId);
      }
    } catch (e) {
      if(e instanceof NotFoundError) {
        return { dbErrorMessage: 'Bag not found' } as dbError;
      }
    }
  }
  
  export async function addItemToBag(bagName: string, bagPassword: string, itemToAdd: Item) {
    try {
      const bag = await prisma.bag.findUniqueOrThrow({
        where: {
          name: bagName
        }
      });
  
      if(bag.password !== bagPassword) {
        return { dbErrorMessage: 'Wrong password' } as dbError;
      }
    
      return await prisma.item.create({
        data: { ...itemToAdd, id: undefined, ownerId: bag.id }
      });
    } catch (e) {
      if(e instanceof NotFoundError) {
        return { dbErrorMessage: 'Bag not found' } as dbError;
      }
    }
  }
  
  export async function modifyItem(bagName: string, bagPassword: string, itemToUpdateTo: Item) {
    try {
      const bag = await prisma.bag.findUniqueOrThrow({
        where: {
          name: bagName
        }
      });
  
      if(bag.password !== bagPassword) {
        return { dbErrorMessage: 'Wrong password' } as dbError;
      }
    
      return await prisma.item.update({
        where: {
          id: itemToUpdateTo.id
        },
        data: {
          name: itemToUpdateTo.name,
          description: itemToUpdateTo.description,
          value: itemToUpdateTo.value,
          quantity: itemToUpdateTo.quantity,
          weight: itemToUpdateTo.weight
        }
      });
    } catch (e) {
      if(e instanceof NotFoundError) {
        return { dbErrorMessage: 'Bag not found' } as dbError;
      }
    }
  }
  
  export async function deleteItem(bagName: string, bagPassword: string, itemID: string) {
    try {
      const bag = await prisma.bag.findUniqueOrThrow({
        where: {
          name: bagName
        }
      });
  
      if(bag.password !== bagPassword) {
        return { dbErrorMessage: 'Wrong password' } as dbError;
      }
    
      // If the item exists, delete it, otherwise, throw an error
      try {
        // This is just here to throw an error if the item does not exist
        await prisma.item.findFirstOrThrow({
          where: {
            id: itemID
          }
        });
  
        const item = await prisma.item.delete({
          where: {
            id: itemID
          }
        });
      
        return item;
      } catch (e) {
        if(e instanceof NotFoundError) {
          return { dbErrorMessage: 'Item does not exist' } as dbError;
        }
      }
    } catch (e) {
      if(e instanceof NotFoundError) {
        return { dbErrorMessage: 'Bag not found' } as dbError;
      }
    }
  }
  
  export async function createNewBag(newBagName: string, newBagPassword: string) {
    try {
      await prisma.bag.findUniqueOrThrow({
        where: {
          name: newBagName
        }
      });
  
      return { dbErrorMessage: 'Bag already exists' } as dbError;
    } catch (e) {
      if(e instanceof NotFoundError) {
        await prisma.bag.create({
          data: { name: newBagName, password: newBagPassword }
        });
      
        return `Bag ${newBagName} successfully created`;
      }
    }
  }