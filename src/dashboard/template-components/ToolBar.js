import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, TextField, MenuItem, Input } from "@mui/material";
import StyleEditor from "./StyleEditor";
import {
  TextBox,
  ImageBox,
  Rectangle,
  Circle,
  Diamond,
  Line,
} from "../../utils/draggableComponents";

const Toolbar = ({
  activeStyles,
  handleStyleChange,
  templateData,
  setTemplateData,
  selectedItem,
  onDropdownChange,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  useEffect(() => {
    if (activeStyles) {
      setTabIndex(1);
    } else if (!activeStyles && tabIndex === 1) {
      setTabIndex(0);
    }
  }, [activeStyles]);

  const handleTabChange = (event, newValue) => {
    if (newValue === 1 && !activeStyles) return;
    setTabIndex(newValue);
  };

  const handleInputChange = (field, value) => {
    setTemplateData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setTemplateData((prevData) => ({
      ...prevData,
      thumbnailUrl: file,
    }));
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
        height: "calc(100vh - 53px)",
        borderLeft: "1px solid #ddd",
        marginTop: "53px",
        zIndex: 1,
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="General" />
        {activeStyles && <Tab label="Style" />}
        <Tab label="Shape" />
      </Tabs>

      <Box sx={{ flexGrow: 1, width: "100%", mt: 2 }}>
        {tabIndex === 2 && (
          <Box>
            <TextBox />
            <ImageBox />
            <Rectangle />
            <Circle />
            <Diamond />
            <Line />
          </Box>
        )}

        {activeStyles && tabIndex === 1 && (
          <Box>
            <StyleEditor
              activeStyles={activeStyles}
              handleStyleChange={handleStyleChange}
              selectedItem={selectedItem}
              onChange={onDropdownChange}
            />
          </Box>
        )}

        {tabIndex === 0 && (
          <Box>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={templateData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={templateData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Access Type"
              value={templateData.accessType}
              onChange={(e) => handleInputChange("accessType", e.target.value)}
              margin="normal"
            >
              <MenuItem value="FREE">FREE</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
            </TextField>

            {/* Trường upload ảnh thumbnail */}
            <Box sx={{ marginTop: "16px" }}>
              <Input
                type="file"
                onChange={handleFileChange}
                fullWidth
                inputProps={{ accept: "image/*" }}
              />
              {templateData.thumbnailUrl && (
                <Box sx={{ marginTop: "8px" }}>
                  <img
                    src={URL.createObjectURL(templateData.thumbnailUrl)}
                    alt="Thumbnail"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Toolbar;
