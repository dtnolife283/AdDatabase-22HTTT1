function filterEmployees() {
    const input = document.getElementById('searchBar').value.toLowerCase();
    const employees = document.querySelectorAll('.employee-card');

    employees.forEach((employee) => {
        const name = employee.querySelector('.card-title').textContent.toLowerCase();
        const phoneNumber = employee.querySelector('.card-text:nth-child(3) span').textContent.toLowerCase();
        const department = employee.querySelector('.card-text:nth-child(5) span').textContent.toLowerCase();

        if (
            name.includes(input) ||
            phoneNumber.includes(input) ||
            department.includes(input)
        ) {
            employee.classList.remove('hide');
        } else {
            employee.classList.add('hide');
        }
    });
}
  