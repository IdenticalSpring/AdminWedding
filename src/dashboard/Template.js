import React, { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Header from "./components/Header";
import {
  getAllTemplates,
  deleteTemplateById,
} from "../service/templateService";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getAllTemplates(1);
        setTemplates(response.data.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTemplateById(id);
      setTemplates(templates.filter((template) => template.id !== id));
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleEdit = (id) => {
    alert(`Edit template with ID: ${id}`);
  };

  const handleAddTemplate = () => {
    navigate("/create-template");
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

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
        <Typography variant="h6">Loading data...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Template Management
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTemplate}
          >
            Create Template
          </Button>
        </Box>
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={templates}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
    </>
  );
};

export default TemplateManagement;
