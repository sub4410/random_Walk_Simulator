import { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

export function RandomWalk({ steps = 300, start }) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [currentStep, setCurrentStep] = useState(0);
  const [pulseNodes, setPulseNodes] = useState({});
  const [positions, setPositions] = useState({});
  const [fullPath, setFullPath] = useState({ nodes: [], links: [] });

  const fgRef = useRef();
  const [zoomLevel, setZoomLevel] = useState(1); // Start at normal zoom
  const zoomOutRate = 1; // How much zooms out per step
  const [completed, setCompleted] = useState(false);

  // Initialize the random walk
  useEffect(() => {
    if (start) {
      const nodes = [{ id: 0, x: 0, y: 0 }];
      const links = [];

      for (let i = 1; i <= steps; i++) {
        const last = nodes[nodes.length - 1];
        const dir = Math.floor(Math.random() * 4);
        let next = { ...last };

        if (dir === 0) next.y += 10;
        else if (dir === 1) next.x += 10;
        else if (dir === 2) next.y -= 10;
        else next.x -= 10;

        nodes.push({ id: i, x: next.x, y: next.y });
        links.push({ source: i - 1, target: i });
      }

      setFullPath({ nodes, links });
      setCurrentStep(1);
      setGraphData({ nodes: [nodes[0]], links: [] });
      setPulseNodes({ 0: Date.now() });
      setPositions({ 0: { offsetX: 0, offsetY: 0 } });

      setZoomLevel(1);
      setCompleted(false);

      if (fgRef.current) fgRef.current.zoomToFit(400);
    } else {
      setGraphData({ nodes: [], links: [] });
      setCurrentStep(0);
      setPulseNodes({});
      setPositions({});
      setZoomLevel(1);
      setCompleted(false);
    }
  }, [start, steps]);

  // Add nodes step-by-step
  useEffect(() => {
    if (start && fullPath.nodes.length > 0 && currentStep < fullPath.nodes.length) {
      const interval = setInterval(() => {
        const newNode = fullPath.nodes[currentStep];
        const newLink = fullPath.links[currentStep - 1];

        setGraphData(prev => ({
          nodes: [...prev.nodes, newNode],
          links: [...prev.links, newLink].filter(Boolean)
        }));

        setPulseNodes(prev => ({ ...prev, [newNode.id]: Date.now() }));
        setPositions(prev => ({ ...prev, [newNode.id]: { offsetX: 0, offsetY: 0 } }));

        setCurrentStep(current => current + 1);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [start, fullPath, currentStep]);

  // Smooth zoom out as new nodes are added
  useEffect(() => {
    if (start && !completed && fgRef.current) {
      fgRef.current.zoom(zoomLevel, 300); // 300ms animation
      setZoomLevel(prev => prev * zoomOutRate);

      if (currentStep >= fullPath.nodes.length) {
        setCompleted(true);
      }
    }
  }, [currentStep, completed, start, zoomLevel, fullPath.nodes.length]);

  // Wiggle effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => {
        const newPositions = { ...prev };
        for (const id in newPositions) {
          newPositions[id] = {
            offsetX: (Math.random() - 0.5) * 2,
            offsetY: (Math.random() - 0.5) * 2,
          };
        }
        return newPositions;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 bg-black overflow-hidden">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="black"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const pulseDuration = 500;
          const now = Date.now();
          const startPulse = pulseNodes[node.id];
          let pulseScale = 1;

          if (startPulse && now - startPulse < pulseDuration) {
            const progress = (now - startPulse) / pulseDuration;
            pulseScale = 1 + 0.5 * Math.sin(progress * Math.PI);
          }

          const baseSize = 8;
          let color = 'white';

          if (node.id === 0) {
            color = "#00ff00"; // start node green
          } else if (node.id === fullPath.nodes.length - 1) {
            color = "#ff0000"; // end node red
          } else {
            const hue = (node.id / fullPath.nodes.length) * 360;
            color = `hsl(${hue}, 100%, 50%)`;
          }

          ctx.shadowColor = color;
          ctx.shadowBlur = 30;

          const offset = positions[node.id] || { offsetX: 0, offsetY: 0 };

          ctx.beginPath();
          ctx.arc(
            node.x + offset.offsetX,
            node.y + offset.offsetY,
            baseSize * pulseScale,
            0,
            2 * Math.PI,
            false
          );
          ctx.fillStyle = color;
          ctx.fill();

          // Trail glow
          ctx.shadowBlur = 50;
          ctx.beginPath();
          ctx.arc(
            node.x + offset.offsetX,
            node.y + offset.offsetY,
            (baseSize * pulseScale) * 0.7,
            0,
            2 * Math.PI,
            false
          );
          ctx.fillStyle = `${color}55`; // semi-transparent
          ctx.fill();

          ctx.shadowBlur = 0;
        }}
        linkColor={() => "#cccccc"}
        linkWidth={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={() => 0.002}
        linkDirectionalParticleWidth={2}
        nodeRelSize={4}
      />
    </div>
  );
}
