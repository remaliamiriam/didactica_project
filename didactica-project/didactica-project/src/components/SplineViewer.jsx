import React, { useEffect } from 'react';

export default function SplineViewer() {
  useEffect(() => {
    // Inject script only once
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js';
    document.body.appendChild(script);

    // Optional: You can add configuration options here for disabling zoom
    script.onload = () => {
      const viewer = document.querySelector('spline-viewer');
      viewer.setAttribute('zoom', 'false');  // Disable zoom
      viewer.setAttribute('pan', 'false');   // Disable pan (moving)
      viewer.setAttribute('rotation', 'true'); // Allow rotation
      viewer.setAttribute('background', 'transparent'); // Transparent background
    };
    
  }, []);

  return (
    <div style={{ width: '900px', height: '700px', overflow: 'hidden' }}>
      <spline-viewer
        url="https://prod.spline.design/Ss-9epAxphYuMho6/scene.splinecode"
        style={{ width: '100%', height: '100%', objectFit:'contain' }}
        zoom="false"  // Disable zoom
        pan="false"   // Disable pan (moving)
        background="transparent"  // Transparent background
      ></spline-viewer>
    </div>
  );
}


