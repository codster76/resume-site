import { useForm } from 'react-hook-form';
import { Item } from '@resume-site/shared';
import { useEffect } from 'react';

export interface ItemFormComponentProps {
  itemToDisplay: Item;
}

const ItemFormComponent = (props: ItemFormComponentProps) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      Name: props.itemToDisplay.name,
      Description: props.itemToDisplay.description,
      Quantity: props.itemToDisplay.quantity,
      Value: props.itemToDisplay.value,
      Weight: props.itemToDisplay.weight,
    },
  });

  // Resets the values in the form whenever the state changes. The forms get stuck at their initial values if you don't use this.
  useEffect(
    () =>
      reset({
        Name: props.itemToDisplay.name,
        Description: props.itemToDisplay.description,
        Quantity: props.itemToDisplay.quantity,
        Value: props.itemToDisplay.value,
        Weight: props.itemToDisplay.weight,
      }),
    [props.itemToDisplay]
  );

  // NOTE: I'm pretty sure this is not a good way to modify the data set, but it does work. Might need to implement proper state modification.
  const submitBehaviour = (data: any) => {
    props.itemToDisplay.name = data.Name;
    props.itemToDisplay.description = data.Description;
    props.itemToDisplay.quantity = data.Quantity;
    props.itemToDisplay.value = data.Value;
    props.itemToDisplay.weight = data.Weight;
    console.log(props.itemToDisplay);
  };

  return (
    <form onSubmit={handleSubmit((data) => submitBehaviour(data))}>
      <div style={{ display: 'flex' }}>
        <label>Name: </label>
        <input
          {...register('Name')}
          type="text"
          placeholder="Item Name"
        ></input>
      </div>
      <div style={{ display: 'flex' }}>
        <label>Description: </label>
        <input
          {...register('Description')}
          type="text"
          placeholder="Description"
        ></input>
      </div>
      <div style={{ display: 'flex' }}>
        <label>Quantity: </label>
        <input {...register('Quantity')} type="number"></input>
      </div>
      <div style={{ display: 'flex' }}>
        <label>Value: </label>
        <input {...register('Value')} type="number"></input>
      </div>
      <div style={{ display: 'flex' }}>
        <label>Weight: </label>
        <input {...register('Weight')} type="number"></input>
      </div>
      <input type="submit" value="Save Item" />
    </form>
  );
};

export default ItemFormComponent;
