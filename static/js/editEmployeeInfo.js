document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const totalDaysOffInput = document.getElementById("employee-totalDaysOff");
    const remainingDaysOffInput = document.getElementById("employee-remainingDaysOff");

    form.addEventListener("submit", function(event) {
        const totalDaysOff = parseInt(totalDaysOffInput.value, 10);
        const remainingDaysOff = parseInt(remainingDaysOffInput.value, 10);

        if (remainingDaysOff > totalDaysOff) {
            event.preventDefault(); // Prevent form submission
            alert("Remaining Days Off cannot be greater than Total Days Off.");
            remainingDaysOffInput.focus(); // Focus on the Remaining Days Off field
        }
    });
});