import React, { useState, useCallback } from 'react';
import { Hanja, ExampleSentence } from '../types';
import { getExampleSentence } from '../services/geminiService';
import BrushIcon from './icons/BrushIcon';
import SparklesIcon from './icons/SparklesIcon';

interface FlashcardProps {
  hanja: Hanja;
  onPracticeRequest: (hanja: Hanja) => void;
}

export default function Flashcard({ hanja, onPracticeRequest }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [example, setExample] = useState<ExampleSentence | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent flipping when clicking on buttons inside the card
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsFlipped(!isFlipped);
  };

  const handleGetExample = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (example) { // Hide if already shown
        setExample(null);
        setError(null);
        setIsFlipped(false); // Flip back to front
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await getExampleSentence(hanja.character);
      setExample(result);
      if (!isFlipped) {
        setIsFlipped(true); // Flip to back to show example
      }
    } catch (err) {
      setError('예문을 가져오는 데 실패했어요. 힝...');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [hanja.character, example, isFlipped]);

  const handlePracticeRequest = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPracticeRequest(hanja);
  };


  return (
    <div
      className={`perspective group w-full h-64 md:h-72 ${isFlipped ? 'flipped' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-inner shadow-xl shadow-pink-100 rounded-2xl cursor-pointer relative">
        {/* Front of the card */}
        <div className="card-front flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-pink-100">
          <p className="hanja text-7xl md:text-8xl text-[#5D4037]">{hanja.character}</p>
        </div>

        {/* Back of the card */}
        <div className="card-back flex flex-col justify-between p-4 bg-[#FFEBEE] rounded-2xl border-2 border-pink-100">
            <div className="text-center">
                <p className="text-3xl font-bold text-[#D32F2F]">{hanja.meaning}</p>
                <p className="text-xl text-[#795548] mt-1">{hanja.sound}</p>
            </div>
            
            <div className="mt-2 text-sm h-32 flex items-center justify-center">
                {isLoading && <p className="text-center animate-pulse text-pink-500">예쁜 문장 만드는 중...💖</p>}
                {error && <p className="text-center text-red-700 p-2 bg-red-100 rounded-md w-full">{error}</p>}
                {example && !isLoading && !error && (
                    <div className="p-3 bg-white/80 rounded-lg shadow-inner text-center w-full">
                        <p className="font-semibold text-base text-[#BF360C]">{example.sentence}</p>
                        <p className="text-[#78909C] italic mt-1 text-sm">"{example.translation}"</p>
                    </div>
                )}
            </div>
        </div>

        {/* Action Buttons - visible on hover, positioned absolutely */}
        <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handlePracticeRequest}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg shadow-black/10 hover:bg-pink-50 transition"
            aria-label="Practice writing"
            title="따라쓰기"
          >
            <BrushIcon className="w-5 h-5 text-pink-500" />
          </button>
          <button
            onClick={handleGetExample}
            className={`p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg shadow-black/10 hover:bg-pink-50 transition ${isLoading ? 'animate-pulse' : ''}`}
            aria-label="Get example sentence"
            title={example ? "예문 숨기기" : "예문 보기"}
            disabled={isLoading}
          >
            <SparklesIcon className="w-5 h-5 text-pink-500" />
          </button>
        </div>
      </div>
    </div>
  );
}