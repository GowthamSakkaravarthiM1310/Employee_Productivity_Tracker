import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Tasks from './pages/Tasks';
import Contributions from './pages/Contributions';
import Collaborations from './pages/Collaborations';
import Commits from './pages/Commits';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="contributions" element={<Contributions />} />
            <Route path="collaborations" element={<Collaborations />} />
            <Route path="commits" element={<Commits />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
