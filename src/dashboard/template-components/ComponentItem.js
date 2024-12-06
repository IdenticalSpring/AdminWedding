import React, { useState } from "react";
import { Box, Menu, MenuItem } from "@mui/material";
import { handleStyle } from "../../utils/handStyles.js";

const ComponentItem = ({
  component,
  handleDelete,
  setActiveItem,
  setActiveStyles,
  active,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState(component.src || ""); // Trường src để chứa đường dẫn ảnh

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setActiveItem();
    setActiveStyles();
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
    document.body.style.userSelect = "none";
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
    document.body.style.userSelect = "auto";
  };

  // Hàm thay đổi ảnh cho component image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); // Cập nhật đường dẫn ảnh
        component.src = reader.result; // Lưu vào component
      };
      reader.readAsDataURL(file);
    }
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
        border: isHovered || active ? "1px solid #f50057" : "1px solid #ddd",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "move",
        padding: 1,
        transition: "border 0.3s ease",
        borderRadius: component.type === "circle" ? "50%" : "0%",
        src: component.type === "image" ? imageSrc : "",
      }}
      onDoubleClick={handleClick}
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
      {component.type === "image" && (
        <img
          src={imageSrc}
          alt="Component"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {component.type === "button" && <button>Button</button>}

      {isHovered ||
        (active && (
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
        ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleDelete(component.id)}>Delete</MenuItem>
        {component.type === "image" && (
          <MenuItem>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageUpload}
              id={`upload-image-${component.id}`}
            />
            <label htmlFor={`upload-image-${component.id}`}>Chèn ảnh</label>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ComponentItem;
