const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.innerText = currCode;
    option.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "PKR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Flag update
function updateFlag(element) {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");

  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Fetch exchange rate
async function updateExchangeRate() {
  let amountInput = document.querySelector(".amount input");
  let amount = amountInput.value;

  if (amount === "" || amount <= 0) {
    amount = 1;
    amountInput.value = "1";
  }

  msg.innerText = "Loading...";

  try {
    let res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurr.value}`);
    let data = await res.json();

    let rate = data.rates[toCurr.value];

    if (!rate) {
      msg.innerText = "Currency not supported ❌";
      return;
    }

    let finalAmount = amount * rate;

    msg.innerText = `${amount} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (err) {
    msg.innerText = "API Error ❌";
    console.log(err);
  }
}

// Button click
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Load default
window.addEventListener("load", () => {
  updateExchangeRate();
});