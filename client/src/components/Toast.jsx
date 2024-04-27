import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const errorMessage = (message) => {
  toast.error(message, {
    position: 'bottom-right',
  });
};

const successMessage = (message) => {
    toast.success(message, {
      position: 'bottom-right',
    });
  };

export {successMessage, errorMessage};