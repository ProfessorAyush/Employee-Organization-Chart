import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import EmployeeList from './components/EmployeeList';
import OrgChart from './components/OrgChart';
import { fetchEmployees } from './services/api';
import { getTeamWithManagers } from './utils/chartHelpers';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetChartKey, setResetChartKey] = useState(0); // Key to trigger chart reset

  // Load employees from API
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Handle team filter from EmployeeList component
  const handleTeamFilter = useCallback((team) => {
    setSelectedTeam(team);
    if (team) {
      // Get team employees AND their managers for proper hierarchy
      const filtered = getTeamWithManagers(employees, team);
      setFilteredEmployees(filtered);
      // Trigger chart to reset position (center the view)
      setResetChartKey(prev => prev + 1);
    } else {
      setFilteredEmployees(employees);
      // Reset chart position when showing all employees
      setResetChartKey(prev => prev + 1);
    }
  }, [employees]);

  // Handle employee update with OPTIMISTIC UPDATE
  const handleEmployeeUpdate = useCallback((employeeId, newManagerId) => {
    // If called with parameters, do optimistic update
    if (employeeId && newManagerId !== undefined) {
      console.log(`Optimistic update: Employee ${employeeId} → Manager ${newManagerId}`);
      
      // Update the employees array immediately
      setEmployees(prevEmployees => {
        const updated = prevEmployees.map(emp => 
          emp.id === employeeId 
            ? { ...emp, managerId: newManagerId }
            : emp
        );
        
        // Also update filtered employees if a team is selected
        if (selectedTeam) {
          const filtered = getTeamWithManagers(updated, selectedTeam);
          setFilteredEmployees(filtered);
        } else {
          setFilteredEmployees(updated);
        }
        
        return updated;
      });
    } else {
      // If called without parameters, reload from API (fallback/error case)
      console.log('Reloading from API...');
      loadEmployees();
    }
  }, [loadEmployees, selectedTeam]);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Toast Notifications Container */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            fontSize: '14px',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          // Success toast style
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              border: '1px solid #10b981',
            },
          },
          // Error toast style
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              border: '1px solid #ef4444',
            },
          },
          // Loading toast style
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />

      <header className="app-header">
        <h1>Employee Organization Chart</h1>
        <p>Drag and drop employees to reassign managers</p>
      </header>

      <div className="app-content">
        {/* Left Sidebar - Employee List */}
        <aside className="sidebar">
          <EmployeeList 
            employees={employees} 
            onTeamFilter={handleTeamFilter}
          />
        </aside>

        {/* Right Side - Org Chart */}
        <main className="main-content">
          <OrgChart 
            key={resetChartKey} // Reset chart when this key changes
            employees={filteredEmployees}
            selectedTeam={selectedTeam}
            onEmployeeUpdate={handleEmployeeUpdate}
          />
        </main>
      </div>
    </div>
  );
}

export default App;