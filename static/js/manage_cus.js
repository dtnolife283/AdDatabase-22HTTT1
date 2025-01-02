function filterCustomers() {
    const searchInput = document.getElementById("searchBar").value.toLowerCase();
    const customerCards = document.querySelectorAll(".customer-card");

    customerCards.forEach((card) => {
        const name = card.querySelector(".card-title").textContent.toLowerCase();
        const email = card.querySelector(".card-text:nth-of-type(3)").textContent.toLowerCase();
        const ssid = card.querySelector(".card-text:nth-of-type(4)").textContent.toLowerCase();

        if (
            name.includes(searchInput) ||
            email.includes(searchInput) ||
            ssid.includes(searchInput)
        ) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}


