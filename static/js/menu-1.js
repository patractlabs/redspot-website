const tocLinks = Array.from(document.querySelectorAll(".toc a"));
const tocLIs = Array.from(document.querySelectorAll(".toc li"));

window.addEventListener(
  "hashchange",
  () => {
    const hash = location.hash;
    console.log(hash);
    for (let link of tocLinks) {
      const href = link.getAttribute("href");
      if (href === hash) {
        const target = link.parentNode;
        if (target.tagName === "LI") {
          clearActive();
          target.classList.add("active");
        }
      }
    }
  },
  false
);

function clearActive() {
  for (let li of tocLIs) {
    li.classList.remove("active");
  }
}
