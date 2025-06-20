import { useEffect, useState } from 'react';

const useCSSVariable = (variableName, fallback = '') => {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    const update = () => {
      const v = getComputedStyle(document.body).getPropertyValue(variableName);
      setValue(v?.trim() || fallback);
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, [variableName, fallback]);

  return value;
};

export default useCSSVariable;
