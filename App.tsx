
import React from 'react';
import { Player } from './components/Player';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Player />
      </div>
    </div>
  );
}

export default App;