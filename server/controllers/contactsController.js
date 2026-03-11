const LocalContact = require('../models/LocalContact');

const getContacts = async (req, res) => {
  try {
    const { destination } = req.params;
    const safeDestination = String(destination).trim().slice(0, 100);

    const contacts = await LocalContact.find({
      destination: { $regex: new RegExp(escapeRegex(safeDestination), 'i') }
    }).limit(20);

    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Get contacts error:', error.message);
    res.status(500).json({ error: 'Failed to fetch local contacts.' });
  }
};

const addContact = async (req, res) => {
  try {
    const { destination, name, role, contactInfo, description, rating, languages, available } = req.body;

    if (!destination || !name || !role) {
      return res.status(400).json({ error: 'destination, name, and role are required.' });
    }

    const contact = new LocalContact({
      destination: String(destination).trim().slice(0, 100),
      name: String(name).trim().slice(0, 100),
      role,
      contactInfo: contactInfo ? String(contactInfo).trim().slice(0, 200) : undefined,
      description: description ? String(description).trim().slice(0, 500) : undefined,
      rating: rating ? Number(rating) : undefined,
      languages: Array.isArray(languages) ? languages.map(l => String(l).trim()).slice(0, 10) : [],
      available: available ? String(available).trim().slice(0, 100) : '24/7'
    });

    await contact.save();
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error('Add contact error:', error.message);
    res.status(500).json({ error: 'Failed to add contact.' });
  }
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = { getContacts, addContact };
