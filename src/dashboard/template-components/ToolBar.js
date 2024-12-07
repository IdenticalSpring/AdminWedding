import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import StyleEditor from "./StyleEditor";
import {
  TextBox,
  ImageBox,
  Rectangle,
  Circle,
  Diamond,
  Line,
} from "../../utils/draggableComponents";

const Toolbar = ({ activeStyles, handleStyleChange }) => {
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
            />
          </Box>
        )}

        {((!activeStyles && tabIndex === 0) ||
          (activeStyles && tabIndex === 0)) && (
          <Box>
            <p>General Settings</p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Toolbar;
