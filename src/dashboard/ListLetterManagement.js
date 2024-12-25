import React, { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Tooltip } from "@mui/material";

const ListLetterManagement = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    // Fake API call to simulate loading data
    setTimeout(() => {
      const sampleLetters = [
        {
          id: uuidv4(),
          name: "Welcome Letter",
          description: "This is a welcome letter for new users.",
          subscriptionPlan: { name: "Premium Plan" },
        },
        {
          id: uuidv4(),
          name: "Cancellation Letter",
          description: "Letter for subscription cancellation.",
          subscriptionPlan: null,
        },
      ];
      setLetters(sampleLetters);
      setLoading(false); // Turn off loading
    }, 1000);
  }, []);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "subscriptionPlan",
      headerName: "Subscription Plan",
      flex: 2,
      renderCell: (params) => {
        const plan = params.row.subscriptionPlan;
        return plan ? (
          <Box>
            <Typography variant="body1">
              <strong>{plan.name}</strong>
            </Typography>
          </Box>
        ) : (
          "No Plan"
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <Tooltip title="View Letter" arrow>
          <GridActionsCellItem
            icon={<RemoveRedEyeIcon />}
            label="View"
            onClick={() => console.log("View", params.row)}
          />
        </Tooltip>,
        <Tooltip title="Edit Letter" arrow>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => console.log("Edit", params.row)}
          />
        </Tooltip>,
        <Tooltip title="Duplicate Letter" arrow>
          <GridActionsCellItem
            icon={<ContentCopyIcon />}
            label="Duplicate"
            onClick={() => console.log("Duplicate", params.row)}
          />
        </Tooltip>,
        <Tooltip title="Delete Letter" arrow>
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => console.log("Delete", params.row)}
          />
        </Tooltip>,
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
            onClick={() => navigate("/createInvitation")}
          >
            Create Letter
          </Button>
        </Box>
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={letters}
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

export default ListLetterManagement;
