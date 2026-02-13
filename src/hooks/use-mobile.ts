import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Check immediately
    checkMobile();

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      checkMobile();
    };

    mql.addEventListener('change', onChange);
    window.addEventListener('resize', checkMobile);

    return () => {
      mql.removeEventListener('change', onChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
}
