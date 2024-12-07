import React from "react";
import { Box } from "@mui/material";
import StyleEditor from "./StyleEditor";
import {
  TextBox,
  ImageBox,
  Rectangle,
  Circle,
  Diamond,
  Line,
  Arrow,
  Triangle,
  Hexagon,
} from "../../utils/draggableComponents";

const Toolbar = ({ activeStyles, handleStyleChange }) => {
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
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <TextBox />
        <ImageBox />
        <Rectangle />
        <Circle />
        <Line />
      </Box>

      {activeStyles && (
        <StyleEditor
          activeStyles={activeStyles}
          handleStyleChange={handleStyleChange}
        />
      )}
    </Box>
  );
};

export default Toolbar;
