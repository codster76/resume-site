import { useState } from 'react';
import { Item } from '@resume-site/shared';
import itemStyle from '../css_modules/ItemComponent.module.css';
import modalStyle from '../css_modules/modalComponent.module.css';
import itemFormStyle from '../css_modules/ItemForm.module.css';
import ItemFormComponent from './ItemFormComponent';

export interface ItemComponentProps {
  item: Item;
}

const itemFormChangeNameLater = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const ItemComponent = (props: ItemComponentProps) => {
  const [showModal, updateShowModal] = useState(false);

  return (
    <div>
      <div
        className={itemStyle['flexContainer']}
        onClick={() => updateShowModal(true)}
      >
        <div className={itemStyle['flexItem']}>{props.item.name}</div>
        <div className={itemStyle['flexItem']}>{props.item.description}</div>
        <div className={itemStyle['flexItem']}>{props.item.quantity}</div>
        <div className={itemStyle['flexItem']}>{props.item.value}</div>
        <div className={itemStyle['flexItem']}>{props.item.weight}</div>
      </div>

      <div
        className={modalStyle['modalBackdrop']}
        style={showModal ? { display: 'block' } : { display: 'none' }}
        onClick={() => updateShowModal(false)}
      ></div>
      <div
        className={modalStyle['modal']}
        style={showModal ? { display: 'block' } : { display: 'none' }}
      >
        <div className={modalStyle['modalContent']}>
          <ItemFormComponent itemToDisplay={props.item} />
        </div>
      </div>
    </div>
  );
};

export default ItemComponent;
