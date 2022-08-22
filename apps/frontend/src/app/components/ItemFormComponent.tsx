import { FormProvider, useForm } from 'react-hook-form';
import { Item, itemSchema } from '@resume-site/shared';
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { addItem, updateItem, deleteItem } from '../BackendCalls';
import { ZodError, ZodIssue } from 'zod';
import { uid } from 'uid';
import { globalState } from '../App';
import ItemListComponent from './ItemListComponent';

export interface ItemFormComponentProps {
  itemToDisplay: Item;
  typeOfForm: FormType;
  closeModal: () => void;
}

export enum FormType {
  Add,
  Update,
}

export interface ItemFormComponentRefs {
  resetFunction: () => void;
}

const ItemFormComponent = forwardRef((props: ItemFormComponentProps, ref) => {
  const [errorMessages, updateErrorMessage] = useState<string[]>([]);
  const [showErrorMessage, updateShowErrorMessage] = useState<boolean>(false);

  const globalItemState = useContext(globalState);

  // This will be invoked by the parent whenever the modal is closed so that the values reset after closing.
  useImperativeHandle(
    ref,
    () => {
      return {
        resetFunction: () => {
          runReset();
        },
      };
    },
    []
  ); // The empty array here can be used to update ref whenever a value changes

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      id: props.itemToDisplay.id,
      name: props.itemToDisplay.name,
      description: props.itemToDisplay.description,
      quantity: props.itemToDisplay.quantity,
      value: props.itemToDisplay.value,
      weight: props.itemToDisplay.weight,
    },
  });

  // Resets the values in the form whenever the state changes. The forms get stuck at their initial values if you don't use this.
  useEffect(() => {
    runReset();
  }, [props.itemToDisplay]);

  // It's honestly kind of a toss-up here. Editing props.itemToDisplay here probably isn't the best way to pull this off,
  // but also, trying to access it from the global state would require a search, which I don't think is optimal.
  const editItem = (data: Item) => {
    try {
      itemSchema.parse(data);

      updateShowErrorMessage(false);

      // Update the item in the internal list
      props.itemToDisplay.name = data.name;
      props.itemToDisplay.description = data.description;
      props.itemToDisplay.quantity = data.quantity;
      props.itemToDisplay.value = data.value;
      props.itemToDisplay.weight = data.weight;

      // Update the item in hte database
      updateItem(props.itemToDisplay, props.itemToDisplay.id);
      props.closeModal();

      console.log(props.itemToDisplay);
    } catch (e) {
      updateShowErrorMessage(true);

      if (e instanceof ZodError) {
        handleError(e);
      } else {
        updateErrorMessage(['Unknown Error']);
      }
    }
  };

  // I know updating the list on both client and server-side separately isn't a great idea, but considering large lists or slow
  // connections, this is probably better than having to fetch again every time an item is added
  const createNewItem = (data: Item) => {
    try {
      updateShowErrorMessage(false);

      itemSchema.parse(data);
      data.id = uid();
      addItem(data); // Update the item in the database
      globalItemState.updateFunction([...globalItemState.value, data]); // Note this one
      props.closeModal();
    } catch (e) {
      updateShowErrorMessage(true);

      if (e instanceof ZodError) {
        handleError(e);
      } else {
        updateErrorMessage(['Unknown Error']);
        console.log(e);
      }
    }
  };

  const deleteCurrentItem = () => {
    deleteItem(props.itemToDisplay.id);
    const listToModify = [...globalItemState.value];
    const itemIndex = globalItemState.value.indexOf(props.itemToDisplay);
    listToModify.splice(itemIndex, 1);
    globalItemState.updateFunction(listToModify);
    props.closeModal();
  };

  const handleError = (error: ZodError) => {
    const errorList: string[] = [];
    for (let i = 0; i < error.issues.length; i++) {
      errorList[
        i
      ] = `${error.issues[i].path[0]} Error: ${error.issues[i].message}`;
    }
    updateErrorMessage(errorList);
  };

  const runReset = () => {
    reset({
      id: props.itemToDisplay.id,
      name: props.itemToDisplay.name,
      description: props.itemToDisplay.description,
      quantity: props.itemToDisplay.quantity,
      value: props.itemToDisplay.value,
      weight: props.itemToDisplay.weight,
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit((data: Item) => {
          switch (props.typeOfForm) {
            case FormType.Add:
              createNewItem(data);
              break;
            case FormType.Update:
              editItem(data);
              break;
          }
        })}
      >
        <input {...register('id')} type="hidden"></input>
        <div style={{ display: 'flex' }}>
          <label>Name: </label>
          <input
            {...register('name')}
            type="text"
            placeholder="Item Name"
          ></input>
        </div>
        <div style={{ display: 'flex' }}>
          <label>Description: </label>
          <input
            {...register('description')}
            type="text"
            placeholder="Description"
          ></input>
        </div>
        <div style={{ display: 'flex' }}>
          <label>Quantity: </label>
          <input
            {...register('quantity', { valueAsNumber: true })} // Note: this register function can set the output type of the form.
            type="number"
            step="0.1"
          ></input>
        </div>
        <div style={{ display: 'flex' }}>
          <label>Value: </label>
          <input
            {...register('value', { valueAsNumber: true })}
            type="number"
            step="0.1"
          ></input>
        </div>
        <div style={{ display: 'flex' }}>
          <label>Weight: </label>
          <input
            {...register('weight', { valueAsNumber: true })}
            type="number"
            step="0.1"
          ></input>
        </div>
        <input type="submit" value="Save Item" />
      </form>
      <div
        style={showErrorMessage ? { display: 'block' } : { display: 'none' }}
      >
        {errorMessages.map((errorMessage) => (
          <div>{errorMessage}</div>
        ))}
      </div>

      <button onClick={() => deleteCurrentItem()}>Delete Item</button>
    </div>
  );
});

export default ItemFormComponent;
