import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface IFormToast {
    message: string;
    type?: 'error' | 'success';
}

export const callToast = ({message, type = 'error'}: IFormToast) => {
    switch(type) {
        case 'error': 
            toast.error(message);
            break;
        case 'success': 
            toast.success(message);
            break;
    }
}
  
export const ToastElement = () => {
    return (
        <ToastContainer
            position="top-center"
            autoClose={4000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="dark"
            containerId="test"
        />
    )
}
