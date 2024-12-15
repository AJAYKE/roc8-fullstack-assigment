import { loadPage } from "./script.js";

export function initPagination(state) {
  const prevPage = document.getElementById("prevPage");
  const nextPage = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  function updatePagination() {
    const number_of_emails_start = state.currentPage * 15 - 14;
    const number_of_emails_end = Math.min(
      state.currentPage * 15,
      state.totalEmails
    );
    pageInfo.innerText = `Showing ${number_of_emails_start}–${number_of_emails_end} of ${state.totalEmails}`;
  }

  prevPage.addEventListener("click", () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      loadPage(state.currentPage);
      updatePagination();
    }
  });

  nextPage.addEventListener("click", () => {
    if (state.currentPage * 15 < state.totalEmails) {
      state.currentPage++;
      loadPage(state.currentPage);
      updatePagination();
    }
  });

  return { updatePagination };
}
