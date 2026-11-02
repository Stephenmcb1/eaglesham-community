/*
  The "Menu" button on phones. It shows and hides the main navigation.
  Without JavaScript the button stays hidden and the links are always shown.
*/

const button = document.querySelector<HTMLButtonElement>(".menu-button");
const nav = document.querySelector<HTMLElement>("#main-nav");

if (button && nav) {
  // Show the button. CSS hides the navigation while aria-expanded is "false".
  button.hidden = false;

  function setOpen(open: boolean): void {
    button!.setAttribute("aria-expanded", String(open));
  }

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  // Escape closes the menu and puts focus back on the button
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });
}
