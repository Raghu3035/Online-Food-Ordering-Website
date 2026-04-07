import React from 'react';

// Skeleton Loading Components
export const SkeletonCard = () => (
  <div style={{
    background: 'var(--bg-color)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid var(--border-color, #e0e0e0)',
  }}>
    <div style={{
      width: '100%',
      height: '200px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '8px',
      marginBottom: '12px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
    <div style={{
      width: '70%',
      height: '20px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '4px',
      marginBottom: '8px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
    <div style={{
      width: '50%',
      height: '16px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '4px',
      marginBottom: '8px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
    <div style={{
      width: '30%',
      height: '16px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '4px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
  </div>
);

export const SkeletonRestaurant = () => (
  <div style={{
    background: 'var(--bg-color)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid var(--border-color, #e0e0e0)',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '12px',
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        borderRadius: '8px',
        marginRight: '12px',
        animation: 'skeleton-loading 1.5s infinite',
      }} />
      <div style={{ flex: 1 }}>
        <div style={{
          width: '80%',
          height: '18px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          borderRadius: '4px',
          marginBottom: '6px',
          animation: 'skeleton-loading 1.5s infinite',
        }} />
        <div style={{
          width: '60%',
          height: '14px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          borderRadius: '4px',
          animation: 'skeleton-loading 1.5s infinite',
        }} />
      </div>
    </div>
    <div style={{
      width: '100%',
      height: '12px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '4px',
      marginBottom: '8px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
    <div style={{
      width: '70%',
      height: '12px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '4px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
  </div>
);

export const SkeletonFoodItem = () => (
  <div style={{
    background: 'var(--bg-color)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid var(--border-color, #e0e0e0)',
  }}>
    <div style={{
      width: '100%',
      height: '150px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '8px',
      marginBottom: '12px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
    <div style={{
      width: '80%',
      height: '18px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '4px',
      marginBottom: '8px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
    <div style={{
      width: '60%',
      height: '14px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '4px',
      marginBottom: '8px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{
        width: '40%',
        height: '16px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        borderRadius: '4px',
        animation: 'skeleton-loading 1.5s infinite',
      }} />
      <div style={{
        width: '60px',
        height: '32px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        borderRadius: '16px',
        animation: 'skeleton-loading 1.5s infinite',
      }} />
    </div>
  </div>
);

export const SkeletonHeader = () => (
  <div style={{
    background: 'var(--header-bg)',
    padding: '16px 0',
    borderBottom: '1px solid var(--border-color, #e0e0e0)',
  }}>
    <div className="container">
      <div className="row align-items-center">
        <div className="col-12 col-md-3">
          <div style={{
            width: '120px',
            height: '40px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            borderRadius: '8px',
            animation: 'skeleton-loading 1.5s infinite',
          }} />
        </div>
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <div style={{
            width: '100%',
            height: '40px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            borderRadius: '20px',
            animation: 'skeleton-loading 1.5s infinite',
          }} />
        </div>
        <div className="col-12 col-md-3 mt-4 mt-md-0 d-flex justify-content-end">
          <div style={{
            width: '60px',
            height: '32px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            borderRadius: '16px',
            marginRight: '12px',
            animation: 'skeleton-loading 1.5s infinite',
          }} />
          <div style={{
            width: '80px',
            height: '32px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            borderRadius: '16px',
            animation: 'skeleton-loading 1.5s infinite',
          }} />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonMenu = () => (
  <div style={{
    background: 'var(--bg-color)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid var(--border-color, #e0e0e0)',
  }}>
    <div style={{
      width: '60%',
      height: '24px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '4px',
      marginBottom: '16px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '16px',
    }}>
      {[1, 2, 3, 4].map((item) => (
        <div key={item} style={{
          width: '100%',
          height: '120px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          borderRadius: '8px',
          animation: 'skeleton-loading 1.5s infinite',
        }} />
      ))}
    </div>
  </div>
);

export const SkeletonOrder = () => (
  <div style={{
    background: 'var(--bg-color)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid var(--border-color, #e0e0e0)',
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    }}>
      <div style={{
        width: '40%',
        height: '18px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        borderRadius: '4px',
        animation: 'skeleton-loading 1.5s infinite',
      }} />
      <div style={{
        width: '80px',
        height: '24px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        borderRadius: '12px',
        animation: 'skeleton-loading 1.5s infinite',
      }} />
    </div>
    <div style={{
      width: '100%',
      height: '12px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '4px',
      marginBottom: '8px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
    <div style={{
      width: '70%',
      height: '12px',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      borderRadius: '4px',
      animation: 'skeleton-loading 1.5s infinite',
    }} />
  </div>
);

// Skeleton Grid for multiple items
export const SkeletonGrid = ({ count = 6, component: Component }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    padding: '20px 0',
  }}>
    {Array.from({ length: count }).map((_, index) => (
      <Component key={index} />
    ))}
  </div>
);

// Skeleton Loading Animation
export const SkeletonStyles = () => (
  <style>{`
    @keyframes skeleton-loading {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }
  `}</style>
);

export default {
  SkeletonCard,
  SkeletonRestaurant,
  SkeletonFoodItem,
  SkeletonHeader,
  SkeletonMenu,
  SkeletonOrder,
  SkeletonGrid,
  SkeletonStyles,
}; 