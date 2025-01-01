document.querySelectorAll(".star-rating i").forEach(function (star) {
  star.addEventListener("click", function (event) {
    const parentId = event.target.parentNode.id;

    const rating = event.target.getAttribute("data-value");

    document.querySelector(`input[name="${parentId}"]`).value = rating;

    event.target.parentNode.querySelectorAll("i").forEach(function (star) {
      if (star.getAttribute("data-value") <= rating) {
        star.classList.add("active");
      } else {
        star.classList.remove("active");
      }
    });
  });
});

document.querySelector("form").addEventListener("submit", function (event) {
  const requiredInputs = document.querySelectorAll("input[required]");
  let isValid = true;

  requiredInputs.forEach(function (input) {
    if (!input.value) {
      isValid = false;
      input.classList.add("is-invalid"); // Optional: add class for styling invalid fields
    } else {
      input.classList.remove("is-invalid");
    }
  });

  // If not all required inputs are filled, prevent form submission
  if (!isValid) {
    event.preventDefault();
    Swal.fire({
      title: "Oooops!",
      text: "Please rate all categories before submitting the form. Thank you!",
      icon: "warning",
    });
  }
});
