import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Slider,
  InputAdornment,
  MenuItem,
} from "@mui/material";

const StyleInput = ({
  label,
  value,
  onChange,
  type,
  unit,
  min,
  max,
  options,
}) => (
  <Box>
    {type === "select" ? (
      <TextField
        select
        label={label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        fullWidth
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    ) : (
      <TextField
        label={label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        fullWidth
        type={type}
        InputProps={{
          endAdornment: unit ? (
            <InputAdornment position="end">{unit}</InputAdornment>
          ) : null,
        }}
      />
    )}
    {type === "number" && (
      <Slider
        value={value || min}
        onChange={(e, value) => onChange(value)}
        min={min}
        max={max}
        valueLabelDisplay="auto"
        sx={{ mt: 1 }}
      />
    )}
  </Box>
);

const StyleEditor = ({ activeStyles, handleStyleChange }) => {
  if (!activeStyles || Object.keys(activeStyles).length === 0) return null;

  return (
    <Box
      sx={{
        padding: 1,
        borderTop: "1px solid #ddd",
        backgroundColor: "#fcfcfc",
        mt: 2,
        width: "100%",
        maxHeight: 400, // Giới hạn chiều cao
        overflow: "auto", // Kích hoạt scroll
        border: "1px solid #ccc", // Thêm viền để phân biệt
        borderRadius: 1, // Bo góc
      }}
    >
      <Typography variant="h6" gutterBottom>
        Edit Styles
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Width */}
        <StyleInput
          label="Width"
          value={activeStyles.width}
          onChange={(value) => handleStyleChange("width", value)}
          type="number"
          unit="px"
          min={0}
          max={1000}
        />
        {/* Height */}
        <StyleInput
          label="Height"
          value={activeStyles.height}
          onChange={(value) => handleStyleChange("height", value)}
          type="number"
          unit="px"
          min={0}
          max={1000}
        />
        {/* Font Size */}
        <StyleInput
          label="Font Size"
          value={activeStyles.fontSize}
          onChange={(value) => handleStyleChange("fontSize", value)}
          type="number"
          unit="px"
          min={8}
          max={100}
        />
        {/* Background Color */}
        <StyleInput
          label="Background Color"
          value={activeStyles.backgroundColor}
          onChange={(value) => handleStyleChange("backgroundColor", value)}
          type="color"
        />
        {/* Text Color */}
        <StyleInput
          label="Color"
          value={activeStyles.color}
          onChange={(value) => handleStyleChange("color", value)}
          type="color"
        />
        {/* Opacity */}
        <StyleInput
          label="Opacity"
          value={activeStyles.opacity}
          onChange={(value) => handleStyleChange("opacity", value)}
          min={0}
          max={1}
          step={0.1}
        />
        {/* Border Settings */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Border Settings
        </Typography>
        <StyleInput
          label="Border Width"
          value={activeStyles.borderWidth}
          onChange={(value) => handleStyleChange("borderWidth", value)}
          type="number"
          unit="px"
          min={0}
          max={20}
        />
        <StyleInput
          label="Border Style"
          value={activeStyles.borderStyle}
          onChange={(value) => handleStyleChange("borderStyle", value)}
          type="select"
          options={[
            "none",
            "solid",
            "dashed",
            "dotted",
            "double",
            "groove",
            "ridge",
            "inset",
            "outset",
          ]}
        />
        <StyleInput
          label="Border Color"
          value={activeStyles.borderColor}
          onChange={(value) => handleStyleChange("borderColor", value)}
          type="color"
        />
        <StyleInput
          label="Border Radius"
          value={activeStyles.borderRadius}
          onChange={(value) => handleStyleChange("borderRadius", value)}
          type="number"
          unit="px"
          min={0}
          max={100}
        />
      </Box>
    </Box>
  );
};

export default StyleEditor;
