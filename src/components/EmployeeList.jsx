import React, { useState, useEffect } from 'react';
import { searchEmployees, filterByTeam, getAllTeams } from '../utils/chartHelpers';

const EmployeeList = ({ employees, onTeamFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    setTeams(getAllTeams(employees));
  }, [employees]);

  useEffect(() => {
    let result = employees;
    
    // Apply team filter
    if (selectedTeam) {
      result = filterByTeam(result, selectedTeam);
    }
    
    // Apply search
    result = searchEmployees(result, searchTerm);
    
    setFilteredEmployees(result);
    
    // Notify parent about team filter for org chart
    onTeamFilter(selectedTeam);
  }, [searchTerm, selectedTeam, employees, onTeamFilter]);

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
  };

  return (
    <div className="employee-list">
      <div className="list-header">
        <h2>Employees</h2>
        
        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, designation, or team..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Team Filter Dropdown */}
        <div className="filter-box">
          <select 
            value={selectedTeam} 
            onChange={handleTeamChange}
            className="team-select"
          >
            <option value="">All Teams</option>
            {teams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee List */}
      <div className="employee-items">
        {filteredEmployees.length === 0 ? (
          <div className="no-results">No employees found</div>
        ) : (
          filteredEmployees.map(employee => (
            <div key={employee.id} className="employee-item">
              <div className="employee-header">
                <img 
                  src={employee.avatar} 
                  alt={employee.name}
                  className="employee-avatar"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=667eea&color=fff&size=40`;
                  }}
                />
                <div className="employee-info">
                  <div className="employee-name">{employee.name}</div>
                  <div className="employee-id">ID: {employee.id}</div>
                </div>
              </div>
              <div className="employee-designation">{employee.designation}</div>
              <div className="employee-team">{employee.team}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeList;