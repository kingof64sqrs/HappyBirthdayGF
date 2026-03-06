import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Cursor from './components/Cursor';
import StarsBackground from './components/StarsBackground';
import Home from './pages/Home';
import Cause from './pages/Cause';
import Memories from './pages/Memories';

function App() {
    return (
        <>
            <StarsBackground />
            <Cursor />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cause" element={<Cause />} />
                <Route path="/memories" element={<Memories />} />
            </Routes>
        </>
    );
}

export default App;
