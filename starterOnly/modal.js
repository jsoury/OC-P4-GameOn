function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const modalCloseBtn = document.querySelector(".close");
const modalSubmitBtn = document.querySelector(".btn-submit");
const form = document.forms.reserve;
const allInput = document.querySelectorAll("input");

// launch modal form
const launchModal = () => {
  modalbg.style.display = "block";
};

//close modal
const closeModal = () => {
  modalbg.style.display = "none";
};

// prevents paste
form.onpaste = function (event) {
  event.preventDefault();
};
const test = () => {
  console.log("test");
};

//switch fonction for valide values input
const validate = (inputId) => {
  console.log("validatee" + " " + inputId);
  switch (inputId) {
    case "first":
      validateFirstAndLast(inputId);
      break;
    case "last":
      validateFirstAndLast(inputId);
      break;
    case "email":
      validateEmail();
      break;
    case "quantity":
      validateQuantity();
      break;
    default:
      console.log(`${inputId} n'existe pas`);
  }
};

const submit = (e) => {
  console.log("submit");
  let isValid = false;
  inputIds = ["first", "last"];
  for (let id of inputIds) isValid = validateFirstAndLast(id);
  isValid = validateEmail();
  isValid = validateQuantity();
  console.log(isValid);
  isValid = validateLocationCheked();
  isValid = false;
  if (!isValid) {
    e.preventDefault();
    alert("bloqué");
    console.log("error");
    return false;
  }
};

//The first name and the last name field has a minimum of 2 characters / is not empty.
const validateFirstAndLast = (inputId) => {
  const element = form.elements[inputId];
  if (element.value.length >= 2) {
    toggleErrorMessages(element, false);
    return true;
  } else {
    toggleErrorMessages(element, true);
    return false;
  }
};

//validate adding email by regex.
const validateEmail = () => {
  const email = form.elements.email;
  const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return isEmail.test(email.value)
    ? (toggleErrorMessages(email, false), true)
    : (toggleErrorMessages(email, true), false);
};

//validate quantity by regex
const validateQuantity = () => {
  const quantity = form.elements.quantity;
  const isInt = /([1-9]?[0-9])|100/;
  return isInt.test(quantity.value)
    ? (toggleErrorMessages(quantity, false), true)
    : (toggleErrorMessages(quantity, true), false);
};

const validateLocationCheked = () => {
  const location = form.elements.location;
  for (let element of location) {
    if (element.checked) {
      toggleErrorMessages(element, false);
      return true;
    } else toggleErrorMessages(element, true);
  }
  return false;
};

//add class name error insert message after input parameters
const toggleErrorMessages = (element, etat) => {
  element.parentNode.dataset.visible = etat;
};

//wait for the document to load
document.addEventListener("DOMContentLoaded", (e) => {
  // launch modal event
  modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
  // close modal event
  modalCloseBtn.addEventListener("click", closeModal);
  // button submit modal event
  form.addEventListener("submit", submit);

  //add blur, focus and click on all input elements
  allInput.forEach((input) => {
    input.addEventListener(
      "blur",
      (e) => {
        validate(e.currentTarget.id);
      },
      false
    );
    input.addEventListener(
      "focus",
      () => {
        toggleErrorMessages(input, false);
      },
      false
    );
    // input.addEventListener("click", (e) => {
    //   validateLocationCheked();
    // });
  });
});
