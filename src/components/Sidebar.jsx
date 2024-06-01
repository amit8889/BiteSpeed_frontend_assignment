import { useEffect, useState } from 'react';

const Sidebar = () => {
  // Declare a state variable `showUsage` with the initial value `true`
  const [showUsage, setShowUsage] = useState(true);

  // useEffect hook to set a timer that changes `showUsage` to `false` after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUsage(false);
    }, 5000);

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [showUsage]);

  // Determine the display style based on the `showUsage` state
  const displayUsage = showUsage ? '' : 'none';

  // Function to handle the drag start event
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType); // Set the data for the drag event
    event.dataTransfer.effectAllowed = 'move'; // Set the allowed drag effect
  };

  return (
    <>
      {/* Display the usage description based on the `displayUsage` style */}
      <div className="description" style={{ display: displayUsage }}>
        Drag below node to the pane on the left to add new nodes.
      </div>
      <aside>
        {/* Draggable node element */}
        <div
          className="appnode"
          onDragStart={(event) => onDragStart(event, 'default')}
          draggable
        >
          <span
            className="material-symbols-outlined"
            style={{ paddingBottom: 5 }}
          >
            maps_ugc
          </span>
          Message
        </div>
      </aside>
    </>
  );
};

export default Sidebar; // Export the Sidebar component as the default export
