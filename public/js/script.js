let addReferencesBtn = document.getElementById("addReferencesBtn");
let referenceList = document.querySelector(".referenceList");
let referenceDiv = document.querySelectorAll(".referenceDiv")[0];

addReferencesBtn.addEventListener("click", function () {
  let newReferences = referenceDiv.cloneNode(true);
  let input = newReferences.getElementsByTagName("input")[0];
  input.value = "";
  referenceList.appendChild(newReferences);
});
