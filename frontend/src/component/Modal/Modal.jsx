import { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import classes from './css/Modal.module.css';

const Modal = forwardRef(function Modal({ children }, ref) {
  return createPortal(
    <dialog ref={ref} className={classes.container}>
      <div className={classes.modal}>  
        <form className={classes.left} method="dialog">
          <button className={classes["close-button"]}>X</button>
        </form>          
        {children}
      </div>
    </dialog>
    , document.getElementById('modal')
  );
});

export default Modal;