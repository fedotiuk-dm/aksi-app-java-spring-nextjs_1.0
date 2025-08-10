import React, { useState, useRef } from 'react';
import { useOrderWizardStore } from '@/features/order-wizard';

export const useSignatureCanvas = () => {
  const { customerSignature, setCustomerSignature } = useOrderWizardStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnContent, setHasDrawnContent] = useState(false);

  // Clear signature canvas
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCustomerSignature('');
      setHasDrawnContent(false);
    }
  };

  // Save signature as base64
  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    setCustomerSignature(dataURL);
  };

  // Handle drawing on canvas
  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      setHasDrawnContent(true);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Touch events for mobile devices
  const startDrawingTouch = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      setHasDrawnContent(true);
    }
  };

  const drawTouch = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawingTouch = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setIsDrawing(false);
  };

  return {
    canvasRef,
    isDrawing,
    hasDrawnContent,
    hasSignature: !!customerSignature,
    startDrawing,
    draw,
    stopDrawing,
    startDrawingTouch,
    drawTouch,
    stopDrawingTouch,
    clearSignature,
    saveSignature
  };
};