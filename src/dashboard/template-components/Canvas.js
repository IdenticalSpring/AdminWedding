import React from 'react';
import { Box } from '@mui/material';
import Section from './Section';

const Canvas = ({ sections, setSections, setActiveItem, setActiveStyles }) => {
  return (
    <Box
      sx={{
        border: '1px solid #ddd',
        padding: 2,
        minHeight: '80vh',
        backgroundColor: '#fff',
      }}
    >
      {sections.map((section, index) => (
        <Section
          key={section.id}
          section={section}
          index={index}
          setSections={setSections}
          setActiveItem={setActiveItem}
          setActiveStyles={setActiveStyles}
        />
      ))}
    </Box>
  );
};

export default Canvas;
