const cart = {};

const totalItemsLabel = document.getElementById("total-items-label");

const placeOrder = document.getElementById("place-order");

placeOrder.addEventListener("click", async function () {
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
  const response = await fetch("/online-order/place-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cart),
  });
  const data = await response.json();
  if (response.ok) {
    Swal.fire({
      icon: "success",
      title: "Order placed successfully",
      text: `Your order ID is ${data.orderId}`,
    });
    window.reload();
  } else {
    Swal.fire({
      icon: "error",
      title: "Failed to place order",
      text: data.message,
    });
  }
});

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
  console.log(cart);
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
