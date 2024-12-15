function generateAvatar(name) {
  return name.charAt(0).toUpperCase();
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-GB", { hour12: true });
}

function markAsRead(emailId) {
  state.readEmails.add(emailId);
  saveState();
}
