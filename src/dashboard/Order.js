import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Header from "./components/Header";
import AddIcon from "@mui/icons-material/Add";
import {
  getAllOrders,
  createOrder,
  deleteOrder,
} from "../service/planSevrvice";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [planId, setPlanId] = useState("");
  const [confirmChange, setConfirmChange] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders(page, limit);
      setOrders(response?.data?.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    const orderData = {
      userId: Number(userId),
      planId: Number(planId),
      confirmChange,
    };

    try {
      await createOrder(orderData);
      showSnackbar("Tạo order thành công", "success");
      setUserId("");
      setPlanId("");
      setConfirmChange(false);
    } catch (error) {
      showSnackbar("Tạo order thất bại!", "error");
    } finally {
      setLoading(false);
      handleCloseDialog();
      fetchOrders();
    }
  };

  const handleDeleteClick = (row) => {
    setSelectedOrder(row.id);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
      setDialogOpen(false);
      showSnackbar("Xóa order thành công", "success");
    } catch (error) {
      showSnackbar("Xóa order thất bại!", "error");
    }
  };

  const handleEdit = (row) => {
    console.log("Edit row:", row);
  };

  const columns = [
    {
      field: "NameUser",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        const { user } = params?.row;
        return user?.name || "N/A";
      },
    },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "subscriptionPlanName",
      headerName: "Subscription Plan Name",
      flex: 1,
      renderCell: (params) => {
        const { subscriptionPlan } = params?.row;
        return subscriptionPlan?.name || "N/A";
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      renderCell: (params) => {
        const { subscriptionPlan } = params?.row;
        return subscriptionPlan?.duration || "N/A";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
      ],
    },
  ];

  return (
    <Box style={{ padding: "0 30px" }}>
      <Header />
      <Paper style={{ marginTop: "20px" }}></Paper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          disabled={loading}
        >
          Thêm mới
        </Button>
      </Box>
      <Box style={{ height: 400 }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={limit}
          disableSelectionOnClick
          getRowId={(row) => row?.id}
          loading={loading}
          onPageChange={(newPage) => setPage(newPage + 1)}
          pagination
          page={page - 1}
          rowCount={total}
        />
      </Box>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Thêm Mới Đơn Hàng</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User ID"
            type="text"
            fullWidth
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Plan ID"
            type="text"
            fullWidth
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Confirm Change</InputLabel>
            <Select
              value={confirmChange}
              onChange={(e) => setConfirmChange(e.target.value)}
              label="Confirm Change"
              required
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleConfirm} color="primary" disabled={loading}>
            {loading ? "Đang tạo..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
      {/*modal xóa*/}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa đơn hàng này không? Thao tác này không thể
            hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={() => handleDelete(selectedOrder)} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Order;
