// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Box, Button, Snackbar, Alert } from "@mui/material";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import Canvas from "../../components/invitation/Canvas";
// import Toolbar from "../../components/invitation/ToolBar";
// import Headerv2 from "../../components/invitation/Headerv2";
// import { useParams } from "react-router-dom";
// import { userAPI } from "../../../service/user";
// import LayerList from "../../components/invitation/LayerList";

// const CreateInvitation = () => {
//     const { id } = useParams();
//     const [sections, setSections] = useState([]);
//     const [activeItem, setActiveItem] = useState(null);
//     const [activeStyles, setActiveStyles] = useState({});
//     const [scale, setScale] = useState(1);
//     const [translate, setTranslate] = useState({ x: 0, y: 0 });
//     const isPanning = useRef(false);
//     const startPoint = useRef({ x: 0, y: 0 });
//     const [invitationData, setInvitationData] = useState({
//         title: "",
//         message: "",
//         audience: "",
//         template_userId: id,
//         metadata: {},
//     });
//     const [existingInvitation, setExistingInvitation] = useState(false);
//     const [snackbar, setSnackbar] = useState({
//         open: false,
//         message: "",
//         severity: "",
//     });

//     const fetchInvitationData = async () => {
//         try {
//             const response = await userAPI.getTemplateUserById(id);
//             if (response?.data) {
//                 const data = response.data;

//                 if (data.invitation) {
//                     setInvitationData({
//                         id: data.invitation.id, // Ensure ID is added here
//                         ...data.invitation,
//                         metadata: data.invitation.metadata || {},
//                     });

//                     const processedSections = processMetadataToSections(data.invitation.metadata);
//                     setSections(processedSections.length > 0 ? processedSections : [createDefaultSection()]);
//                     setExistingInvitation(true);
//                 } else {
//                     initializeDefaultInvitation();
//                     showSnackbar("No existing invitation found. Default section created.", "info");
//                 }
//             } else {
//                 initializeDefaultInvitation();
//                 showSnackbar("No template data found. Default section created.", "info");
//             }
//         } catch (error) {
//             console.error("Error fetching invitation data:", error);
//             initializeDefaultInvitation();
//             showSnackbar("Error loading invitation data. Default section created.", "error");
//         }
//     };

//     // Function to initialize default invitation and section
//     const initializeDefaultInvitation = () => {
//         setInvitationData({
//             id: "",
//             title: "",
//             message: "",
//             audience: "",
//             template_userId: id,
//             metadata: {},
//         });
//         setSections([createDefaultSection()]);
//         setExistingInvitation(false);
//     };

//     // Function to create a default section
//     const createDefaultSection = () => ({
//         id: `section-${Date.now()}`,
//         position: "1",
//         components: [],
//         style: {
//             width: "100%",
//             minWidth: "800px",
//             minHeight: "500px",
//             padding: "10px",
//             backgroundColor: "#f9f9f9",
//             border: "1px solid #ddd",
//             position: "relative",
//         },
//     });

//     useEffect(() => {
//         fetchInvitationData();
//     }, [id]);

//     const processMetadataToSections = (metadata) => {
//         const styles = metadata?.style || [];
//         const components = metadata?.components || [];
//         return styles.map((styleItem, index) => ({
//             id: `section-${index}`,
//             style: {

//                 ...styleItem, // Ghi đè style từ metadata
//             },
//             components: components[index] || [],
//         }));
//     };

//     const showSnackbar = (message, severity) => {
//         setSnackbar({ open: true, message, severity });
//     };

//     const handleSaveInvitation = async () => {
//         try {
//             const metadata = {
//                 components: sections.map((section) => section.components),
//                 style: sections.map((section) => section.style),
//             };

//             // Loại bỏ các trường không cần thiết
//             const { id, createdAt, updatedAt, ...filteredInvitationData } = invitationData;

//             const dataToSave = { ...filteredInvitationData, metadata };

//             console.log("Saving invitation data:", dataToSave);

//             if (existingInvitation) {
//                 // Update existing invitation
//                 const updatedInvitation = await userAPI.updateInvitation({ ...dataToSave, id });
//                 console.log("Invitation updated successfully:", updatedInvitation);
//                 showSnackbar("Invitation updated successfully!", "success");
//             } else {
//                 // Create new invitation
//                 const savedInvitation = await userAPI.createInvitation(dataToSave);
//                 console.log("Invitation created successfully:", savedInvitation);
//                 showSnackbar("Invitation created successfully!", "success");
//                 setExistingInvitation(true);
//             }
//         } catch (error) {
//             console.error("Error saving invitation:", error);
//             showSnackbar("Failed to save invitation!", "error");
//         }
//     };

//     const handleStyleChange = (key, value) => {
//         if (!activeItem) return;
//         setActiveStyles((prev) => ({ ...prev, [key]: value }));
//         setSections((prev) =>
//             prev.map((section) =>
//                 section.id === activeItem.sectionId
//                     ? {
//                         ...section,
//                         components: section.components.map((component) =>
//                             component.id === activeItem.componentId
//                                 ? {
//                                     ...component,
//                                     style: { ...component.style, [key]: value },
//                                 }
//                                 : component
//                         ),
//                         style: { ...section.style, [key]: value },
//                     }
//                     : section
//             )
//         );
//     };

//     const handleFileUpload = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             try {
//                 // Gọi API để tải ảnh lên
//                 const response = await userAPI.uploadImages(file);

//                 // Kiểm tra phản hồi từ API
//                 if (response?.data?.url) {
//                     const uploadedImageUrl = response.data.url;

