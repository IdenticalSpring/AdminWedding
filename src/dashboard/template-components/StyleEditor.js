import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

const StyleEditor = ({ activeStyles, handleStyleChange }) => {
  if (!activeStyles || Object.keys(activeStyles).length === 0) return null;

  return (
    <Box
      sx={{
        padding: 0.5,
        borderTop: '1px solid #ddd',
        backgroundColor: '#fcfcfc',
        mt: 2,
        width: '100%',
      }}
    >
      <Typography variant='h6' gutterBottom>
        Edit Styles
      </Typography>
      <Box sx={{ display: 'flex', flexDirection:'column', gap: 2 }}>
        <TextField
          label='Width'
          value={activeStyles.width || ''}
          onChange={(e) => handleStyleChange('width', e.target.value)}
          size='small'
          fullWidth // TextField spans the full width of its container
        />
        <TextField
          label='Height'
          value={activeStyles.height || ''}
          onChange={(e) => handleStyleChange('height', e.target.value)}
          size='small'
          fullWidth
        />
        <TextField
          label='Background Color'
          value={activeStyles.backgroundColor || ''}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          size='small'
          fullWidth
        />
        <TextField
          label='Font Size'
          value={activeStyles.fontSize || ''}
          onChange={(e) => handleStyleChange('fontSize', e.target.value)}
          size='small'
          fullWidth
        />
        <TextField
          label='Color'
          value={activeStyles.color || ''}
          onChange={(e) => handleStyleChange('color', e.target.value)}
          size='small'
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default StyleEditor;
