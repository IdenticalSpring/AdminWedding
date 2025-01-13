import React, { useEffect, useState } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";

const DropdownMenu = ({ selectedItem, onChange, componentId }) => {
  const [extractedValue, setExtractedValue] = useState("");

  // Tách phần sau dấu "-" từ componentId
  useEffect(() => {
    if (componentId && typeof componentId === "string") {
      // Kiểm tra nếu componentId là chuỗi
      const parts = componentId.split("-");
      const value = parts.length > 1 ? parts[1] : ""; // Lấy phần sau dấu "-"
      setExtractedValue(value);
    } else {
      setExtractedValue(""); // Nếu không hợp lệ, đặt giá trị rỗng
    }
  }, [componentId]);

  const menuItems = [
    { label: "Default", value: "default" },
    { label: "Tên cô dâu", value: "ten_co_dau" },
    { label: "Tên chú rể", value: "ten_chu_re" },
    { label: "Thời gian", value: "thoi_gian" },
    { label: "Địa điểm", value: "dia_diem" },
    { label: "Tên khách", value: "ten_khach" },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Select
        value={extractedValue || ""}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        fullWidth
        size="small"
      >
        <MenuItem value="" disabled>
          -- Chọn mục --
        </MenuItem>
        {menuItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default DropdownMenu;
