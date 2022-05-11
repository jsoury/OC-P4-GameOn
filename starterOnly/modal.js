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
const allInput = Array.prototype.slice.call(document.querySelectorAll("input"));
const allInputFocusable = allInput.slice(0, 5);
const allInputClickable = allInput.slice(5, 13);

// launch modal form
const launchModal = () => {
  toggleButtonSubmit("open");
  allInput.forEach((element) => {
    toggleErrorMessages(element, false);
  });
  modalbg.style.display = "block";
};

//close modal
const closeModal = () => {
  modalbg.style.display = "none";
  hideThanks();
  form.reset();
};

//show thanks message and add class disabled of elements formData
const showThanks = () => {
  document.querySelectorAll(".formData").forEach((element) => {
    element.classList.add("disabled");
  });
  document.querySelector(".thanks").style.display = "block";
};

//hide thanks message and remove class disabled of elements formData
const hideThanks = () => {
  document.querySelectorAll(".formData").forEach((element) => {
    element.classList.remove("disabled");
  });
  document.querySelector(".thanks").style.display = "none";
};

/*
 * if open : value button = c'est parti, on click submit form
 * if close : value button = Fermer, on click close modal
 */
const toggleButtonSubmit = (modal) => {
  modal === "open"
    ? ((modalSubmitBtn.value = "c'est parti"),
      modalSubmitBtn.removeAttribute("onClick"))
    : ((modalSubmitBtn.value = "Fermer"),
      modalSubmitBtn.setAttribute("onClick", "closeModal();"));
};

/*
 * call the validate function to check all the form fields
 * if there is an error show error
 * return false to not close the modal and display the thank you message
 */
const validateSubmit = () => {
  const validations = [
    "first",
    "last",
    "email",
    "birthdate",
    "quantity",
    "location",
    "cgu",
  ];

  for (let validation of validations) {
    validate(validation);
  }

  if (
    validateFirstAndLast(validations[0]) &&
    validateFirstAndLast(validations[1]) &&
    validateEmail() &&
    validateBirthDate() &&
    validateQuantity() &&
    validateLocationCheked() &&
    validateCguCheked()
  ) {
    showThanks();
    toggleButtonSubmit("close");
  }
  return false;
};

//The first name and the last name field has a minimum of 2 characters / is not empty.
const validateFirstAndLast = (inputId) => {
  const patern = /^[^\s][a-zA-Z '.-]{2,}/;
  const word = /^[a-zA-Z '.-]*$/;
  const element = form.elements[inputId];
  if (element.value.length >= 2) {
    if (!patern.test(element.value)) {
      element.parentNode.dataset.error = `Notre système est incapable de traiter les ${
        element === "first" ? "prénoms" : "noms"
      } qui commence par 2 fois ${
        element.value.trim()[0] === undefined
          ? "espace"
          : element.value.trim()[0]
      }`;
      toggleErrorMessages(element, true);
      return false;
    } else if (!word.test(element.value)) {
      element.parentNode.dataset.error = `Votre ${
        element === "first" ? "prénom" : "nom"
      } doit être écrit sans accent et seulement avec les caractères (' . -). Desolé pour la gêne occasionné`;
      toggleErrorMessages(element, true);
      return false;
    }
    toggleErrorMessages(element, false);
    return true;
  } else {
    element.parentNode.dataset.error = "doit contenir plus de 2 caractéres";
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

//validate birthdate is not empty && > than today
const validateBirthDate = () => {
  const elemBirthdate = form.elements.birthdate;
  const birthdate = new Date(elemBirthdate.valueAsDate);
  let today = new Date();
  var ageLimite = birthdate.setFullYear(birthdate.getFullYear() + 14);

  if (elemBirthdate.valueAsDate === null) {
    elemBirthdate.parentNode.dataset.error =
      "Merci de saisire votre date de naisanse";
    toggleErrorMessages(elemBirthdate, true);
    return false;
  } else if (ageLimite >= today) {
    elemBirthdate.parentNode.dataset.error =
      "vous devez avoir plus de 14 ans pour participer au marathon";
    toggleErrorMessages(elemBirthdate, true);
    return false;
  } else {
    toggleErrorMessages(elemBirthdate, false);
    return true;
  }
};

//validate quantity < 100
const validateQuantity = () => {
  const quantity = form.elements.quantity;
  return +quantity.value > 0 && +quantity.value <= 100
    ? (toggleErrorMessages(quantity, false), true)
    : (toggleErrorMessages(quantity, true), false);
};

//validate that the location is checked
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

//validate that the cgu is checked
const validateCguCheked = () => {
  const cgu = form.elements.cgu;
  if (cgu.checked) {
    toggleErrorMessages(cgu, false);
    return true;
  } else {
    toggleErrorMessages(cgu, true);
    return false;
  }
};

/*
 * set the data-visible attribute to true or false
 * I have to call the grandparents for the location ellement
 * element = selected dom element
 * etat = true(show), false(hide);
 */
const toggleErrorMessages = (element, etat) => {
  if (element.name == "location") {
    element.parentNode.parentNode.dataset.visible = etat;
  } else {
    element.parentNode.dataset.visible = etat;
  }
};

//wait for the document to load
document.addEventListener("DOMContentLoaded", () => {
  // event listener for the click on the "I register" button
  modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
  // event listener for the click on the "close" button
  modalCloseBtn.addEventListener("click", closeModal);

  //add blur, focus and click on all input elements
  allInputFocusable.forEach((input) => {
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
  });
  allInputClickable.forEach((input) => {
    input.addEventListener("click", (e) => {
      validate(e.currentTarget.name);
    });
  });
});

//switch fonction for valide values input
const validate = (input) => {
  switch (input) {
    case "first":
      return validateFirstAndLast(input);
    case "last":
      return validateFirstAndLast(input);
    case "email":
      return validateEmail();
    case "birthdate":
      return validateBirthDate();
    case "quantity":
      return validateQuantity();
    case "location":
      return validateLocationCheked();
    case "cgu":
      return validateCguCheked();
    case "mailing":
      break;
    default:
      console.log(`${input} n'existe pas`);
  }
};