//                     // Cập nhật src cho activeItem
//                     setActiveItem((prev) => {
//                         if (!prev) {
//                             console.error("No active item to update!");
//                             return prev;
//                         }

//                         // Cập nhật `src` trong activeItem
//                         const updatedItem = { ...prev, src: uploadedImageUrl };

//                         // Cập nhật lại sections với item đã sửa đổi
//                         setSections((prevSections) =>
//                             prevSections.map((section) =>
//                                 section.id === updatedItem.sectionId
//                                     ? {
//                                         ...section,
//                                         components: section.components.map((comp) =>
//                                             comp.id === updatedItem.id
//                                                 ? updatedItem
//                                                 : comp
//                                         ),
//                                     }
//                                     : section
//                             )
//                         );

//                         console.log("Image uploaded and active item updated:", uploadedImageUrl);
//                         return updatedItem;
//                     });

//                     // Hiển thị thông báo thành công
//                     showSnackbar("Image uploaded successfully!", "success");
//                 } else {
//                     console.error("Image upload failed: No URL in response");
//                     showSnackbar("Image upload failed: No URL in response", "error");
//                 }
//             } catch (error) {
//                 console.error("Error uploading image:", error);
//                 showSnackbar("Error uploading image", "error");
//             }
//         }
//     };

//     return (
//         <DndProvider backend={HTML5Backend}>
//             <Box
//                 sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     height: "100vh",
//                     backgroundColor: "#FCFCFC",
//                 }}
//             >
//                 <Box
//                     sx={{
//                         position: "fixed",
//                         top: 0,
//                         width: "87%",
//                         zIndex: 1000,
//                         backgroundColor: "#FCFCFC",
//                     }}
//                 >
//                     <Headerv2 />
//                 </Box>
//                 <Box sx={{ display: "flex", height: "100%", overflow: "hidden" }}>
//                     <LayerList sections={sections} onUpdateSections={setSections} />
//                     <Box
//                         id="canvas"
//                         sx={{
//                             flex: 1,
//                             position: "relative",
//                             backgroundColor: "#f9f9f9", // Đồng bộ màu nền
//                             display: "flex",
//                             alignItems: "flex-start", // Đặt căn chỉnh lên trên
//                             justifyContent: "center",
//                             overflow: "hidden", // Ẩn phần thừa
//                             height: "calc(100vh - 80px)", // Chiều cao tính toán (trừ phần header)
//                             margin: 0,
//                             padding: 0,
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 width: "100%",
//                                 height: "100%",
//                                 transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
//                                 transformOrigin: "center",
//                                 transition: isPanning.current ? "none" : "transform 0.2s ease-out",
//                             }}
//                         >
//                             <Canvas
//                                 sections={sections}
//                                 setSections={setSections}
//                                 setActiveItem={setActiveItem}
//                                 activeItem={activeItem}
//                                 setActiveStyles={setActiveStyles}
//                             />
//                         </Box>
//                     </Box>

//                     <Toolbar
//                         activeStyles={activeStyles}
//                         handleStyleChange={handleStyleChange}
//                         invitationData={invitationData}
//                         setInvitationData={setInvitationData}
//                         updateSections={setSections}
//                         selectedComponent={activeItem}
//                         handleTextChange={(value) => {
//                             setActiveItem((prev) => ({ ...prev, text: value }));
//                         }}
//                         handleFileUpload={handleFileUpload}
//                     />

//                 </Box>
//                 <Box
//                     sx={{
//                         position: "fixed",
//                         bottom: "20px",
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         display: "flex",
//                         gap: "10px",
//                     }}
//                 >

//                     <Button
//                         variant="contained"
//                         color="secondary"
//                         onClick={handleSaveInvitation}
//                         sx={{ padding: "10px 20px", borderRadius: "5px", fontSize: "16px" }}
//                     >
//                         Save Invitation
//                     </Button>
//                 </Box>

//             </Box>
//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={3000}
//                 onClose={() => setSnackbar({ ...snackbar, open: false })}
//             >
//                 <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
//             </Snackbar>
//         </DndProvider>
//     );
// };
// export default CreateInvitation;
import React, { useState } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const CreateInvitation = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [sections, setSections] = useState([
    {
      id: `section-1`,
      components: [
        {
          id: `component-1`,
          text: "Welcome to your invitation editor!",
          style: {
            fontSize: "20px",
            color: "#333",
          },
        },
      ],
      style: {
        width: "100%",
        minHeight: "500px",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        position: "relative",
      },
    },
  ]);

  const handleSaveInvitation = () => {
    console.log("Saving invitation with sections:", sections);
    setSnackbar({
      open: true,
      message: "Invitation saved successfully!",
      severity: "success",
    });
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
      >
        {/* Header */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1000,
            backgroundColor: "#FCFCFC",
            padding: "10px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Typography variant="h5" align="center">
            Create Invitation
          </Typography>
        </Box>

        {/* Canvas */}
        <Box
          sx={{
            flex: 1,
            marginTop: "60px",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              width: "800px",
              backgroundColor: sections[0]?.style?.backgroundColor,
              padding: sections[0]?.style?.padding,
              border: sections[0]?.style?.border,
              minHeight: sections[0]?.style?.minHeight,
            }}
          >
            {sections[0]?.components.map((component) => (
              <Typography
                key={component.id}
                sx={{
                  fontSize: component.style.fontSize,
                  color: component.style.color,
                }}
              >
                {component.text}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Save Button */}
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
            color="secondary"
            onClick={handleSaveInvitation}
            sx={{
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          >
            Save Invitation
          </Button>
        </Box>
      </Box>

      {/* Snackbar */}
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

export default CreateInvitation;
