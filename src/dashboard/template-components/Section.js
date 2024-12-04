import React, { useState } from "react";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";
import ComponentItem from "./ComponentItem";

const Section = ({
  section,
  index,
  setSections,
  setActiveItem,
  setActiveStyles,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const [, dropRef] = useDrop(() => ({
    accept: "component",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const dropPosition = {
        left: offset.x - monitor.getSourceClientOffset().x,
        top: offset.y - monitor.getSourceClientOffset().y,
      };

      const newComponent = {
        id: Date.now().toString(),
        type: item.type,
        style: {
          ...dropPosition,
          width: 100,
          height: 50,
          fontSize: 16,
          color: "#000",
        },
      };

      setSections((prevSections) => {
        const newSections = [...prevSections];
        newSections[index].components.push(newComponent);
        return newSections;
      });
    },
  }));

  const handleDragComponent = (compId, newPosition) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      const componentIndex = newSections[index].components.findIndex(
        (comp) => comp.id === compId
      );
      if (componentIndex !== -1) {
        newSections[index].components[componentIndex].style = {
          ...newSections[index].components[componentIndex].style,
          ...newPosition,
        };
      }
      return newSections;
    });
  };

  const handleDeleteComponent = (compId) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      newSections[index].components = newSections[index].components.filter(
        (comp) => comp.id !== compId
      );
      return newSections;
    });
  };

  const handleDoubleClick = () => {
    setActiveItem({ sectionId: section.id, componentId: null });
    setActiveStyles({ backgroundColor: section.backgroundColor || "#fff" });
  };

  return (
    <Box
      onDoubleClick={handleDoubleClick}
      ref={dropRef}
      sx={{
        position: "relative",
        border: isHovered ? "2px solid #2196f3" : "1px dashed #ccc",
        padding: 2,
        marginBottom: 2,
        minHeight: "150px",
        backgroundColor: "#f9f9f9",
        transition: "border 0.3s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {section.components.map((component) => (
        <ComponentItem
          key={component.id}
          component={component}
          onDrag={(newPosition) =>
            handleDragComponent(component.id, newPosition)
          }
          setActiveItem={() =>
            setActiveItem({ sectionId: section.id, componentId: component.id })
          }
          setActiveStyles={() => setActiveStyles(component.style)}
          handleDelete={() => handleDeleteComponent(component.id)}
        />
      ))}
    </Box>
  );
};

export default Section;
