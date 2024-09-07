const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay=document.querySelector("[data-lengthNumber]")
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

//Initial Values
let password = "";
let passwordLength = 10;
let checkCount = 0;
const symbol = '!@#$%^&*(){}|"?><..";`~=-]\[/;.,';
handleSlider();
setIndicator("#ccc")

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;  // as password length is changed in special condition as well
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRndInteger(min, max) {
   return  Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123))
}
function generateUpperCase() {
     return String.fromCharCode(getRndInteger(65,91))
}
function generateSymbol() {
    const randNum=getRndInteger(0, symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength() {
    let hasuppercase = 0;
    let haslowercase = 0;
    let hassymbol = 0;
    let hasnumber = 0;

    if (lowercaseCheck.checked) haslowercase = 1;
    if (uppercaseCheck.checked) hasuppercase = 1;
    if (numberCheck.checked) hasnumber = 1;
    if (symbolCheck.checked) hassymbol = 1;

    if (passwordLength >= 8 && hasnumber && hassymbol && (haslowercase || hasuppercase)) {
        setIndicator("#0f0");
    }
    else if (passwordLength >= 6 && (hasnumber|| hassymbol) && (haslowercase|| hasuppercase)) {
        setIndicator("0#ff0");
    }
    else {
        setIndicator("#f00");
    }

}


async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }

    // to make copy span visible 
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

// Required for generating password
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    })

    // special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange); ////why the bro why 
})

function shufflePassword(array) {
    console.log("password shuffled");
    //Fisher Yates Method [shuffle array]
    for (let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => { str += el });
    return str;
}

generateBtn.addEventListener('click', () => {

    if(checkCount== 0){
    return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // removing old password
    password = ""
    
    let funcarr = [];
    
    if (uppercaseCheck.checked) {
        funcarr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcarr.push(generateLowerCase);
    }
    if (numberCheck.checked) {
        funcarr.push(generateRandomNumber);
    }
     if (symbolCheck.checked) {
        funcarr.push(generateSymbol);
    }

   
    //Compulsory addition
    for (let i = 0; i < funcarr.length; i++){
        password += funcarr[i]();
    }
   

    //remaining addition
    for (let i = 0; i < passwordLength-funcarr.length; i++){
        let randIndex = getRndInteger(0, funcarr.length);
        password += funcarr[randIndex]();
    }


    //shuffle password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
})
