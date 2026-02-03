/**
 * OTRM TV App
 * React Native TV Application
 *
 * @format
 */

import React, { useState } from 'react';
import SplashScreen from './src/components/SplashScreen';
import ChromecastConnectionScreen from './src/components/ChromecastConnectionScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} duration={3000} />;
  }

  return <ChromecastConnectionScreen />;
}

export default App;
