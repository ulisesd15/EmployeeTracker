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
  ]);
};

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
      // case 'Update employee manager':
      //   updateEmployeeManager();
      //   break;
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

const viewEmployees = () => {
  const sql = `
    SELECT
      employee.id,
      employee.first_name,
      employee.last_name,
      roles.role_name
    FROM employee
    LEFT JOIN roles ON employee.role_id = roles.id;
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
  });
};
// Call the app


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
    }
  ])
    .then((data) => {
      const sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
      const params = [data.first_name, data.last_name, data.role_id];
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
      name: 'id',
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
      const params = [data.role_id, data.id];
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
  const sql = `SELECT
  roles.id,
  roles.role_name, 
  department.dep_name FROM roles 
  LEFT JOIN department ON roles.department_id = department.id;`;
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
      name: 'role_name',
      message: 'Enter role title:',
    },
    {
      type: 'input',
      name: 'department_id',
      message: 'Enter department ID:',
    },
  ])
    .then((data) => {
      const sql = `INSERT INTO roles (role_name, department_id) VALUES (?, ?)`;
      const params = [data.role_name, data.department_id];
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
