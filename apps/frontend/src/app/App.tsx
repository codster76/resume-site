import React, { useEffect, useState } from 'react'; // useEffect runs right after rendering or whenever a value updates
import { Item } from '@resume-site/shared';
import styles from './css_modules/App.module.css';

// Components
import ItemComponent, { ItemComponentProps } from './components/ItemComponent';
import ItemListComponent from './components/ItemListComponent';
import HeadingAndSortingComponent from './components/HeadingAndSortingComponent';

function App() {
  const [itemList, updateItemList] = useState<Item[]>([
    {
      id: '0',
      name: 'default',
      description: 'default',
      value: 0,
      weight: 0,
      quantity: 0,
    },
  ]);

  const [displayModal, updateDisplayModal] = useState(false);

  const [sortingFunction, updateSortingFunction] = useState(
    () => (a: Item, b: Item) => parseInt(a.id) - parseInt(b.id)
  ); // Needs to take a function in a function for some reason

  const labels: Item = {
    id: 'id',
    name: 'name',
    description: 'description',
    value: 0,
    weight: 0,
    quantity: 0,
  };

  // This basically runs right after rendering and fetches the item data
  useEffect(() => {
    const getItems = async () => {
      const itemsFromServer = await fetchItems();
      updateItemList([...itemsFromServer]);
    };

    getItems();
  }, []); // You can put dependency values in this array, which can run this code whenever that value changes

  const fetchItems = async () => {
    const res = await fetch('http://localhost:5000/api/items');
    const items = await res.json();

    return items;
  };

  return (
    <div className={styles['background']}>
      <HeadingAndSortingComponent
        items={itemList}
        updateItems={updateItemList}
      />
      <ItemListComponent itemArray={itemList} />
      <button
        onClick={() =>
          updateItemList([
            {
              id: '7',
              name: 'test',
              description: 'test',
              value: 1,
              weight: 2,
              quantity: 3,
            },
          ])
        }
      >
        TestButton
      </button>
    </div>
  );

  //<ItemComponent item={itemList[Math.min(0,itemList.length)] /* Math.min in there basically doesn't allow you to put any number higher than the array length */} />
  //<button onClick={updateItemList([{id: 7, name: 'test', description: 'test', value: 1, weight: 2, quantity: 3}])}>TestButton</button>
}

export default App;
