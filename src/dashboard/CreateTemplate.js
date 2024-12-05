import React, { useState, useRef, useEffect } from "react";
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
import { getAllWedding } from "../service/weddingService";
import {
  saveHeaderSection,
  saveAboutSection,
  saveEventDetailsSection,
  saveGallerySection,
  saveGuestBookSection,
} from "../service/templateService";
import Headerv2 from "./template-components/Headerv2";
import StyleEditor from "./template-components/StyleEditor";

const CreateTemplate = () => {
  const [sections, setSections] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [activeStyles, setActiveStyles] = useState({});
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [weddings, setWeddings] = useState([]);
  const [selectedWedding, setSelectedWedding] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const isPanning = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });

  // Fetch wedding data on mount
  useEffect(() => {
    const fetchWeddingData = async () => {
      try {
        const data = await getAllWedding();
        setWeddings(data.data);
      } catch (error) {
        console.error("Failed to fetch wedding data:", error);
        showSnackbar("Failed to load wedding data", "error");
      }
    };

    fetchWeddingData();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStyleChange = (key, value) => {
    if (!activeItem) return;

    setActiveStyles((prevStyles) => ({
      ...prevStyles,
      [key]: value,
    }));

    setSections((prevSections) =>
      prevSections.map((section) =>
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
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    setScale((prevScale) => Math.min(Math.max(prevScale + delta, 0.5), 3));
  };

  const handleMouseDown = (event) => {
    if (!event.shiftKey) return;
    isPanning.current = true;
    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseMove = (event) => {
    if (!isPanning.current) return;

    const dx = event.clientX - startPoint.current.x;
    const dy = event.clientY - startPoint.current.y;

    setTranslate((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    startPoint.current = { x: event.clientX, y: event.clientY };
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  const addSection = () => {
    const newSection = { id: Date.now().toString(), components: [] };
    setSections([...sections, newSection]);
  };

  const saveTemplate = async () => {
    if (!selectedWedding) {
      showSnackbar("Please select a wedding", "warning");
      return;
    }

    // Define the order of sections
    const orderedSections = [
      {
        sectionType: "header-section",
        data: {
          weddingId: selectedWedding,
          metaData: JSON.stringify(
            sections.filter((section) => section.type === "header-section")
          ),
        },
      },
      {
        sectionType: "about-section",
        data: {
          weddingId: selectedWedding,
          metaData: JSON.stringify(
            sections.filter((section) => section.type === "about-section")
          ),
        },
      },
      {
        sectionType: "gallery-section",
        data: {
          weddingId: selectedWedding,
          metaData: JSON.stringify(
            sections.filter((section) => section.type === "gallery-section")
          ),
        },
      },
      {
        sectionType: "event-details",
        data: {
          weddingId: selectedWedding,
          metaData: JSON.stringify(
            sections.filter((section) => section.type === "event-details")
          ),
        },
      },
      {
        sectionType: "guestbook-section",
        data: {
          weddingId: selectedWedding,
          metaData: JSON.stringify(
            sections.filter((section) => section.type === "guestbook-section")
          ),
        },
      },
    ];

    try {
      // Save each section in order
      for (let i = 0; i < orderedSections.length; i++) {
        const { sectionType, data } = orderedSections[i];

        // Call the appropriate save function based on the sectionType
        switch (sectionType) {
          case "header-section":
            await saveHeaderSection(data);
            break;
          case "about-section":
            await saveAboutSection(data);
            break;
          case "gallery-section":
            await saveGallerySection(data);
            break;
          case "event-details":
            await saveEventDetailsSection(data);
            break;
          case "guestbook-section":
            await saveGuestBookSection(data);
            break;
          default:
            break;
        }
      }
      showSnackbar("Template saved successfully!", "success");
    } catch (error) {
      console.error("Error saving template:", error);
      showSnackbar("Failed to save template", "error");
    }
  };

  const handleCanvasClick = (event) => {
    if (
      event.target.id === "canvas" ||
      event.target.closest(".component") === null
    ) {
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
              <Typography variant="h4" align="center" sx={{ pt: 2 }}>
                Create Template
              </Typography>
              {/* Dropdown for weddings */}
              <FormControl sx={{ m: 2, minWidth: 200 }}>
                <InputLabel id="wedding-dropdown-label">
                  Select Wedding
                </InputLabel>
                <Select
                  labelId="wedding-dropdown-label"
                  value={selectedWedding}
                  onChange={(e) => setSelectedWedding(e.target.value)}
                  displayEmpty
                >
                  {weddings.map((wedding) => (
                    <MenuItem key={wedding.id} value={wedding.id}>
                      {`${wedding.brideName} & ${wedding.groomName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={addSection}
                sx={{ position: "absolute", top: "10px", right: "100px" }}
              >
                Add Section
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={saveTemplate}
                sx={{ position: "absolute", top: "10px", right: "10px" }}
              >
                Save Template
              </Button>

              <Box
                sx={{
                  width: "800px",
                  height: "600px",
                  position: "relative",
                }}
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
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={addSection}
            sx={{
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "16px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            Add Section
          </Button>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DndProvider>
  );
};

export default CreateTemplate;
