const API_BASE = "https://flipkart-email-mock.now.sh";

async function fetchEmails(page = 1) {
  try {
    const response = await fetch(`${API_BASE}/?page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    state.currentPage--;
  }
}

async function fetchEmailBody(id) {
  const response = await fetch(`${API_BASE}/?id=${id}`);
  const data = await response.json();
  return data.body;
}
