import { useEffect } from 'react';

const useFrameBusting = () => {
  useEffect(() => {
    if (window?.top && window !== window.top) {
      window.top.location.href = window.location.href;
    }
  }, []);
};

export default useFrameBusting;
