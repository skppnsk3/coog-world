const employeeController = require('../controllers/employeeController.js');
const express = require('express');
const employeeRouter = express.Router();

// create new employee
employeeRouter.post('/', employeeController.createEmployee);

// retrieve employees (all or specific)
employeeRouter.get('/', employeeController.getAllEmployees);
employeeRouter.get('/', employeeController.getEmployeeById);

// delete employees (all or specific)
employeeRouter.delete('/', employeeController.deleteAllEmployees);
employeeRouter.delete('/', employeeController.deleteEmployeeById);

module.exports = {
    employeeRouter
}