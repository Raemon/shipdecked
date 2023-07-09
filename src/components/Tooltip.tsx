import React, { useState, useRef } from 'react';
import { usePopper } from 'react-popper';

export const Tooltip = ({ children, tooltip, display="block" }:{
  children:React.ReactNode, 
  tooltip:React.ReactNode|string,
  display?:'block'|'inline-block'|'inline'
}) => {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef(null);
  const tooltipRef = useRef(null);
  const { styles, attributes } = usePopper(buttonRef.current, tooltipRef.current);

  const tooltipStyle = {
    ...styles.popper,
    zIndex: 9999,
    // You can add other styles such as background, color etc.
    backgroundColor: 'rgba(0,0,0,.5)',
    color: 'white',
    padding: 6,
    borderRadius: 4,
    fontSize: 10
  };

  let timeoutId: NodeJS.Timeout|null = null;

  const showTooltip = () => {
    setVisible(true);
  }

  const hideTooltip = () => {
    timeoutId = setTimeout(() => {
      setVisible(false);
    }, 100);  // delay in milliseconds
  }

  const clearHideTimeout = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  return (
    <>
      <div
        ref={buttonRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{ display: display }}
      >
        {children}
      </div>
      {visible && (
        <div
          ref={tooltipRef}
          style={tooltipStyle}
          {...attributes.popper}
          onMouseEnter={clearHideTimeout}
          onMouseLeave={hideTooltip}
        >
          {tooltip}
        </div>
      )}
    </>
  )
}
