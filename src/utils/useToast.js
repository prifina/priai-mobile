import {useCallback, useState, useEffect} from 'react';

const useToast = () => {
  const [toastConfig, setToastConfig] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToastConfig({message, type});
  }, []);

  const hideToast = useCallback(() => {
    setToastConfig(null);
  }, []);

  return {toastConfig, showToast, hideToast};
};

export default useToast;
