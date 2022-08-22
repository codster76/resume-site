import { PropsWithChildren, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import itemStyle from '../css_modules/ItemComponent.module.css';
import modalStyle from '../css_modules/modalComponent.module.css';

// PropsWithChildren essentially allows you to nest other components inside this one where {children} is used
export interface ModalProps extends PropsWithChildren {
  open: boolean;
  updateOpen: (open: boolean) => void;
}

const modalRoot = document.getElementById('modal-root');

// Check if modal-root exists
if (!modalRoot) {
  throw Error('Must add element with id `modal-root` to the DOM');
}

const ModalComponent = (props: ModalProps) => {
  const elementAddedRef = useRef(false);
  const modalContainerRef = useRef<HTMLElement>(document.createElement('div'));

  useEffect(() => {
    if (!elementAddedRef.current) {
      modalRoot.append(modalContainerRef.current);
      elementAddedRef.current = true;
    }

    return () => {
      modalContainerRef.current.remove();
      elementAddedRef.current = false;
    };
  });

  return createPortal(
    props.open && (
      <div
        className={modalStyle['modalBackdrop']}
        onClick={() => props.updateOpen(false)}
      >
        <div
          className={modalStyle['modal']}
          onClick={(e) => e.stopPropagation()}
        >
          {props.children}
        </div>
      </div>
    ),
    modalContainerRef.current
  );
};

export default ModalComponent;
