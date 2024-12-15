import React, { useEffect, useRef, useState } from 'react';

const ScalingField = ({children}:{children: React.ReactNode}) => {
  const scalingRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [origin] = useState({x: 0, y: 0});
  
  const handleScroll = (event: WheelEvent) => {
    event.preventDefault();

    // Determine whether the scroll is up or down
    const scaleChange = event.deltaY > 0 ? -0.01 : 0.01;

    // Update the scale state
    setScale(prevScale => Math.min(Math.max(0.8, prevScale + scaleChange), 2));
  };

  useEffect(() => {
    if (!scalingRef.current) return;
    const element = scalingRef.current;
    // window.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('wheel', handleScroll);

    // Clean up event listener
    return () => {
      element.removeEventListener('wheel', handleScroll);
      // element.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <div style={{width: "100%", height: '100%'}} ref={scalingRef} >
      <div 
        style={{
          transform: `scale(${scale})`,
          transformOrigin: `${origin.x}px ${origin.y}px`,
          height: '100%',
          width: '100%',
        }}
      >
      { children }
      </div>
    </div>
  );
};

export default ScalingField;