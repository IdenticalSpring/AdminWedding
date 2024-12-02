import React from 'react';
import { Button, ButtonGroup, IconButton } from '@mui/material';
import { Rectangle, Circle, Triangle, TextFields, ArrowForward } from '@mui/icons-material';

function ShapeToolbar() {
  return (
    <div style={{ padding: '10px' }}>
      <ButtonGroup orientation="vertical" variant="contained" color="primary">
        <IconButton aria-label="Rectangle" style={{ fontSize: 30 }}>
          <Rectangle />
        </IconButton>
        <IconButton aria-label="Circle" style={{ fontSize: 30 }}>
          <Circle />
        </IconButton>
        <IconButton aria-label="Triangle" style={{ fontSize: 30 }}>
          <Triangle />
        </IconButton>
        <IconButton aria-label="Text" style={{ fontSize: 30 }}>
          <TextFields />
        </IconButton>
        <IconButton aria-label="Arrow" style={{ fontSize: 30 }}>
          <ArrowForward />
        </IconButton>
      </ButtonGroup>
    </div>
  );
}

export default ShapeToolbar;
