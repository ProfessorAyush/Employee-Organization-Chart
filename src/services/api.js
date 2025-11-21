// API service functions to interact with MirageJS backend

export const fetchEmployees = async () => {
  try {
    const response = await fetch('/api/employees');
    const data = await response.json();
    return data.employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const updateEmployeeManager = async (employeeId, newManagerId) => {
  try {
    const response = await fetch(`/api/employees/${employeeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        managerId: newManagerId
      }),
    });
    const data = await response.json();
    return data.employee;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};