document.addEventListener("DOMContentLoaded", function() {
    const dropdownButtons = document.querySelectorAll(".dropdown-Button");
  
    dropdownButtons.forEach(button => {
      button.addEventListener("click", function() {
        const menu = this.nextElementSibling;
        menu.classList.toggle("hidden");
      });
  
      document.addEventListener("click", function(event) {
        dropdownButtons.forEach(button => {
          const menu = button.nextElementSibling;
          if (!button.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.add("hidden");
          }
        });
      });
    });
  });