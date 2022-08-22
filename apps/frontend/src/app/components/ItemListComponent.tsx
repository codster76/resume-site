import { Item } from '@resume-site/shared';
import { uid } from 'uid';
import style from '../css_modules/ItemComponent.module.css';
import ItemComponent from './ItemComponent';

// Component that contains all item components

export interface ItemListComponentProps {
  itemArray: Item[];
}

const ItemListComponent = (props: ItemListComponentProps) => {
  return (
    <div>
      {props.itemArray.map((item) => (
        <ItemComponent
          key={uid() /* Honestly just a hacky way to avoid errors */}
          item={item}
        />
      ))}
    </div>
  );
};

export default ItemListComponent;
