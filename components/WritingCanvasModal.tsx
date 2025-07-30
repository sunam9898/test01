import React, { useRef, useEffect, useCallback } from 'react';
import { Hanja } from '../types';
import XMarkIcon from './icons/XMarkIcon';
import BrushIcon from './icons/BrushIcon';

interface WritingCanvasModalProps {
  hanja: Hanja;
  onClose: () => void;
}

export default function WritingCanvasModal({ hanja, onClose }: WritingCanvasModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const getCanvasContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  const drawBackgroundCharacter = useCallback(() => {
    const ctx = getCanvasContext();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFF9FA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#FFCDD2';
    ctx.lineWidth = 1;
    for (let i = 20; i < canvas.width; i+=20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
     for (let i = 20; i < canvas.height; i+=20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    ctx.fillStyle = 'rgba(239, 154, 154, 0.2)';
    ctx.font = '200px "Noto Serif KR"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(hanja.character, canvas.width / 2, canvas.height / 2);
  }, [getCanvasContext, hanja.character]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    drawBackgroundCharacter();
  }, [drawBackgroundCharacter]);

  const getCoords = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in event.nativeEvent) {
      return {
        x: event.nativeEvent.touches[0].clientX - rect.left,
        y: event.nativeEvent.touches[0].clientY - rect.top
      };
    }
    return {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY
    };
  };

  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    isDrawing.current = true;
    const { x, y } = getCoords(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#6D4C41';
  }, [getCanvasContext]);

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const ctx = getCanvasContext();
    if (!ctx) return;
    const { x, y } = getCoords(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [getCanvasContext]);

  const stopDrawing = useCallback(() => {
    const ctx = getCanvasContext();
    if (!ctx) return;
    ctx.closePath();
    isDrawing.current = false;
  }, [getCanvasContext]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#FFF9FA] rounded-3xl shadow-2xl p-6 w-full max-w-lg relative animate-fade-in border-4 border-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold hanja text-[#E57373]">"{hanja.character}" 따라쓰기</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-pink-100 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6 text-pink-400" />
          </button>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full h-auto aspect-square rounded-lg border-2 border-pink-200 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="mt-4 flex justify-end">
          <button 
            onClick={drawBackgroundCharacter}
            className="flex items-center gap-2 px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200/80 font-bold text-lg"
          >
            <span>다시 쓸래요! 🧼</span>
          </button>
        </div>
      </div>
    </div>
  );
}