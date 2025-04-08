const ticketController = require('../controllers/ticketController.js');
const express = require('express');
const ticketRouter = express.Router();

// create a new ticket
ticketRouter.post('/create-ticket', ticketController.createTicket);

// retreive ticket (all or specific)
ticketRouter.get('/', ticketController.getAllTickets);
ticketRouter.get('/info', ticketController.getTicketInfo);
ticketRouter.get('/:num', ticketController.getTicketByNum);
ticketRouter.get('/purchases/:userId', ticketController.getUserTicketPurchases);

// delete ticket (all or specific)
ticketRouter.delete('/delete-all', ticketController.deleteAllTickets);
ticketRouter.delete('/delete-selected', ticketController.deleteTicketById);

ticketRouter.post('/purchase', ticketController.purchaseTicket);

module.exports = {
    ticketRouter
}