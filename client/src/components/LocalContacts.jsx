const ROLE_ICONS = {
  'Tourist Guide':   { icon: '👤', bg: '#eff6ff' },
  'Taxi Service':    { icon: '🚕', bg: '#fff7ed' },
  'Homestay':        { icon: '🏠', bg: '#f0fdf4' },
  'Emergency':       { icon: '🆘', bg: '#fef2f2' },
  'Hospital':        { icon: '🏥', bg: '#fef2f2' },
  'Police':          { icon: '👮', bg: '#eff6ff' },
  'Tourism Office':  { icon: '🏢', bg: '#f0f9ff' },
  'Restaurant':      { icon: '🍽️', bg: '#fff1f2' },
  'Hotel':           { icon: '🏨', bg: '#faf5ff' }
};

const getRoleStyle = (role = '') => {
  for (const [key, val] of Object.entries(ROLE_ICONS)) {
    if (role.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { icon: '📋', bg: '#f8fafc' };
};

const LocalContacts = ({ contacts }) => (
  <div className="contacts-grid">
    {contacts.map((contact, i) => {
      const { icon, bg } = getRoleStyle(contact.role);
      const isEmergency = contact.role?.toLowerCase().includes('emergency')
        || contact.role?.toLowerCase().includes('police')
        || contact.role?.toLowerCase().includes('hospital');

      return (
        <div
          key={i}
          className="contact-card"
          style={isEmergency ? { borderTop: '3px solid #ef4444' } : {}}
        >
          <div className="contact-header">
            <div className="contact-role-icon" style={{ background: bg }}>
              {icon}
            </div>
            <div>
              <div className="contact-role">{contact.role}</div>
              <div className="contact-name">{contact.name}</div>
            </div>
          </div>

          {contact.description && (
            <p className="contact-desc">{contact.description}</p>
          )}

          {contact.contactInfo && (
            <div className="contact-phone">
              <span>📞</span>
              <span>{contact.contactInfo}</span>
            </div>
          )}

          {contact.available && (
            <div className="contact-available">
              <span>🕐</span>
              <span>{contact.available}</span>
            </div>
          )}

          {contact.verified && (
            <div>
              <span className="contact-verified">✓ Verified</span>
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default LocalContacts;
