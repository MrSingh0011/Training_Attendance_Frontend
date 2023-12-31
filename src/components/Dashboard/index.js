import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import config from '../../config.json'
import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import axios from 'axios';
import { employeesData } from '../../data';


const Dashboard = ({ setIsAuthenticated }) => {
  const [employees, setEmployees] = useState(employeesData);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  async function handleChangeDateRange(data){
      const res = await axios.get(`${config.url}/training?startDate=${data.startDate}&endDate=${data.endDate}`)
      setEmployees(res.data)
    
  }

  const handleEdit = id => {
    const [employee] = employees.filter(employee => employee.id === id);

    setSelectedEmployee(employee);
    setIsEditing(true);
  };

  const handleDelete = id => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        const [employee] = employees.filter(employee => employee.id === id);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${employee.firstName} ${employee.lastName}'s data has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });

        const employeesCopy = employees.filter(employee => employee.id !== id);
        localStorage.setItem('employees_data', JSON.stringify(employeesCopy));
        setEmployees(employeesCopy);
      }
    });
  };

  return (
    <div className="container-fluid m-0 p-0">
      {!isAdding && !isEditing && (
        <>
          <Header
          handleChangeDateRange={handleChangeDateRange}
            setIsAdding={setIsAdding}
            setIsAuthenticated={setIsAuthenticated}
          />
          <div className='container'>
          <Table
            employees={employees}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          </div>
        </>
      )}
      {isAdding && (
        <Add
          employees={employees}
          setEmployees={setEmployees}
          setIsAdding={setIsAdding}
        />
      )}
      {isEditing && (
        <Edit
          employees={employees}
          selectedEmployee={selectedEmployee}
          setEmployees={setEmployees}
          setIsEditing={setIsEditing}
        />
      )}
     
    </div>
  );
};

export default Dashboard;
