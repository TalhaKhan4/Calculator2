"use strict";
// *** variables and consts ***
let operation = "";
let counterForEqualTo = 0;
let lastOperation;
// ** getting html elements **
const buttons = Array.from(document.getElementsByClassName("buttons"));
const output = document.getElementsByClassName("display")[0];
const btnAc =
  document.getElementsByClassName("container-row1")[0].firstElementChild;

// *** functions ***

// This function allows you to close as many brackets as many you opened and it is called from )
function allowToCloseBracket(operation) {
  let countOpen = 0;
  let countClose = 0;
  for (let value of operation) {
    if (value === "(") countOpen++;
    else if (value === ")") countClose++;
  }
  if (countOpen > countClose) {
    return true;
  }
  return false;
}

// This function adds closing brackets if any is missing
function checkClosingBrackets() {
  let countOpen = 0;
  let countClose = 0;
  for (let value of operation) {
    if (value === "(") countOpen++;
    else if (value === ")") countClose++;
  }
  if (countOpen > countClose) {
    let difference = countOpen - countClose;
    for (let i = 1; i <= difference; i++) {
      operation += ")";
    }
  }
}
// This function convert button AC to C and C to AC
function ACToC() {
  operation.length > 0 ? (btnAc.textContent = "C") : (btnAc.textContent = "AC");
}
// This function replaces * with × and / with ÷ just for the screen
function styleOperation(operation) {
  // operation = operation.replace(/[*]/g, "×");
  // operation = operation.replace(/[/]/g, "÷");
  // The above code might not work in older devices, thus I am writing this code intead
  operation = operation.split("");
  while (
    operation.indexOf("*") !== -1 ||
    operation.indexOf("/") !== -1 ||
    operation.indexOf("%") !== -1
  ) {
    if (operation.indexOf("*") !== -1) {
      let target1 = operation.indexOf("*");
      operation[target1] = "×";
    }
    if (operation.indexOf("/") !== -1) {
      let target2 = operation.indexOf("/");
      operation[target2] = "÷";
    }
    if (operation.indexOf("%") !== -1) {
      let target3 = operation.indexOf("%");
      operation[target3] = "Mod";
    }
  }
  operation = operation.join("");
  return operation;
}
// This function show the value of operation on the screen
function display() {
  ACToC();
  output.textContent = styleOperation(operation);
}
// This function gets the last operation performed
function getLastOperation(operation) {
  let lastOperation = "";
  for (let i = operation.length - 1; i >= 0; i--) {
    lastOperation += operation[i];
    if ("+-*/".indexOf(operation[i]) !== -1) {
      return lastOperation.split("").reverse().join("");
    }
  }
  return lastOperation.split("").reverse().join("");
}
// This function checks for dots to make sure no one can add more than one dot in one operand
function checkForDots() {
  let value = getLastOperation(operation);
  if (value.indexOf(".") === -1) return true;
  else return false;
}
// This function makes the buttons workable
function changeOperation(v) {
  // This contain the last value of operation string, it can be a number or an operator
  let lastValue = operation[operation.length - 1];
  // This code is for consecutive +- etc operators
  if (
    "+-*/".indexOf(operation[operation.length - 1]) !== -1 &&
    "+-*/".indexOf(v) !== -1 &&
    operation[operation.length - 1] !== v
  ) {
    operation = operation.slice(0, operation.length - 1);
  }
  // Handling infinity
  if (operation === "Infinity") operation = "";
  // ------------------------------------------
  // for 1 to 9 numbers
  if ("123456789".indexOf(v) !== -1) {
    // This code is to avoid -01
    if (["+0", "-0", "*0", "/0"].indexOf(getLastOperation(operation)) !== -1) {
      operation = operation.split("");
      operation.pop();
      operation = operation.join("");
    }
    // code to add * after ) when you click a number
    if (operation[operation.length - 1] === ")") operation += "*";
    if (operation === "0" || counterForEqualTo > 0) operation = "";
    operation += v;
  }
  // for zero
  else if (
    operation !== "0" &&
    v === "0" &&
    ["+0", "-0", "*0", "/0"].indexOf(getLastOperation(operation)) === -1
  ) {
    operation += v;
  }
  // for .
  else if (v === "." && checkForDots()) {
    operation += ".";
  }
  // for +
  else if (operation !== "" && "+.".indexOf(lastValue) === -1 && v === "+") {
    operation += v;
  }
  // for -
  else if ("-.".indexOf(lastValue) === -1 && v === "-") {
    operation += v;
  }
  // for *
  else if (operation !== "" && "*.".indexOf(lastValue) === -1 && v === "*") {
    operation += v;
  }
  // for /
  else if (operation !== "" && "/.".indexOf(lastValue) === -1 && v === "/") {
    operation += v;
  }
  // for AC
  else if (v === "Delete") {
    operation = "";
  }
  // for (
  else if (v === "(") {
    if ("0123456789)".indexOf(operation[operation.length - 1]) !== -1)
      operation += "*";

    operation += v;
  }
  // for )
  else if (v === ")" && allowToCloseBracket(operation)) {
    operation += v;
  }
  // for mod or %
  else if (
    v === "%" &&
    operation !== "" &&
    operation[operation.length - 1] !== "("
  ) {
    if (
      [".", "+", "-", "*", "/", "%"].indexOf(
        operation[operation.length - 1]
      ) !== -1
    ) {
      operation = operation.split("");
      operation.pop();
      operation = operation.join("");
    }
    operation += "%";
  }
  // for =
  else if (v === "Enter") {
    // This adds closing brackets by itself if any is missing
    checkClosingBrackets();
    // toFixed method will round long answers to 10 digits only and will also help in giving proper results in floating point number (try 2.2+1.1) in console and see the result, this method help in fixing it
    if (counterForEqualTo === 0) {
      // to avoid 1+(1+1) situation where last operation becomes +1)
      if (operation[operation.length - 1] !== ")") {
        counterForEqualTo++;
      }
      lastOperation = getLastOperation(operation);
      // if you press 1 and equal to
      if (lastOperation === operation) lastOperation = "+0";
      // if you press 1+, 1- etc
      if ("+-*/".indexOf(lastOperation) !== -1) {
        operation = operation + operation.slice(0, operation.length - 1);
        lastOperation = getLastOperation(operation);
      }
      //
      operation = eval(operation).toFixed(10);
    } else {
      operation = operation + lastOperation;
      operation = eval(operation).toFixed(10);
    }
    //removing unnecessary 0's
    operation = operation.split("");
    while (operation[operation.length - 1] === "0") {
      operation.pop();
    }
    if (operation[operation.length - 1] === ".") operation.pop();
    operation = operation.join("");
  }
  // for ←
  else if (v === "Backspace") {
    operation = operation.split("");
    operation.pop("");
    operation = operation.join("");
  }
  //------------------------------------------------------
  if (v !== "Enter") {
    counterForEqualTo = 0;
  }
  display();
}

// *** event listeners ***
// for screen buttons
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const value = button.getAttribute("data-value");
    changeOperation(value);
  });
});
// for keyboard keys
document.addEventListener("keydown", function (event) {
  changeOperation(event.key);
});
