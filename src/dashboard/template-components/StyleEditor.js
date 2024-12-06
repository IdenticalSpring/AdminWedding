import React from "react";
import {
  Box,
  TextField,
  Typography,
  Slider,
  InputAdornment,
} from "@mui/material";

const StyleInput = ({ label, value, onChange, type, unit, min, max }) => (
  <Box>
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
      }}
    >
      <Typography variant="h6" gutterBottom>
        Edit Styles
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <StyleInput
          label="Width"
          value={activeStyles.width}
          onChange={(value) => handleStyleChange("width", value)}
          type="number"
          unit="px"
          min={0}
          max={1000}
        />
        <StyleInput
          label="Height"
          value={activeStyles.height}
          onChange={(value) => handleStyleChange("height", value)}
          type="number"
          unit="px"
          min={0}
          max={1000}
        />
        <StyleInput
          label="Font Size"
          value={activeStyles.fontSize}
          onChange={(value) => handleStyleChange("fontSize", value)}
          type="number"
          unit="px"
          min={8}
          max={100}
        />
        <StyleInput
          label="Background Color"
          value={activeStyles.backgroundColor}
          onChange={(value) => handleStyleChange("backgroundColor", value)}
          type="color"
        />
        <StyleInput
          label="Color"
          value={activeStyles.color}
          onChange={(value) => handleStyleChange("color", value)}
          type="color"
        />
      </Box>
    </Box>
  );
};

export default StyleEditor;
