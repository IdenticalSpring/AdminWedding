import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDrag } from "react-dnd";
import StyleEditor from "./StyleEditor";

const Toolbar = ({ activeStyles, handleStyleChange }) => {
  const components = [
    { type: "text", label: "Text Box" },
    { type: "image", label: "Image Box" },
    { type: "button", label: "Button" },
    { type: "rect", label: "Rectangle" },
    { type: "circle", label: "Circle" },
  ];

  const DraggableItem = ({ type, label }) => {
    const [, dragRef] = useDrag(() => ({
      type: "component",
      item: { type },
    }));

    return (
      <Button ref={dragRef} variant="outlined" fullWidth sx={{ mb: 2 }}>
        {label}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        width: "250px",
        padding: 1,
        borderRight: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        borderLeft: "1px solid #ddd",
      }}
    >
      {/* Components list with flexGrow to push StyleEditor to the bottom */}
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        {components.map((component) => (
          <DraggableItem key={component.type} {...component} />
        ))}
      </Box>

      {/* StyleEditor stays at the bottom */}
      <StyleEditor
        activeStyles={activeStyles}
        handleStyleChange={handleStyleChange}
      />
    </Box>
  );
};

export default Toolbar;
