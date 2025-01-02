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

async function updateCustomer() {
    event.preventDefault();
    const id = document.getElementById("id").value
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const gender = document.getElementById("gender").value;
    const ssid = document.getElementById("ssid").value;

    const requestBody = {
        id: id,
        name: name,
        email: email,
        phone: phone,
        ssid : ssid,
        gender: gender,
    }

    const response = await fetch("/employee/manage_cus/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (response.ok) {
        alert("Update customer successfully");
    } else {
        alert("Update customer failed");
    }
}

