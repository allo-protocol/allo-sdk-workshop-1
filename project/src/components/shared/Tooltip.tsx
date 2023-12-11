import { useState, useRef, useEffect } from "react";

const Tooltip = (props: { children: JSX.Element | JSX.Element[] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tooltipRef.current) {
      // Dynamically set the width based on the content
      const contentWidth = tooltipRef.current.scrollWidth;
      tooltipRef.current.style.width = `${contentWidth}px`;
    }
  }, [props.children]);

  return (
    <div className={`group flex relative ${isHovered ? "hovered" : ""}`}>
      <span
        className="text-sm text-gray-400"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        &#128712;
      </span>
      {isHovered && (
        <div
          ref={tooltipRef}
          className="font-bold opacity-100 transition-opacity bg-gray-200 px-1 text-sm text-gray-600 rounded-md absolute left-1/2 -translate-x-1/2 m-4 mx-auto p-2 mt-5"
        >
          {props.children}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
