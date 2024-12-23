import React, { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import Header from "./components/Header";
import {
  getAllTemplates,
  deleteTemplateById,
  duplicateTemplate,
  getSectionsByTemplateId,
  createSectionDuplicate,
} from "../service/templateService";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { v4 as uuidv4 } from "uuid";

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getAllTemplates(1);

        // Log the raw response data
        console.log("Raw Response Data:", response.data);

        // Process the data to ensure subscriptionPlan exists
        const processedData = response.data.map((template) => ({
          ...template,
          subscriptionPlan: template.subscriptionPlan || {
            name: "No Plan",
            description: "",
            price: "0.00",
            duration: 0,
          },
        }));

        // Log the processed data
        console.log("Processed Templates:", processedData);

        setTemplates(processedData);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);
  const handleEdit = (id) => {
    navigate(`/edit-template/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTemplateById(id);
      setTemplates(templates.filter((template) => template.id !== id));
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleView = (id) => {
    navigate(`/view-template/${id}`);
  };

  const handleAddTemplate = () => {
    navigate("/create-template");
  };

  const handleDuplicate = async (id) => {
    try {
      // Lấy dữ liệu template gốc
      const originalTemplate = templates.find((template) => template.id === id);

      if (!originalTemplate) {
        console.error("Template not found!");
        return;
      }

      // Gửi yêu cầu sao chép template lên server
      const duplicatedTemplate = {
        ...originalTemplate,
        id: null, // Đảm bảo ID null để server tạo ID mới
        name: `${originalTemplate.name} (Copy)`, // Thêm "Copy" vào tên
      };

      // Gọi API để duplicate template
      const response = await duplicateTemplate(
        duplicatedTemplate,
        duplicatedTemplate.thumbnailUrl
      );
      const newTemplate = response.data; // Template mới đã được tạo

      // Lấy danh sách các sections của template gốc
      const sectionsResponse = await getSectionsByTemplateId(
        originalTemplate.id
      );
      const sections = sectionsResponse.data;

      if (sections.length > 0) {
        // Duplicate từng section với templateId mới
        const duplicateSectionsPromises = sections.map((section) =>
          createSectionDuplicate({
            ...section,
            id: uuidv4(), // Để server tự sinh ID
            templateId: newTemplate.id, // Liên kết với template mới
          })
        );

        // Chờ tất cả các sections được duplicate
        await Promise.all(duplicateSectionsPromises);
      }

      // Cập nhật danh sách templates trong UI
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);

      console.log("Template and sections duplicated successfully!");
    } catch (error) {
      console.error("Error duplicating template and sections:", error);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "subscriptionPlan",
      headerName: "Subscription Plan",
      flex: 2,
      renderCell: (params) => {
        const plan = params.row.subscriptionPlan;
        if (!plan) return "No Plan";
        return (
          <Box>
            <Typography variant="body1">
              <strong>{plan.name}</strong>
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<RemoveRedEyeIcon />}
          label="View"
          onClick={() => handleView(params.id)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.id)} // Hàm xử lý điều hướng chỉnh sửa
        />,
        <GridActionsCellItem
          icon={<ContentCopyIcon />}
          label="Duplicate"
          onClick={() => handleDuplicate(params.id)}
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
        {/* <Typography variant="h4" gutterBottom>
          Template Management
        </Typography> */}
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
            rows={templates || []}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Box>
      </Box>
    </>
  );
};

export default TemplateManagement;
