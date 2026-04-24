import React from 'react';

export default function BasketballParquet() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#1a0f0a]">
      {/* Subtle Wood Grain / Parquet Pattern */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #3d2419 2px, transparent 2px),
            linear-gradient(0deg, #3d2419 2px, transparent 2px)
          `,
          backgroundSize: '100px 300px',
        }}
      />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(0,0,0,0.1) 40px, rgba(0,0,0,0.1) 80px)`,
        }}
      />
      
      {/* Ambient Floor Glow - Static */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#f26522]/5 via-transparent to-transparent" />
    </div>
  );
}
