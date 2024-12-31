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
    const isResponsive = window.innerWidth <= 700; // Kiểm tra nếu màn hình nhỏ hơn hoặc bằng 700px
    const style = isResponsive
      ? component.responsiveStyle || component.style
      : component.style;

    switch (component.type) {
      case "text":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: style.left,
              top: style.top,
              fontSize: style.fontSize,
              fontFamily: style.fontFamily,
              width: style.width,
              height: style.height,
              color: style.color,
              backgroundColor: style.fillColor,
              "@media (max-width: 700px)": {
                position: "absolute",
                left: style.left,
                top: style.top,
                width: "60vw",
                fontSize: "20px",
                marginBottom: "10px",
              },
            }}
          >
            <Typography variant={style.fontSize}>
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
              left: style.left,
              top: style.top,
              width: component.style.width,
              height: component.style.height,
              borderRadius: "50%",
              backgroundColor: style.fillColor,
              opacity: style.opacity / 100 || "1",
              "@media (max-width: 700px)": {
                position: "absolute",
                left: style.left,
                top: style.top,
                width: "30vw",
                height: "20vh",
                margin: "0 auto 10px auto",
              },
            }}
          >
            <img
              src={component.src}
              alt="image component"
              style={{
                width: component.style.width,
                height: component.style.height,
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>
        );
      case "rect":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: style.left,
              top: style.top,
              width: style.width,
              height: style.height,
              backgroundColor: style.fillColor || "#ccc",
              borderRadius: style.borderRadius || "0%",
              opacity: style.opacity / 100 || "1",
              "@media (max-width: 700px)": {
                position: "absolute",
                left: style.left,
                top: style.top,
                width: "30vw",
                height: "20vh",
                marginBottom: "10px",
              },
            }}
          />
        );
      case "image":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: style.left,
              top: style.top,
              width: style.width,
              height: style.height,
              overflow: "hidden",
              borderRadius: style.borderRadius || "0%",
              opacity: style.opacity / 100 || "1",
              "@media (max-width: 700px)": {
                position: "absolute",
                left: style.left,
                top: style.top,
                width: "100vw",
                height: "50vh",
                marginBottom: "10px",
              },
            }}
          >
            <img
              src={component.src}
              alt="image component"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        );
      case "line":
        return (
          <Box
            key={component.id}
            sx={{
              position: "absolute",
              left: style.left,
              top: style.top,
              width: style.width,
              height: style.height || 5,
              backgroundColor: style.lineColor,
              opacity: style.opacity / 100 || 1,
              "@media (max-width: 700px)": {
                position: "absolute",
                left: style.left,
                top: style.top,
                width: "60vw",
                height: "50vh",
                marginBottom: "10px",
              },
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
    <Box
      sx={{
        padding: 2,
        "@media (max-width: 700px)": {
          padding: 1,
        },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          "@media (max-width: 700px)": {
            fontSize: "20px",
          },
        }}
      >
        View Template: {template.name || "Untitled"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Description</Typography>
          <Typography>
            {template.description || "No description provided."}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Sections</Typography>
          {template.sections && template.sections.length > 0 ? (
            [...template.sections]
              .sort((a, b) => parseInt(a.position) - parseInt(b.position))
              .map((section) => (
                <Box
                  key={section.id}
                  sx={{
                    position: section.metadata?.style.position,
                    border: section.metadata?.style.border,
                    padding: section.metadata?.style.padding,
                    minHeight: section.metadata?.style.minHeight,
                    marginBottom: section.metadata?.style.marginBottom,
                    width: section.metadata?.style.minWidth,
                    backgroundColor: section.metadata?.style.backgroundColor,
                    "@media (max-width: 700px)": {
                      position: "relative",
                      padding: "10px",
                      width: "100vw",
                      height: "50vh",
                      marginBottom: "10px",
                      overflow: "hidden",
                    },
                  }}
                >
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
        <Button
          variant="contained"
          onClick={handleBack}
          sx={{
            "@media (max-width: 700px)": {
              width: "100%",
            },
          }}
        >
          Back to Template Management
        </Button>
      </Box>
    </Box>
  );
};

export default ViewTemplate;
