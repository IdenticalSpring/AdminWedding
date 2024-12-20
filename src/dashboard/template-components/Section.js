import React, { useState } from "react";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";
import ComponentItem from "./ComponentItem";

const Section = ({
  section,
  index,
  setSections,
  setActiveItem,
  activeItem,
  sections,
  setActiveStyles,
  selectedItem,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [guides, setGuides] = useState({ vertical: null, horizontal: null });

  const [, dropRef] = useDrop(() => ({
    accept: "component",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const dropPosition = {
        left: offset.x - monitor.getSourceClientOffset().x,
        top: offset.y - monitor.getSourceClientOffset().y,
      };

      const newComponent = {
        id: Date.now(),
        type: item.type,
        style: {
          ...dropPosition,
          width: item.type === "diamond" ? 50 : 100,
          height: item.type === "line" ? 5 : 50,
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
    const currentSection = sections.find((sec) => sec.id === section.id);
    if (currentSection) {
      const component = currentSection.components.find(
        (comp) => comp.id === compId
      );
      if (component) {
        const { left, top, width, height } = component.style;
        setGuides({
          vertical: left + width / 2,
          horizontal: top + height / 2,
        });
      }
    }
  };

  const handleDeleteComponent = (compId) => {
    setSections((prevSections) => {
      const newSections = [...prevSections];
      newSections[index].components = newSections[index].components.filter(
        (comp) => comp.id !== compId
      );
      return newSections;
    });
    setGuides({ vertical: null, horizontal: null }); // Đặt lại guides khi xóa component
  };

  const handleDoubleClick = () => {
    if (setActiveStyles) {
      setActiveItem({ sectionId: section.id, componentId: null });
      setActiveStyles({ backgroundColor: section.backgroundColor || "#fff" });
    } else {
      console.error("setActiveStyles is not available");
      setActiveItem(null);
      setGuides({ vertical: null, horizontal: null }); // Đặt lại guides khi không chọn component
    }
  };

  return (
    <Box
      onDoubleClick={handleDoubleClick}
      ref={dropRef}
      sx={{
        position: section.style.position,
        border: isHovered ? "2px solid #2196f3" : "1px dashed #ccc",
        padding: section.style.padding,
        marginBottom: section.style.marginBottom,
        minWidth: section.style.minWidth,
        minHeight: section.style.minHeight,
        backgroundColor: section.style.backgroundColor,
        transition: section.style.transition,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {guides.vertical !== null && (
        <Box
          sx={{
            position: "absolute",
            left: guides.vertical,
            top: 0,
            bottom: 0,
            width: "1px",
            backgroundColor: "black",
            transition: "left 0.2s ease", // Thêm transition cho guides
          }}
        />
      )}
      {guides.horizontal !== null && (
        <Box
          sx={{
            position: "absolute",
            top: guides.horizontal,
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: "black",
            transition: "top 0.2s ease", // Thêm transition cho guides
          }}
        />
      )}
      {section.components.map((component) => (
        <ComponentItem
          key={component.id}
          selected={selectedItem?.componentId === component.id}
          component={component}
          onDrag={(newPosition) =>
            handleDragComponent(component.id, newPosition)
          }
          active={activeItem?.componentId === component.id}
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
