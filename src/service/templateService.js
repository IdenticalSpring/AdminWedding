import axios from 'axios';

export const AdminAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllTemplates = async (page = 1, limit = 12) => {
  try {
    const response = await AdminAPI.get(`/templates?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error.response?.data || { message: 'Failed to fetch templates' };
  }
};

export const getTemplateById = async (id) => {
  try {
    const response = await AdminAPI.get(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    throw error.response?.data || { message: 'Failed to fetch template' };
  }
};

export const createTemplate = async (templateData, thumbnail) => {
  try {
    const formData = new FormData();
    formData.append('name', templateData.name);
    formData.append('description', templateData.description);
    formData.append('accessType', templateData.accessType);
    formData.append('metaData', templateData.metaData);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    const response = await AdminAPI.post('/templates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error.response?.data || { message: 'Failed to create template' };
  }
};

export const updateTemplate = async (id, templateData, thumbnail) => {
  try {
    const formData = new FormData();
    formData.append('name', templateData.name);
    formData.append('description', templateData.description);
    formData.append('accessType', templateData.accessType);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    const response = await AdminAPI.patch(`/templates/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating template:', error);
    throw error.response?.data || { message: 'Failed to update template' };
  }
};

export const deleteTemplateById = async (id) => {
  try {
    const response = await AdminAPI.delete(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error.response?.data || { message: 'Failed to delete template' };
  }
};

export default {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplateById,
};
