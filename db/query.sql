SELECT position.position_name AS position, department.dep_name
FROM position
LEFT JOIN department
ON position.dep_id = department.id
ORDER BY department.dep_name;

SELECT employee.employee_name AS employee, position.position_name, department.dep_name
FROM employee
LEFT JOIN position
ON employee.position_id = position.id
ORDER BY position.position_name;