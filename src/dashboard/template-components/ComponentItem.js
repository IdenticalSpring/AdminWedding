import React, { useState } from "react";
import {
  Box,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { handleStyle } from "../../utils/handStyles.js";
import { uploadImages } from "../../service/templateService.js";

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
  const [openTextEdit, setOpenTextEdit] = useState(false);
  const [newText, setNewText] = useState(component.text || "");

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

  const handleTextEditOpen = () => {
    setOpenTextEdit(true);
    handleCloseMenu();
  };

  const handleTextEditClose = () => {
    setOpenTextEdit(false);
  };

  const handleSaveTextEdit = () => {
    component.text = newText; // Cập nhật lại văn bản trong component
    setOpenTextEdit(false);
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
  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImageSrc(reader.result); // Cập nhật đường dẫn ảnh
  //       component.src = reader.result; // Lưu vào component
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Gọi API upload ảnh lên server
        const uploadedImage = await uploadImages(file); // Gọi API upload ảnh
        // Cập nhật src sau khi ảnh được tải lên thành công
        setImageSrc(uploadedImage.data.url); // Giả sử API trả về đường dẫn ảnh trong `url`
        component.src = uploadedImage.data.url; // Lưu vào component
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  return (
    <Box
      sx={{
        position: "absolute",
        text: component.text,
        top: component.style.top,
        left: component.style.left,
        width: component.style.width,
        height: component.type === "line" ? "5" : component.style.height,
        fontSize: component.style.fontSize,
        fontFamily: component.style.fontFamily,
        color: component.style.fillColor,
        border: isHovered || active ? "1px solid #f50057" : "1px solid #ddd",
        backgroundColor:
          component.type === "line" ? "#000" : component.style.fillColor,
        display: "flex",
        lineColor: component.style.lineColor,
        color: component.style.color,
        LineWidth: component.style.LineWidth,
        opacity: component.style.opacity / 100,
        borderWidth: component.style.borderWidth,
        borderStyle: component.style.borderStyle,
        borderColor: component.style.borderColor,
        alignItems: "center",
        justifyContent: "center",
        cursor: "move",
        padding: 1,
        transition: component.type === "diamond" ? "" : "border 0.3s ease",
        borderRadius:
          component.type === "circle" ? "50%" : component.style.borderRadius,
        src: imageSrc,
        transform:
          component.type === "diamond"
            ? "rotate(45deg)"
            : component.style.transform,
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
      {component.type === "text" && <span>{component.text || "Text"}</span>}
      {(component.type === "image" || component.type === "circle") && (
        <img
          src={imageSrc}
          style={{
            width: component.style.width,
            height: component.style.height,
            objectFit: "cover",
            borderRadius:
              component.type === "circle"
                ? "50%"
                : component.style.borderRadius,
          }}
        />
      )}
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
              sx={handleStyle("left", "center")}
              onMouseDown={(e) => handleResize(e, "left")}
            />
            <Box
              sx={handleStyle("right", "center")}
              onMouseDown={(e) => handleResize(e, "right")}
            />
          </>
        ))}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            maxHeight: 200,
            width: "15ch",
          },
        }}
      >
        <MenuItem onClick={handleTextEditOpen}>Edit Text</MenuItem>
        {/* {component.type === "image" && (
          
        )} */}
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
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <Dialog open={openTextEdit} onClose={handleTextEditClose}>
        <DialogTitle>Edit Text</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            variant="outlined"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTextEditClose}>Cancel</Button>
          <Button onClick={handleSaveTextEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComponentItem;
