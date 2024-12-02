import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "./template-components/Canvas";
import Toolbar from "./template-components/ToolBar";

const CreateTemplate = () => {
  const [sections, setSections] = useState([]);
  const [activeItem, setActiveItem] = useState(null); // Tracks active section or component
  const [activeStyles, setActiveStyles] = useState({}); // Tracks styles for active item

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
                      style: { ...component.style, [key]: value }, // Update style here
                    }
                  : component
              ),
            }
          : section
      )
    );
  };

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      components: [],
    };
    setSections([...sections, newSection]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ flex: 1, padding: 2 }}>
          <Typography variant="h4" gutterBottom>
            Create Template
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={addSection}
            sx={{ mb: 2 }}
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

        <Toolbar activeStyles={activeStyles} handleStyleChange={handleStyleChange} />
      </Box>
    </DndProvider>
  );
};

export default CreateTemplate;
