const currentLocation = window.location.pathname;
const navItems = document.querySelectorAll('.nav-link');
navItems.forEach(item => {
  const itemPath = new URL(item.href).pathname;
  item.classList.toggle('active', itemPath === currentLocation);
});