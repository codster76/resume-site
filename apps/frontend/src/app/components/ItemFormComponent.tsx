import { useForm } from 'react-hook-form';
import { Item, itemSchema } from '@resume-site/shared';
import { useEffect, useState } from 'react';
import { updateItem } from '../BackendCalls';
import { ZodError, ZodIssue } from 'zod';

export interface ItemFormComponentProps {
  itemToDisplay: Item;
}

const ItemFormComponent = (props: ItemFormComponentProps) => {
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

  const [errorMessages, updateErrorMessage] = useState<string[]>([]);
  const [showErrorMessage, updateShowErrorMessage] = useState<boolean>(false);

  // Resets the values in the form whenever the state changes. The forms get stuck at their initial values if you don't use this.
  useEffect(() => {
    reset({
      id: props.itemToDisplay.id,
      name: props.itemToDisplay.name,
      description: props.itemToDisplay.description,
      quantity: props.itemToDisplay.quantity,
      value: props.itemToDisplay.value,
      weight: props.itemToDisplay.weight,
    });
  }, [props.itemToDisplay]);

  // I'm not sure if this is a good way to update the data in the program, but it seems to work okay
  const submitBehaviour = (data: Item) => {
    try {
      itemSchema.parse(data);

      updateShowErrorMessage(true);

      // Update the item in the internal list
      props.itemToDisplay.name = data.name;
      props.itemToDisplay.description = data.description;
      props.itemToDisplay.quantity = data.quantity;
      props.itemToDisplay.value = data.value;
      props.itemToDisplay.weight = data.weight;

      // Update the item in hte database
      updateItem(props.itemToDisplay, props.itemToDisplay.id);

      console.log(props.itemToDisplay);
    } catch (e) {
      updateShowErrorMessage(false);

      if (e instanceof ZodError) {
        const errorList: string[] = [];
        for (let i = 0; i < e.issues.length; i++) {
          errorList[i] = `${e.issues[i].path[0]} Error: ${e.issues[i].message}`;
        }
        updateErrorMessage(errorList);
      } else {
        updateErrorMessage(['Unknown Error']);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit((data: Item) => submitBehaviour(data))}>
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
        style={showErrorMessage ? { display: 'none' } : { display: 'block' }}
      >
        {errorMessages.map((errorMessage) => (
          <div>{errorMessage}</div>
        ))}
      </div>
    </div>
  );
};

export default ItemFormComponent;
