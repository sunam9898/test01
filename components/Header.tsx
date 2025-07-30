import React from 'react';

export default function Header() {
  return (
    <header className="py-8 px-4 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-[#E57373] hanja">
        한자 암기장 🍓
      </h1>
      <p className="text-xl text-[#A1887F] mt-4">
        카드를 콕! 눌러서 뜻을 보고, 붓으로 예쁘게 따라 써봐요! 🎨
      </p>
    </header>
  );
}