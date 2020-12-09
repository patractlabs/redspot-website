const navBurger = document.querySelector(".navbar-burger");
const navMenu = document.querySelector(".navbar-menu");

navBurger.addEventListener("click", (event) => {
  event.stopPropagation();
  navBurger.classList.toggle("is-active");
  navMenu.classList.toggle("is-active");
});

navMenu.addEventListener("click", (event) => {
  event.stopPropagation();
});

window.addEventListener("click", () => {
  navBurger.classList.remove("is-active");
  navMenu.classList.remove("is-active");
});
