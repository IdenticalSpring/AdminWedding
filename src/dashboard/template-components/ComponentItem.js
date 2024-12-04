import React, { useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import { handleStyle } from "../../utils/handStyles.js";

const ComponentItem = ({ component, handleDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const resizeComponent = (
    dx,
    dy,
    direction,
    startWidth,
    startHeight,
    startLeft,
    startTop
  ) => {
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    switch (direction) {
      case "top-left":
        newWidth = Math.max(50, startWidth - dx);
        newHeight = Math.max(50, startHeight - dy);
        newLeft = startLeft + dx;
        newTop = startTop + dy;
        break;
      case "top-right":
        newWidth = Math.max(50, startWidth + dx);
        newHeight = Math.max(50, startHeight - dy);
        newTop = startTop + dy;
        break;
      case "bottom-left":
        newWidth = Math.max(50, startWidth - dx);
        newHeight = Math.max(50, startHeight + dy);
        newLeft = startLeft + dx;
        break;
      case "bottom-right":
        newWidth = Math.max(50, startWidth + dx);
        newHeight = Math.max(50, startHeight + dy);
        break;
      case "top":
        newHeight = Math.max(50, startHeight - dy);
        newTop = startTop + dy;
        break;
      case "bottom":
        newHeight = Math.max(50, startHeight + dy);
        break;
      case "left":
        newWidth = Math.max(50, startWidth - dx);
        newLeft = startLeft + dx;
        break;
      case "right":
        newWidth = Math.max(50, startWidth + dx);
        break;
      default:
        break;
    }

    // Update the component's position and size
    component.style = {
      ...component.style,
      width: newWidth,
      height: newHeight,
      left: newLeft,
      top: newTop,
    };
  };

  const handleResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = component.style.width;
    const startHeight = component.style.height;
    const startLeft = component.style.left;
    const startTop = component.style.top;

    const onMouseMove = (event) => {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      resizeComponent(
        dx,
        dy,
        direction,
        startWidth,
        startHeight,
        startLeft,
        startTop
      );
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleDragStart = (e) => {
    setDragging(true);
    setDragStart({
      x: e.clientX - component.style.left,
      y: e.clientY - component.style.top,
    });
  };

  const handleDrag = (e) => {
    if (!dragging) return;

    const newLeft = e.clientX - dragStart.x;
    const newTop = e.clientY - dragStart.y;

    component.style = {
      ...component.style,
      left: Math.max(newLeft, 0),
      top: Math.max(newTop, 0),
    };
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: component.style.top,
        left: component.style.left,
        width: component.style.width,
        height: component.style.height,
        fontSize: component.style.fontSize,
        color: component.style.color,
        border: isHovered ? "1px solid #f50057" : "1px solid #ddd",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "move",
        padding: 1,
        transition: "border 0.3s ease",
        borderRadius: component.type === "circle" ? "50%" : "0%",
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleOpenMenu(e);
      }}
    >
      {component.type === "text" && <span>Text</span>}
      {component.type === "image" && <span>Image</span>}
      {component.type === "button" && <button>Button</button>}

      {isHovered && (
        <>
          <Box
            sx={handleStyle("top", "left")}
            onMouseDown={(e) => handleResize(e, "top-left")}
          />
          <Box
            sx={handleStyle("top", "right")}
            onMouseDown={(e) => handleResize(e, "top-right")}
          />
          <Box
            sx={handleStyle("bottom", "left")}
            onMouseDown={(e) => handleResize(e, "bottom-left")}
          />
          <Box
            sx={handleStyle("bottom", "right")}
            onMouseDown={(e) => handleResize(e, "bottom-right")}
          />

          <Box
            sx={handleStyle("top", "center")}
            onMouseDown={(e) => handleResize(e, "top")}
          />
          <Box
            sx={handleStyle("bottom", "center")}
            onMouseDown={(e) => handleResize(e, "bottom")}
          />
          <Box
            sx={handleStyle("center", "left")}
            onMouseDown={(e) => handleResize(e, "left")}
          />
          <Box
            sx={handleStyle("center", "right")}
            onMouseDown={(e) => handleResize(e, "right")}
          />
        </>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleDelete(component.id)}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default ComponentItem;
