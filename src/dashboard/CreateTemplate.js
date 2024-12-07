import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "./template-components/Canvas";
import Toolbar from "./template-components/ToolBar";
import { createTemplate, createSection } from "../service/templateService";

import Headerv2 from "./template-components/Headerv2";
import StyleEditor from "./template-components/StyleEditor";

const CreateTemplate = () => {
  const [sections, setSections] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [activeStyles, setActiveStyles] = useState({});
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [templateData, setTemplateData] = useState({
    name: "",
    description: "",
    accessType: "",
    metaData: {},
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  const handleSaveSections = async () => {
    try {
      // Bước 1: Tạo template và lấy templateId
      const savedTemplate = await createTemplate(templateData);
      console.log("Template:", savedTemplate);
      const templateID = savedTemplate.data?.id;

      if (!templateID) {
        throw new Error("Không thể lấy được templateId!");
      }

      // Bước 2: Cập nhật các section với templateId và metadata
      const sectionsWithMetadata = sections.map((section) => ({
        id: section.id,
        templateId: templateID,
        metadata: {
          components: section.components, // Đóng gói các components vào metadata
        },
      }));

      console.log("Sections đã cập nhật:", sectionsWithMetadata);

      // Bước 3: Lưu từng section vào cơ sở dữ liệu
      for (const section of sectionsWithMetadata) {
        await createSection(section);
      }

      // Bước 4: Hiển thị thông báo thành công
      showSnackbar("Lưu template và sections thành công!", "success");
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi lưu template và sections:", error);
      showSnackbar(error.message || "Lưu thất bại!", "error");
    }
  };

  const handleStyleChange = (key, value) => {
    if (!activeItem) return;
    setActiveStyles((prev) => ({ ...prev, [key]: value }));
    setSections((prev) =>
      prev.map((section) =>
        section.id === activeItem.sectionId
          ? {
              ...section,
              components: section.components.map((component) =>
                component.id === activeItem.componentId
                  ? {
                      ...component,
                      style: { ...component.style, [key]: value },
                    }
                  : component
              ),
            }
          : section
      )
    );
  };

  const handleWheel = (event) => {
    event.preventDefault();
    setScale((prevScale) => {
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      return Math.min(Math.max(prevScale + delta, 0.5), 3);
    });
  };

  const handleMouseDown = (event) => {
    if (!event.shiftKey) return;
    isPanning.current = true;
    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = useCallback((event) => {
    if (!isPanning.current) return;
    const dx = event.clientX - startPoint.current.x;
    const dy = event.clientY - startPoint.current.y;
    setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    startPoint.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const addSection = () => {
    const newSection = { id: Date.now().toString(), components: [] };
    setSections((prevSections) => [...prevSections, newSection]);
    showSnackbar("New section added", "success");
  };

  const handleCanvasClick = (event) => {
    if (event.target.id === "canvas") {
      setActiveItem(null);
      setActiveStyles({});
    }
  };

  const handleComponentClick = (component) => {
    setActiveItem(component);
    setActiveStyles(component.style || {});
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundColor: "#FCFCFC",
        }}
        onClick={handleCanvasClick}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            width: "87%",
            zIndex: 1000,
            backgroundColor: "#FCFCFC",
          }}
        >
          <Headerv2 />
        </Box>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            overflow: "hidden",
            flexDirection: "row-reverse",
          }}
        >
          <Toolbar
            activeStyles={activeStyles}
            handleStyleChange={handleStyleChange}
          />
          <Box
            id="canvas"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
              flex: 1,
              backgroundColor: "#FCFCFC",
              cursor: isPanning.current ? "grabbing" : "grab",
              position: "relative",
            }}
          >
            <Box
              sx={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transformOrigin: "center",
                transition: isPanning.current
                  ? "none"
                  : "transform 0.2s ease-out",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{ width: "800px", height: "600px", position: "relative" }}
              >
                <Canvas
                  sections={sections}
                  setSections={setSections}
                  setActiveItem={handleComponentClick}
                  activeItem={activeItem}
                  setActiveStyles={setActiveStyles}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            position: "fixed",
            display: "flex",
            gap: "10px",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={addSection}
            sx={{ padding: "10px 20px", borderRadius: "5px", fontSize: "16px" }}
          >
            Add Section
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSections}
            sx={{ padding: "10px 20px", borderRadius: "5px", fontSize: "16px" }}
          >
            Save Template
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </DndProvider>
  );
};

export default CreateTemplate;
