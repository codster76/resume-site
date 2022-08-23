import { useRef, useState } from 'react';
import { Item } from '@resume-site/shared';
import itemStyle from '../css_modules/ItemComponent.module.css';
import modalStyle from '../css_modules/modalComponent.module.css';
import itemFormStyle from '../css_modules/ItemForm.module.css';
import ItemFormComponent, {
  FormType,
  ItemFormComponentRefs,
} from './ItemFormComponent';
import ModalComponent from './ModalComponent';

export interface ItemComponentProps {
  item: Item;
}

const itemFormChangeNameLater = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const ItemComponent = (props: ItemComponentProps) => {
  const [showModal, updateShowModal] = useState(false);
  const formRef: any = useRef({
    resetFunction: () => console.log(''),
  }); // calling formRef.current.resetFunction() resets the form

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

      <ModalComponent open={showModal} updateOpen={updateShowModal}>
        <div className={modalStyle['modalContent']}>
          <ItemFormComponent
            ref={formRef}
            itemToDisplay={props.item}
            typeOfForm={FormType.Update}
            handleClose={() => updateShowModal(false)}
          />
        </div>
      </ModalComponent>
    </div>
  );
};

export default ItemComponent;
