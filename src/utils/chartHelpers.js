// Utility functions to build hierarchical tree from flat employee data

export const buildTree = (employees, filteredIds = null) => {
  // If we have filtered IDs, only include those employees
  const employeesToUse = filteredIds 
    ? employees.filter(emp => filteredIds.includes(emp.id))
    : employees;

  // Create a map for quick lookup
  const employeeMap = {};
  employeesToUse.forEach(emp => {
    employeeMap[emp.id] = { ...emp, children: [] };
  });

  // Build the tree structure
  const roots = [];
  employeesToUse.forEach(emp => {
    if (emp.managerId === null) {
      // This is a root node (CEO)
      roots.push(employeeMap[emp.id]);
    } else if (employeeMap[emp.managerId]) {
      // Add as child to manager
      employeeMap[emp.managerId].children.push(employeeMap[emp.id]);
    }
  });

  return roots;
};

// Get all employees in a team AND their managers (for proper hierarchy)
export const getTeamWithManagers = (employees, team) => {
  if (!team) return employees;
  
  // Get all employees in the selected team
  const teamEmployees = employees.filter(emp => emp.team === team);
  const teamEmployeeIds = new Set(teamEmployees.map(emp => emp.id));
  
  // Add all their managers up the chain
  const result = [...teamEmployees];
  const addedIds = new Set(teamEmployeeIds);
  
  teamEmployees.forEach(emp => {
    let currentManagerId = emp.managerId;
    // eslint-disable-next-line no-loop-func
    while (currentManagerId !== null) {
      if (!addedIds.has(currentManagerId)) {
        const manager = employees.find(e => e.id === currentManagerId);
        if (manager) {
          result.push(manager);
          addedIds.add(currentManagerId);
          currentManagerId = manager.managerId;
        } else {
          break;
        }
      } else {
        break;
      }
    }
  });
  
  return result;
};

export const findEmployeeById = (tree, id) => {
  for (let node of tree) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findEmployeeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const getAllTeams = (employees) => {
  const teams = new Set(employees.map(emp => emp.team));
  return Array.from(teams).sort();
};

export const searchEmployees = (employees, searchTerm) => {
  if (!searchTerm) return employees;
  
  const term = searchTerm.toLowerCase();
  return employees.filter(emp => 
    emp.name.toLowerCase().includes(term) ||
    emp.designation.toLowerCase().includes(term) ||
    emp.team.toLowerCase().includes(term)
  );
};

export const filterByTeam = (employees, team) => {
  if (!team) return employees;
  return employees.filter(emp => emp.team === team);
};