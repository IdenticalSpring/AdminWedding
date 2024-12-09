import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { getTemplateById } from "../service/templateService"; // Your service function

const ViewTemplate = () => {
  const { templateId } = useParams(); // Get templateId from URL
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await getTemplateById(templateId);
        setTemplate(response.data);
      } catch (error) {
        console.error("Error fetching template:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleBack = () => {
    navigate("/template"); // Navigate back to the template management page
  };

  // Function to render components dynamically based on metadata
  const renderComponent = (component) => {
    switch (component.type) {
      case "text":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height,
              fontSize: component.style.fontSize,
              color: component.style.color,
            }}
          >
            <Typography variant="body1">
              {component.text || "No text provided"}
            </Typography>
          </Box>
        );
      case "circle":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height,
              borderRadius: "50%",
              backgroundColor: component.style.fillColor,
              borderColor: component.style.borderColor || "",
              borderWidth: component.style.borderWidth || "0px",
              borderColor: component.style.borderColor || "",
              borderStyle: component.style.borderStyle || "none",
              opacity: component.style.opacity / 100 || "1",
            }}
          />
        );
      case "rect":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height,
              backgroundColor: component.style.fillColor || "#ccc", // Default color if not provided
              borderRadius: component.style.borderRadius || "0%",
              borderColor: component.style.borderColor || "",
              borderWidth: component.style.borderWidth || "0px",
              borderColor: component.style.borderColor || "",
              borderStyle: component.style.borderStyle || "none",
              opacity: component.style.opacity / 100 || "1",
            }}
          />
        );
      case "image":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width,
              height: component.style.height,
              overflow: "hidden",
              borderRadius: component.style.borderRadius || "0%",
              borderColor: component.style.borderColor || "",
              borderWidth: component.style.borderWidth || "0px",
              borderColor: component.style.borderColor || "",
              borderStyle: component.style.borderStyle || "none",
              opacity: component.style.opacity / 100 || "1",
            }}
          >
            <img
              src={component.src.startsWith("data:image") ? component.src : ""}
              alt="image component"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // Adjust image to fit box
              }}
            />
          </Box>
        );
      // Handle line case
      case "line":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: component.style.left,
              top: component.style.top,
              width: component.style.width, // Width of the line
              height: component.style.height || 5, // Line height, default to 1px if not specified
              backgroundColor: component.style.lineColor, // Line color
              opacity: component.style.opacity / 100 || 1, // Set opacity
            }}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Loading template...</Typography>
      </Box>
    );
  }

  if (!template) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Template not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        View Template: {template.name || "Untitled"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Description</Typography>
          <Typography>
            {template.description || "No description provided."}
          </Typography>
        </Grid>
        {/* <Grid item xs={12}>
            <Typography variant="h6">Metadata</Typography>
            <Typography>{template.metaData}</Typography>
          </Grid> */}
        <Grid item xs={12}>
          <Typography variant="h6">Sections</Typography>
          {template.sections && template.sections.length > 0 ? (
            template.sections.map((section) => (
              <Box
                key={section.id}
                sx={{
                  position: "relative",
                  border: "1px dashed #ccc",
                  padding: 2,
                  minHeight: "150px",
                  marginBottom: 2,
                  width: "766px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="h6">
                  Section: {section.name || "Unnamed"}
                </Typography>
                {/* Render the components inside the section */}
                {section.metadata?.components?.map(renderComponent)}
              </Box>
            ))
          ) : (
            <Typography>No sections available.</Typography>
          )}
        </Grid>
      </Grid>
      <Box sx={{ marginTop: 2 }}>
        <Button variant="contained" onClick={handleBack}>
          Back to Template Management
        </Button>
      </Box>
    </Box>
  );
};

export default ViewTemplate;
