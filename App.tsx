import React, { useState, useCallback } from 'react';
import { HANJA_CARDS } from './constants';
import { Hanja } from './types';
import Header from './components/Header';
import Flashcard from './components/Flashcard';
import WritingCanvasModal from './components/WritingCanvasModal';
import Footer from './components/Footer';

export default function App() {
  const [cards] = useState<Hanja[]>(HANJA_CARDS);
  const [practiceChar, setPracticeChar] = useState<Hanja | null>(null);

  const handlePracticeRequest = useCallback((hanja: Hanja) => {
    setPracticeChar(hanja);
  }, []);

  const handleCloseModal = useCallback(() => {
    setPracticeChar(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Header />
        <main className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {cards.map((hanja) => (
              <Flashcard 
                key={hanja.id} 
                hanja={hanja} 
                onPracticeRequest={handlePracticeRequest} 
              />
            ))}
          </div>
        </main>
      </div>

      <Footer />

      {practiceChar && (
        <WritingCanvasModal 
          hanja={practiceChar} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}