const goBackBtn = document.getElementById("go-back-btn");
const previousUrl = document.referrer;

if (previousUrl) {
  goBackBtn.href = previousUrl;
} else {
  goBackBtn.href = "/";
}
