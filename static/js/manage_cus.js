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
        window.location.href = "http://localhost:3000/employee/manage_cus";
    } else {
        alert("Update customer failed");
    }
}

async function confirmDeletion(id){
    event.preventDefault();
    const isConfirmed = confirm("Do you want to delete this customer?");
    if (isConfirmed) {
        const response = await fetch("/employee/manage_cus/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
        });

        if (response.ok) {
            alert("Delete customer successfully");
            window.location.reload();
        } else {
            alert("Delete customer failed");
        }
    }
}

async function confirmAdding(){
    event.preventDefault();
    const id = document.getElementById("id").value
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const gender = document.getElementById("gender").value;
    const ssid = document.getElementById("ssid").value;

    if (!name || !email || !phone || !gender || !ssid) {
        alert("Please fill in all required fields.");
        return false;
    }

    const requestBody = {
        id: id,
        name: name,
        email: email,
        phone: phone,
        ssid : ssid,
        gender: gender
    }

    const response = await fetch("/employee/manage_cus/confirm-add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (response.ok) {
        alert("Add customer successfully");
        window.location.href = "http://localhost:3000/employee/manage_cus";
    } else {
        alert("Add customer failed");
    }
}

