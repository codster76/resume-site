import { useState } from 'react';
import { Item } from '@resume-site/shared';
import itemStyle from '../css_modules/ItemComponent.module.css';
import modalStyle from '../css_modules/modalComponent.module.css';
import itemFormStyle from '../css_modules/ItemForm.module.css';

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
          <form onSubmit={itemFormChangeNameLater}>
            <div style={{ display: 'flex' }}>
              <label>Name: </label>
              <input
                type="text"
                placeholder="Item Name"
                value={props.item.name}
                onChange={
                  (e) =>
                    (props.item.name =
                      e.target.value) /* Why isn't this working??? */
                }
              ></input>
            </div>
            <div style={{ display: 'flex' }}>
              <label>Description: </label>
              <input
                type="text"
                placeholder="Description"
                value={props.item.description}
                onChange={(e) => console.log(e.target.value)}
              ></input>
            </div>
            <div style={{ display: 'flex' }}>
              <label>Quantity: </label>
              <input
                type="number"
                value={props.item.quantity}
                onChange={(e) => console.log(e.target.value)}
              ></input>
            </div>
            <div style={{ display: 'flex' }}>
              <label>Value: </label>
              <input
                type="number"
                value={props.item.value}
                onChange={(e) => console.log(e.target.value)}
              ></input>
            </div>
            <div style={{ display: 'flex' }}>
              <label>Weight: </label>
              <input
                type="number"
                value={props.item.weight}
                onChange={(e) => console.log(e.target.value)}
              ></input>
            </div>
            <input type="submit" value="Save Item" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemComponent;
