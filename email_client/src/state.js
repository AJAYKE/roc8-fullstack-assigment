const state = {
  emails: [],
  currentPage: 1,
  totalEmails: 0,
  emailBody: null,
  filters: {
    unread: false,
    read: false,
    favorites: false,
  },
  readEmails: new Set(),
  favoriteEmails: new Set(),
};

function saveState() {
  localStorage.setItem(
    "favoriteEmails",
    JSON.stringify([...state.favoriteEmails])
  );
  localStorage.setItem("readEmails", JSON.stringify([...state.readEmails]));
}

function loadState() {
  const favorites = JSON.parse(localStorage.getItem("favoriteEmails")) || [];
  const reads = JSON.parse(localStorage.getItem("readEmails")) || [];
  state.favoriteEmails = new Set(favorites);
  state.readEmails = new Set(reads);
}
