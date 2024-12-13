import React, { useState } from "react";
import Draggable from "react-draggable";
import { Box, Menu, MenuItem, Button } from "@mui/material";
import { uploadImages } from "../../service/templateService.js";

const ComponentItem = ({
  component,
  handleDelete,
  setActiveItem,
  setActiveStyles,
  active,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [imageSrc, setImageSrc] = useState(component.src || ""); // Đường dẫn ảnh
  const [editingText, setEditingText] = useState(false);
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

  const handleTextEditToggle = () => {
    setEditingText(!editingText);
  };

  const handleTextChange = (e) => {
    setNewText(e.target.value);
  };

  const handleSaveTextEdit = () => {
    component.text = newText; // Cập nhật lại văn bản trong component
    setEditingText(false);
  };

  const handleDragStop = (e, data) => {
    component.style = {
      ...component.style,
      left: data.x,
      top: data.y,
    };
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadedImage = await uploadImages(file);
        setImageSrc(uploadedImage.data.url);
        component.src = uploadedImage.data.url;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <Draggable
      bounds="parent"
      defaultPosition={{
        x: component.style.left,
        y: component.style.top,
      }}
      onStop={handleDragStop}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: component.style.width,
          height: component.type === "line" ? "3px" : component.style.height,
          fontSize: component.style.fontSize,
          fontFamily: component.style.fontFamily,
          color: component.style.color,
          border: isHovered || active ? "1px solid #f50057" : "1px solid #ddd",
          backgroundColor:
            component.type === "line"
              ? component.style.fillColor
              : component.style.fillColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "move",
          padding: 1,
          transition: component.type === "diamond" ? "" : "border 0.3s ease",
          borderRadius:
            component.type === "circle" ? "50%" : component.style.borderRadius,
          borderWidth: component.style.borderWidth,
          borderColor: component.style.borderColor,
          borderStyle: component.style.borderStyle,
          transform:
            component.type === "diamond"
              ? "rotate(45deg)"
              : component.style.transform,
          opacity: component.style.opacity / 100,
        }}
        onDoubleClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onContextMenu={(e) => {
          e.preventDefault();
          handleOpenMenu(e);
        }}
      >
        {component.type === "text" && (
          <Box
            contentEditable={editingText}
            suppressContentEditableWarning
            onBlur={handleSaveTextEdit}
            onInput={handleTextChange}
            sx={{
              width: "100%",
              height: "100%",
              textAlign: "center",
              border: editingText ? "1px dashed #f50057" : "none",
              backgroundColor: editingText ? "#fff" : "transparent",
              padding: "8px",
              fontSize: component.style.fontSize,
              fontFamily: component.style.fontFamily,
              color: component.style.color,
              cursor: editingText ? "text" : "pointer",
              lineHeight: "1.4",
            }}
          >
            {newText || "Click to edit text"}
          </Box>
        )}

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
          <MenuItem onClick={handleTextEditToggle}>
            {editingText ? "Save Text" : "Edit Text"}
          </MenuItem>
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
      </Box>
    </Draggable>
  );
};

export default ComponentItem;
