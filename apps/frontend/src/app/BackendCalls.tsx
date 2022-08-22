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
  async function updateItem() {
    const header = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...itemToReplaceWith }),
    };
    const response = await fetch(`${APIUrl}/${IDOfItemToReplace}`, header);
    const data = await response.json();
    console.log(data);
  }
  updateItem();
};
