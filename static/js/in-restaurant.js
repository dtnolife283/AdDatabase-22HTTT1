const cart = {};

const totalItemsLabel = document.getElementById("total-items-label");

const placeOrder = document.getElementById("place-order");

const tableElement = document.getElementById("table-id");

placeOrder.addEventListener("click", async function () {
  if (!tableElement.value) {
    let timerInterval;
    Swal.fire({
      title: "Please enter your table ID!",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
    return;
  }
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to place this order?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  });
  if (!result.isConfirmed) {
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");

  const requestBody = {
    cart: cart,
    membershipId: document.getElementById("membership-id").value,
    branchId: document.getElementById("branch-id").value,
    tableId: tableElement.value,
  };

  if (orderId) {
    requestBody.orderId = orderId;
  }

  const response = await fetch("/in-restaurant/place-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  const data = await response.json();
  if (response.ok) {
    const orderId = data.orderId;
    Swal.fire({
      title: "Order placed successfully!",
      text: "Do you want anything else?",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, order more!",
    }).then((result) => {
      if (result.isConfirmed) {
        const newUrl = `${window.location.pathname}?orderId=${orderId}`;
        window.history.pushState({ path: newUrl }, "", newUrl);
        tableElement.disabled = true;
      } else {
        const bill = data.bill;
        populateBillModal(bill, orderId);
        const billModal = new bootstrap.Modal(
          document.getElementById("billModal")
        );
        billModal.show();
      }
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Failed to place order",
      text: data.message,
    });
  }
});

function populateBillModal(bill, orderId) {
  const tableBody = document.querySelector("#billModal tbody");
  const totalQuantity = bill.totalAmount;
  const totalPrice = bill.totalPrice.toLocaleString();
  const actualPrice = bill.actualPrice.toLocaleString();

  tableBody.innerHTML = ""; // Clear previous data

  document.querySelector(".modal-title").innerText = `Your Bill - #${orderId}`;

  bill.orderFoods.forEach((orderFood) => {
    const row = `
      <tr>
        <td>${orderFood.foodName}</td>
        <td>${formatter.format(orderFood.price)}</td>
        <td>${orderFood.quantity}</td>
        <td>${orderFood.amountPrice.toLocaleString()}</td>
      </tr>`;
    tableBody.innerHTML += row;
  });

  const totalInfo = document.querySelector("#billModal .text-end");
  totalInfo.innerHTML = `
    <h6>Total Quantity: ${totalQuantity}</h6>
    <h6>Total Price: ${totalPrice} VNĐ</h6>
    <h6>Actual Price (after discount): ${actualPrice} VNĐ</h6>`;

  const reviewLink = document.getElementById("review-link");
  reviewLink.href = `/in-restaurant/review/${orderId}`;
}

document.querySelector(".row").addEventListener("click", function (e) {
  const foodId = e.target.dataset.foodId;

  const amountLabel = document.getElementById(`food-item-${foodId}`);

  if (e.target.classList.contains("add-one")) {
    amountLabel.innerText = parseInt(amountLabel.innerText) + 1;
  } else {
    if (parseInt(amountLabel.innerText) === 0) {
      return;
    }
    amountLabel.innerText = parseInt(amountLabel.innerText) - 1;
  }
  const currentAmount = parseInt(amountLabel.innerText);
  const id = foodId.split(",")[0];
  if (currentAmount > 0) {
    cart[id] = currentAmount;
  } else {
    delete cart[id];
  }
  updateTotalItems();
});

function updateTotalItems() {
  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );
  totalItemsLabel.innerText = totalItems;
  placeOrder.disabled = totalItems === 0;
}
