import React, { createContext, useEffect, useState } from 'react'; // useEffect runs right after rendering or whenever a value updates
import { Item } from '@resume-site/shared';
import styles from './css_modules/App.module.css';
import modalStyle from './css_modules/modalComponent.module.css';
import { getItemList } from './BackendCalls';

// Components
import ItemComponent, { ItemComponentProps } from './components/ItemComponent';
import ItemListComponent from './components/ItemListComponent';
import HeadingAndSortingComponent from './components/HeadingAndSortingComponent';
import ModalComponent from './components/ModalComponent';
import ItemFormComponent, { FormType } from './components/ItemFormComponent';

export const globalState = createContext<{
  value: Item[];
  updateFunction: React.Dispatch<React.SetStateAction<Item[]>>;
}>({
  // I have no clue what the hell is with these types
  value: [
    {
      id: '0',
      name: 'default',
      description: 'default',
      value: 0,
      weight: 0,
      quantity: 0,
    },
  ],
  updateFunction: () => console.log('default'),
});

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
      const itemsFromServer = await getItemList();
      updateItemList([...itemsFromServer]);
    };

    getItems();
  }, []); // You can put dependency values in this array, which can run this code whenever that value changes

  return (
    <globalState.Provider
      value={{ value: itemList, updateFunction: updateItemList }}
    >
      <h2>Bad of Holding</h2>
      <div className={styles['background']}>
        <HeadingAndSortingComponent
          items={itemList}
          updateItems={updateItemList}
        />
        <ItemListComponent itemArray={itemList} />
        <button onClick={() => updateDisplayModal(true)}>Add Item</button>
        <ModalComponent open={displayModal} updateOpen={updateDisplayModal}>
          <div className={modalStyle['modalContent']}>
            <ItemFormComponent
              itemToDisplay={{
                id: '0',
                name: '',
                description: '',
                quantity: 0,
                value: 0,
                weight: 0,
              }}
              typeOfForm={FormType.Add}
              closeModal={() => updateDisplayModal(false)}
            />
          </div>
        </ModalComponent>
      </div>
    </globalState.Provider>
  );

  //<ItemComponent item={itemList[Math.min(0,itemList.length)] /* Math.min in there basically doesn't allow you to put any number higher than the array length */} />
  //<button onClick={updateItemList([{id: 7, name: 'test', description: 'test', value: 1, weight: 2, quantity: 3}])}>TestButton</button>
}

export default App;
