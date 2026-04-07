import React from 'react';

const BackgroundImage = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      background: `
        linear-gradient(135deg, 
          rgba(255, 255, 255, 0.85) 0%, 
          rgba(255, 255, 255, 0.75) 50%, 
          rgba(255, 255, 255, 0.85) 100%
        ),
        url('/images/flat-lay-green-vegetables-fruits.jpg')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      transition: 'all 0.3s ease',
    }}>
      {/* Dark mode overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--bg-color)',
        opacity: 0.6,
        transition: 'opacity 0.3s ease',
      }} />
    </div>
  );
};

export default BackgroundImage; 