SELECT department.id AS department_id 
FROM department 
LEFT JOIN roles ON department.id = roles.department_id 
LEFT JOIN employee ON roles.id = employee.role_id 
WHERE employee.manager_id = 1;