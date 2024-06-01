import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState as useCustomNodesState,
  useEdgesState as useCustomEdgesState,
  Controls,
} from 'reactflow';
import { useState, useRef, useCallback, useMemo } from 'react';

import 'reactflow/dist/style.css';
import Sidebar from './components/Sidebar';
import UpdateNode from './components/UpdateNode';
import AlertMessage from './components/AlertMessage';
import AddNodeButton from './components/AddNodeButton';
import './index.css';
import TopNav from './components/TopNav';

let id = 0; // Unique ID for new nodes

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [customNodes, setCustomNodes, onCustomNodesChange] = useCustomNodesState([]);
  const [customEdges, setCustomEdges, onCustomEdgesChange] = useCustomEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeSelected, setNodeSelected] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [messageColor, setMessageColor] = useState(null);
  const [targetHandles, setTargetHandles] = useState([]);

  // Update node selection
  const updateNode = useCallback((event, node) => {
    setSelectedNode(node);
    setNodeSelected(true);
  }, []);

  let sourceHandles = [];
  let targetHandle = [];

  // Handle connecting nodes
  const onConnect = useCallback(
    (params) => {
      if (sourceHandles.includes(params.source)) return;
      sourceHandles = sourceHandles.concat(params.source);
      setCustomEdges((eds) =>
        addEdge({ ...params, markerEnd: { type: 'arrowclosed' } }, eds)
      );
      if (targetHandle.includes(params.target)) return;
      targetHandle = targetHandle.concat(params.target);
      setTargetHandles(targetHandle);
    },
    [setCustomEdges]
  );

  // Handle drag over event
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop event to add a new node
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: `node_${id}`,
        type: 'node',
        position,
        data: { heading: 'Send Message', label: `text message ${id}` },
      };
      id++;
      setCustomNodes((nodes) => nodes.concat(newNode));
    },
    [reactFlowInstance, setCustomNodes]
  );

  // Options for pro features
  let proOptions = { hideAttribution: true };
  
  // Define node types
  const nodeTypes = useMemo(
    () => ({
      node: AddNodeButton,
    }),
    []
  );

  // Save the flow and check for errors
  const saveFlow = () => {
    const totalNodes = reactFlowInstance.getNodes().length;
    if (targetHandles.length !== totalNodes - 1) {
      setErrorMessage('Cannot save Flow');
      setMessageColor('redMessage');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } else {
      setErrorMessage('Saved Flow');
      setMessageColor('greenMessage');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div className="appflow" style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <div className="topbar">
            <AlertMessage
              errorMessage={errorMessage}
              messageColor={messageColor}
            />
          </div>
          <ReactFlow
            nodes={customNodes}
            edges={customEdges}
            onNodesChange={onCustomNodesChange}
            onEdgesChange={onCustomEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            proOptions={proOptions}
            onNodeClick={updateNode}
            nodeTypes={nodeTypes}
          >
            <Controls />
          </ReactFlow>
        </div>
        {nodeSelected ? (
          <div className="rightbar">
            <TopNav saveFlow={saveFlow} />
            <UpdateNode
              selectedNode={selectedNode}
              setNodeSelected={setNodeSelected}
              setNodes={setCustomNodes}
            />
          </div>
        ) : (
          <div className="rightbar">
            <TopNav saveFlow={saveFlow} />
            <Sidebar />
          </div>
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default App; // Export the App component as the default export
