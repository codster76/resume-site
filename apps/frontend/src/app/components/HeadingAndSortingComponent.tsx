import { Item } from '@resume-site/shared';
import style from '../css_modules/ItemComponent.module.css';
import React, { Reducer, useReducer, useState } from 'react';

export interface HeadingAndSortingComponentProps {
  items: Item[];
  updateItems: React.Dispatch<React.SetStateAction<Item[]>>; // Why do I have to use this stupid type?
}

interface HeadingState {
  currentHeading: string;
  updateHeading: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  sortFunctionAscending: (a: Item, b: Item) => number;
  sortFunctionDescending: (a: Item, b: Item) => number;
  sortingState: SortingStates;
}

type SortingStates = 'unsorted' | 'ascending' | 'descending';

let lastModified: HeadingState;
let stateList: HeadingState[];

// To add a new heading, just add a new state, then add that state to the stateList

type State = {
  nameHeading: string;
  descriptionHeading: string;
};

type Action =
  | {
      type: 'updateNameHeading';
      payload: string;
    }
  | {
      type: 'updateDescriptionHeading';
      payload: string;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'updateDescriptionHeading':
      return {
        ...state,
        nameHeading: action.payload,
      };
    case 'updateNameHeading':
      return {
        ...state,
        descriptionHeading: action.payload,
      };
  }
};

const useCustomHook = () => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, {
    descriptionHeading: 'Description',
    nameHeading: 'Name',
  });
  return { state, dispatch };
};

const HeadingAndSortingComponent = (props: HeadingAndSortingComponentProps) => {
  const { state, dispatch } = useCustomHook();

  const [nameHeading, updateNameHeading] = useState('Name');
  const [descriptionHeading, updateDescriptionHeading] =
    useState('Description');
  const [quantityHeading, updateQuantityHeading] = useState('Quantity');
  const [valueHeading, updateValueHeading] = useState('Value');
  const [weightHeading, updateWeightHeading] = useState('Weight');

  // This array is made so that all of the states can be iterated through to display
  // These if statements are necessary because react will rerun this code and redeclare these variables
  if (!stateList) {
    stateList = [
      {
        currentHeading: nameHeading,
        updateHeading: updateNameHeading,
        name: 'Name',
        sortFunctionAscending: (a, b) => a.name.localeCompare(b.name),
        sortFunctionDescending: (a, b) => b.name.localeCompare(a.name),
        sortingState: 'unsorted',
      },
      {
        currentHeading: descriptionHeading,
        updateHeading: updateDescriptionHeading,
        name: 'Description',
        sortFunctionAscending: (a, b) =>
          a.description.localeCompare(b.description),
        sortFunctionDescending: (a, b) =>
          b.description.localeCompare(a.description),
        sortingState: 'unsorted',
      },
      {
        currentHeading: quantityHeading,
        updateHeading: updateQuantityHeading,
        name: 'Quantity',
        sortFunctionAscending: (a, b) => a.quantity - b.quantity,
        sortFunctionDescending: (a, b) => b.quantity - a.quantity,
        sortingState: 'unsorted',
      },
      {
        currentHeading: valueHeading,
        updateHeading: updateValueHeading,
        name: 'Value',
        sortFunctionAscending: (a, b) => a.value - b.value,
        sortFunctionDescending: (a, b) => b.value - a.value,
        sortingState: 'unsorted',
      },
      {
        currentHeading: weightHeading,
        updateHeading: updateWeightHeading,
        name: 'Weight',
        sortFunctionAscending: (a, b) => a.weight - b.weight,
        sortFunctionDescending: (a, b) => b.weight - a.weight,
        sortingState: 'unsorted',
      },
    ];
  }

  // To ensure lastModified always has a value
  if (!lastModified) {
    lastModified = stateList[0];
  }

  const headingClickBehaviour = (currentState: HeadingState) => {
    // If the same heading is clicked in succession
    if (lastModified.name === currentState.name) {
      switch (currentState.sortingState) {
        case 'unsorted':
          props.updateItems([
            ...props.items.sort(currentState.sortFunctionAscending),
          ]);

          currentState.updateHeading(currentState.name + '↓');
          currentState.currentHeading = currentState.name + '↓'; // I really don't know why updating the state doesn't update the labels, but whatever
          currentState.sortingState = 'ascending';

          break;
        case 'ascending':
          props.updateItems([
            ...props.items.sort(currentState.sortFunctionDescending),
          ]);

          currentState.updateHeading(currentState.name + '↑');
          currentState.currentHeading = currentState.name + '↑';
          currentState.sortingState = 'descending';

          break;
        case 'descending':
          props.updateItems([
            ...props.items.sort(currentState.sortFunctionAscending),
          ]);

          currentState.updateHeading(currentState.name + '↓');
          currentState.currentHeading = currentState.name + '↓';
          currentState.sortingState = 'ascending';

          break;
      }
    }
    // If a different heading is clicked
    else {
      // Sort
      props.updateItems([
        ...props.items.sort(currentState.sortFunctionAscending),
      ]);

      // Reset the previous heading
      lastModified.updateHeading(lastModified.name);
      lastModified.currentHeading = lastModified.name;
      lastModified.sortingState = 'unsorted';

      // Modify the heading that was just clicked
      currentState.sortingState = 'ascending';
      currentState.updateHeading(currentState.name + '↓');
      currentState.currentHeading = currentState.name + '↓';
    }
    lastModified = currentState;
  };

  return (
    <div>
      <div className={style['flexContainer']} style={{ userSelect: 'none' }}>
        {stateList.map((state) => (
          <div
            className={style['flexItem']}
            onClick={() => headingClickBehaviour(state)}
          >
            {state.currentHeading}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeadingAndSortingComponent;
