function filterCustomers() {
    const searchInput = document.getElementById("searchBar").value.toLowerCase();
    const tableRows = document.querySelectorAll("#customerTable tr");

    tableRows.forEach((row) => {
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[4].textContent.toLowerCase();
        const ssid = row.cells[5].textContent.toLowerCase();

        if (
            name.includes(searchInput) ||
            email.includes(searchInput) ||
            ssid.includes(searchInput)
        ) {
            row.style.display = ""; // Show the row
        } else {
            row.style.display = "none"; // Hide the row
        }
    });
}
