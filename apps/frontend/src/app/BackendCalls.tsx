import { Item } from '@resume-site/shared';

const APIUrl = 'http://localhost:5000/api/items';

// Get items
export const getItemList = async () => {
  const res = await fetch(APIUrl);
  const items = await res.json();

  return items;
};

// Update an item
export const updateItem = (
  itemToReplaceWith: Item,
  IDOfItemToReplace: string
) => {
  console.log(`database updated for: ${IDOfItemToReplace}`);
  async function updateItemAsync() {
    const header = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...itemToReplaceWith }),
    };
    const response = await fetch(`${APIUrl}/${IDOfItemToReplace}`, header);
    const data = await response.json();
    console.log(data);
  }
  updateItemAsync();
};

// Add an item
export const addItem = (itemToAdd: Item) => {
  async function addItemAsync() {
    const header = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...itemToAdd }),
    };
    const response = await fetch(`${APIUrl}`, header);
    const data = await response.json();
    console.log(data);
  }
  addItemAsync();
};

export const deleteItem = (idToDelete: string) => {
  async function deleteItemAsync() {
    const header = {
      method: 'DELETE',
    };
    const response = await fetch(`${APIUrl}/${idToDelete}`, header);
    const data = await response.json();
    console.log(data);
  }
  deleteItemAsync();
};
