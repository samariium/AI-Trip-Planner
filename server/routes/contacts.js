const express = require('express');
const router = express.Router();
const { getContacts, addContact } = require('../controllers/contactsController');

// GET /api/contacts/:destination
router.get('/:destination', getContacts);

// POST /api/contacts
router.post('/', addContact);

module.exports = router;
