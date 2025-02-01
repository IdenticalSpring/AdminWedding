import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useDrag, useDrop } from "react-dnd";
import DropdownSelectResponsive from "./DropdownSelectResponsive";

const ItemType = "COMPONENT";

const DraggableListItem = ({ 
  component, 
  index, 
  moveComponent, 
  isActive,
  sectionId,
  onSelectComponent 
}) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveComponent(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <ListItem
      ref={(node) => ref(drop(node))}
      onClick={() => onSelectComponent(component, sectionId)}
      sx={{
        pl: 4,
        backgroundColor: isActive ? "#e3f2fd" : "#fff",
        borderRadius: "5px",
        marginBottom: "5px",
        boxShadow: isActive 
          ? "0px 2px 4px rgba(33, 150, 243, 0.3)"
          : "0px 1px 3px rgba(0,0,0,0.2)",
        cursor: "grab",
        border: isActive ? "2px solid #1976d2" : "1px solid #ddd",
        transition: "all 0.2s ease",
        '&:hover': {
          backgroundColor: isActive ? "#e3f2fd" : "#f5f5f5",
        }
      }}
    >
      <ListItemText
        primary={`Component: ${component.id}`}
        secondary={`Type: ${component.type}`}
        sx={{
          '& .MuiListItemText-primary': {
            fontWeight: isActive ? 600 : 400,
            color: isActive ? "#1976d2" : "inherit"
          }
        }}
      />
    </ListItem>
  );
};

const LayerList = ({
  sections,
  activeItem,
  onSelectLayer,
  onSelectComponent,
  onUpdateSections,
}) => {
  const [expandedSections, setExpandedSections] = React.useState({});
  const [selectedSectionId, setSelectedSectionId] = React.useState("");

  const toggleSection = (sectionId) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [sectionId]: !prevState[sectionId],
    }));
  };

  const handleComponentClick = (component, sectionId) => {
    if (onSelectComponent) {
      onSelectComponent({
        componentId: component.id,
        sectionId: sectionId
      });
    }
  };

  const moveComponent = (sectionId, fromIndex, toIndex) => {
    onUpdateSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section;
        const updatedComponents = [...section.components];
        const [movedComponent] = updatedComponents.splice(fromIndex, 1);
        updatedComponents.splice(toIndex, 0, movedComponent);
        updatedComponents.forEach((comp, idx) => {
          comp.zIndex = idx + 1;
        });
        return { ...section, components: updatedComponents };
      })
    );
  };

  const handleDropdownChange = (sectionId, value) => {
    setSelectedSectionId(sectionId);
    onUpdateSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId ? { ...section, responsive: value } : section
      )
    );
  };

  return (
    <Box
      sx={{
        width: "250px",
        flexShrink: 0,
        backgroundColor: "#f5f5f5",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
        padding: "10px",
        zIndex: 10,
        position: "relative",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        Layers
      </Typography>
      <List>
        {sections.map((section) => (
          <Box key={section.id} sx={{ marginBottom: "10px" }}>
            <ListItem
              button
              onClick={() => toggleSection(section.id)}
              sx={{
                backgroundColor: "#e0e0e0",
                borderRadius: "5px",
                marginBottom: "5px",
              }}
            >
              <ListItemText
                primary={`Section: ${section.id}`}
                secondary={`Components: ${section.components.length}`}
              />
              {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <DropdownSelectResponsive
              selectedItemSectionId={section.responsive || ""}
              onChangeSection={(value) => handleDropdownChange(section.id, value)}
            />

            <Collapse in={expandedSections[section.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.components.map((component, index) => (
                  <DraggableListItem
                    key={component.id}
                    component={component}
                    index={index}
                    sectionId={section.id}
                    moveComponent={(fromIndex, toIndex) =>
                      moveComponent(section.id, fromIndex, toIndex)
                    }
                    isActive={
                      activeItem?.componentId === component.id && 
                      activeItem?.sectionId === section.id
                    }
                    onSelectComponent={handleComponentClick}
                  />
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default LayerList;