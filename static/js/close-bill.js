document.getElementById("close-bill").addEventListener("click", function () {
  const newUrl = window.location.pathname;
  window.history.pushState({ path: newUrl }, "", newUrl);
  window.location.reload();
});
