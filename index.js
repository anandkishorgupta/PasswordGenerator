const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("button");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.getElementById("uppercase");
const lowercaseCheck = document.getElementById("lowercase");
const numbersCheck = document.getElementById("numbers");
const symbolsCheck = document.getElementById("symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

// The querySelectorAll() method returns a static NodeList of elements that match the CSS selector. If no element matches, it returns an empty NodeList.
// Note that the NodeList is an array-like object, not an array object. However, in modern web browsers, you can use the forEach() method or the for...of loop.
let password = "";
let passwordLength = 10;
let checkCount = 0;
let symbols = "!@#$%^&*()_+{}[]|\\;:'\",./<>?`~";

function shufflePassword(array) {
    // fisher yates method
    for (let i = Array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        // swapping
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp
    }
    let str = "";
    array.forEach((el) => (
        str += el
    ))
    return str;
}
// strength circle color to grey

// set passwordLength
function handleSlider() {
    // slider value
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}
handleSlider();

function setIndicator() {
    indicator.style.backgroundColor = color;
}

function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber() {
    return getRandInteger(0, 9);
}
function generateLowerCase() {
    return String.fromCharCode(getRandInteger(97, 123));
}
function generateUpperCase() {
    return String.fromCharCode(getRandInteger(65, 91));
}
function generateSymbol() {
    let symbolLength = symbols.length;
    const randNum = getRandInteger(0, symbolLength);
    return symbols.charAt(randNum);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) {
        hasUpper = true;
    }
    if (lowercaseCheck.checked) {
        hasLower = true;
    }
    if (numbersCheck.checked) {
        hasNum = true;
    }
    if (symbolsCheck.checked) {
        hasSym = true;
    }
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0fo");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied"
    } catch (error) {
        copyMsg.innerText = "fail"
    }
    copyMsg.classList.add("active")
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000)
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++
        }
    })
    // special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount
        handleSlider()
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange)
})

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider()
})

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
        copyContent()
    }
})

generateBtn.addEventListener("click", () => {

    // none of the checked box are selected
    if (checkCount <= 0) {
        return
    }
    if (passwordLength < checkCount) {
        passwordLength = checkCount
        handleSlider()
    }
    // find new password

    // remove old password
    password = "";


    // 
    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {

        funcArr.push(generateLowerCase);

    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);

    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);

    }
    // compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();

    }

    // remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandInteger(0, funcArr.length)
        password += funcArr[randIndex]();
    }
    console.log("password " + password)
    // shuffle the password
    password = shufflePassword(Array.from(password));
    // show it in ui
    passwordDisplay.value = password
    // calling strength function
    calcStrength();
})