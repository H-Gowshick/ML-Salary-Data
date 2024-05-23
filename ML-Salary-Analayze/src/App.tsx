import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainTable from './Pages/MainTable';
import SecondTable from './Pages/SecondTable';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainTable />} />
        <Route path="/second-table" element={<SecondTable />} />
      </Routes>
    </Router>
  );
};

export default App;
