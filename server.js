const express = require('express');
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'Eldivino404@',
    database: 'staff_db'
  },
  console.log(`Connected to the staff_db database.`)
);

// initial prompt
const init = () => {
  promptUser().then((data) => {
    switch (data.action) {
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add employee':
        addEmployee();
        break;
      case 'Update employee role':
        updateEmployeeRole();
        break;
      case 'Update employee manager':
        updateEmployeeManager();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'Add role':
        addRole();
        break;
      case 'View all departments':
        viewDepartments();
        break;
      case 'Add department':
        addDepartment();
        break;
    
    }
  });
};

init();
// Prompt the user for what they would like to do
const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'Add employee',
        'Update employee role',
        'View all roles',
        'Add role',
        'View all departments',
        'Add department',
      ],
    }
  ])
}

// View all employees
const viewEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dep_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    init();
  });
};

// Add an employee
const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter employee first name:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter employee last name:',
    },
    {
      type: 'input',
      name: 'role_id',
      message: 'Enter employee role ID:',
    },
    {
      type: 'input',
      name: 'manager_id',
      message: 'Enter employee manager ID:',
    },
  ])
    .then((data) => {
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      const params = [data.first_name, data.last_name, data.role_id, data.manager_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Employee added successfully!');
        init();
      });
    });
};

// Update an employee role
const updateEmployeeRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'employee_id',
      message: 'Enter employee ID:',
    },
    {
      type: 'input',
      name: 'role_id',
      message: 'Enter new role ID:',
    },
  ])
    .then((data) => {
      const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
      const params = [data.role_id, data.employee_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Employee role updated successfully!');
        init();
      });
    });
};

// view all roles
const viewRoles = () => {
  const sql = `SELECT role.id, role.title, role.salary, department.dep_name AS department FROM role LEFT JOIN department ON role.department_id = department.id;`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    init();
  });
};

// Add a role
const addRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter role title:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter role salary:',
    },
    {
      type: 'input',
      name: 'department_id',
      message: 'Enter department ID:',
    },
  ])
    .then((data) => {
      const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      const params = [data.title, data.salary, data.department_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Role added successfully!');
        init();
      });
    });
};

// view all departments
const viewDepartments = () => {
  const sql = `SELECT * FROM department;`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    init();
  });
};
// Add a department
const addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'dep_name',
      message: 'Enter department name:',
    },
  ])
    .then((data) => {
      const sql = `INSERT INTO department (dep_name) VALUES (?)`;
      const params = [data.dep_name];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('Department added successfully!');
        init();
      });
    });
};


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
