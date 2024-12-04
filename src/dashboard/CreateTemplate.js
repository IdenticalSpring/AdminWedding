import React, { useState, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "./template-components/Canvas";
import Toolbar from "./template-components/ToolBar";

const CreateTemplate = () => {
  const [sections, setSections] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [activeStyles, setActiveStyles] = useState({});
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });

  const handleStyleChange = (key, value) => {
    if (!activeItem) return;

    setActiveStyles((prevStyles) => ({
      ...prevStyles,
      [key]: value,
    }));

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === activeItem.sectionId
          ? {
              ...section,
              components: section.components.map((component) =>
                component.id === activeItem.componentId
                  ? {
                      ...component,
                      style: { ...component.style, [key]: value },
                    }
                  : component
              ),
            }
          : section
      )
    );
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    setScale((prevScale) => Math.min(Math.max(prevScale + delta, 0.5), 3));
  };

  const handleMouseDown = (event) => {
    if (!event.shiftKey) return;
    isPanning.current = true;
    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event) => {
    if (!isPanning.current) return;

    const dx = event.clientX - startPoint.current.x;
    const dy = event.clientY - startPoint.current.y;

    setTranslate((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  const addSection = () => {
    const newSection = { id: Date.now().toString(), components: [] };
    setSections([...sections, newSection]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          flexDirection: "row-reverse",
        }}
      >
        {/* Toolbar */}
        <Toolbar
          activeStyles={activeStyles}
          handleStyleChange={handleStyleChange}
        />

        {/* Canvas area */}
        <Box
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          sx={{
            flex: 1,
            backgroundColor: "#f9f9f9",
            cursor: isPanning.current ? "grabbing" : "grab",
          }}
        >
          <Box
            sx={{
              transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
              transformOrigin: "center",
              transition: isPanning.current
                ? "none"
                : "transform 0.2s ease-out",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "800px",
                height: "600px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                position: "relative",
              }}
            >
              <Typography variant="h4" align="center" sx={{ pt: 2 }}>
                Create Template
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={addSection}
                sx={{ position: "absolute", top: "10px", right: "10px" }}
              >
                Add Section
              </Button>
              <Canvas
                sections={sections}
                setSections={setSections}
                setActiveItem={setActiveItem}
                setActiveStyles={setActiveStyles}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default CreateTemplate;
