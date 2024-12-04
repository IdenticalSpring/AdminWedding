import React, { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "./template-components/Canvas";
import Toolbar from "./template-components/ToolBar";
import Headerv2 from "./template-components/Headerv2";
import StyleEditor from "./template-components/StyleEditor";

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

  const handleCanvasClick = (event) => {
    if (event.target.id === "canvas" || event.target.closest(".component") === null) {
      setActiveItem(null);
      setActiveStyles({});
    }
  };

  const handleComponentClick = (component) => {
    setActiveItem(component);
    setActiveStyles(component.style || {});
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#FCFCFC",
        }}
        onClick={handleCanvasClick} 
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            width: "87%",
            zIndex: 1000,
            backgroundColor: "#FCFCFC",
          }}
        >
          <Headerv2 />
        </Box>

        <Box
          sx={{
            display: "flex",
            height: "100%",
            overflow: "hidden",
            flexDirection: "row-reverse",
          }}
        >
          <Toolbar
            activeStyles={activeStyles}
            handleStyleChange={handleStyleChange}
          />
          <Box
            id="canvas"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
              flex: 1,
              backgroundColor: "#FCFCFC",
              cursor: isPanning.current ? "grabbing" : "grab",
              position: "relative",
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
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: "800px",
                  height: "600px",
                  position: "relative",
                }}
              >
                <Canvas
                  sections={sections}
                  setSections={setSections}
                  setActiveItem={handleComponentClick}
                  activeItem={activeItem}
                  setActiveStyles={setActiveStyles} 
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={addSection}
            sx={{
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "16px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Add Section
          </Button>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default CreateTemplate;
