document.addEventListener("DOMContentLoaded", async () => {
  const emailListContainer = document.getElementById("emailList");
  const emailBodyContainer = document.getElementById("emailBody");
  const pageInfo = document.getElementById("pageInfo");

  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");

  await loadPage(state.currentPage);

  async function loadPage(page) {
    const data = await fetchEmails(page);
    state.emails = data.list;
    state.totalEmails = data.total;

    renderEmailList();
    updatePagination();
  }

  function renderEmailList() {
    loadState();
    emailListContainer.innerHTML = "";
    state.emails.forEach((email) => {
      if (!shouldDisplayEmail(email)) return;

      const emailItem = document.createElement("div");
      emailItem.className = "email-item";

      if (state.readEmails.has(email.id)) emailItem.classList.add("read");
      if (state.favoriteEmails.has(email.id))
        emailItem.classList.add("favorite");

      emailItem.innerHTML = `
        <div class="avatar">${generateAvatar(email.from.name)}</div>
        <div class="email-meta">
        <div>
          <div><strong>From:</strong> ${email.from.name} (${
        email.from.email
      })</div>
          <div><strong>Subject:</strong> ${email.subject}</div>
          </div>
          <div>${email.short_description}</div>
          <div class="email-date-favourite-status">
          <div>${formatDate(email.date)}</div>
          ${
            state.favoriteEmails.has(email.id)
              ? '<div class="favorite">Favorite</div>'
              : ""
          }
          </div>
        </div>`;
      emailItem.addEventListener("click", () => loadEmailBody(email));
      emailListContainer.appendChild(emailItem);
    });
  }

  async function loadEmailBody(email) {
    const body = await fetchEmailBody(email.id);
    markAsRead(email.id);

    emailBodyContainer.classList.remove("hidden");
    emailBodyContainer.innerHTML = `
        <div class="avatar">${generateAvatar(email.from.name)}</div>
        <div class="email-body-header">
        <div class="email-body-subject-button">
        <h2>${email.subject}</h2>
        <button id="favoriteBtn">
          ${
            state.favoriteEmails.has(email.id)
              ? "Unmark Favorite"
              : "Mark as Favorite"
          }
        </button>
        </div>
      <p>${formatDate(email.date)}</p>
      <div>${body}</div>
      </div>`;

    document.getElementById("favoriteBtn").addEventListener("click", () => {
      toggleFavorite(email.id);

      document.getElementById("favoriteBtn").innerText =
        state.favoriteEmails.has(email.id)
          ? "Unmark Favorite"
          : "Mark as Favorite";

      renderEmailList();
    });

    renderEmailList();
  }

  function shouldDisplayEmail(email) {
    if (state.filters.unread && state.readEmails.has(email.id)) return false;
    if (state.filters.read && !state.readEmails.has(email.id)) return false;
    if (state.filters.favorites && !state.favoriteEmails.has(email.id))
      return false;
    return true;
  }

  function toggleFavorite(id) {
    if (state.favoriteEmails.has(id)) {
      state.favoriteEmails.delete(id);
    } else {
      state.favoriteEmails.add(id);
    }
    saveState();
  }

  const unreadFilterBtn = document.getElementById("unreadFilter");
  const readFilterBtn = document.getElementById("readFilter");
  const favoriteFilterBtn = document.getElementById("favoriteFilter");

  const filterButtons = [unreadFilterBtn, readFilterBtn, favoriteFilterBtn];

  function setActiveFilter(button) {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  }

  unreadFilterBtn.addEventListener("click", () => {
    setActiveFilter(unreadFilterBtn);
    state.filters = { unread: true };
    if (state.readEmails.size === state.emails.length) {
      state.currentPage++;
      loadPage();
    }
    renderEmailList();
  });

  readFilterBtn.addEventListener("click", () => {
    setActiveFilter(readFilterBtn);
    state.filters = { read: true };
    renderEmailList();
  });

  favoriteFilterBtn.addEventListener("click", () => {
    setActiveFilter(favoriteFilterBtn);
    state.filters = { favorites: true };
    renderEmailList();
  });

  function updatePagination() {
    let number_of_emails_start = state.currentPage * 15 - 14;
    pageInfo.innerText = `Showing ${number_of_emails_start}–${
      number_of_emails_start + 14
    } `;
  }

  prevPage.addEventListener("click", () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      loadPage(state.currentPage);
    }
  });

  nextPage.addEventListener("click", () => {
    state.currentPage++;
    loadPage(state.currentPage);
  });
});
