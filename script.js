'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2025-01-01T18:49:59.371Z',
    '2025-01-06T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

//Dates
// const date = new Date();
// const day = `${date.getDate()}`.padStart(2, 0);
// const month = `${date.getMonth() + 1}`.padStart(2, 0);
// const year = date.getFullYear();
// const hour = `${date.getHours()}`.padStart(2, 0);
// const min = `${date.getMinutes()}`.padStart(2, 0);
// labelDate.textContent = `${year}/${month}/${day}, ${hour}:${min}`;

//Format Currency
const formatCurrency = function (value, locale, currency) {
  // Format the movement value
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
//Calculate account Balance function
const calDisplayBalance = function (acc) {
  acc.balance__value = acc.movements.reduce(
    function (accumulator, currentValue) {
      return accumulator + currentValue;
    } /*the accumulator is set here it can be any value*/
  );
  // labelBalance.textContent = `${acc.balance__value.toFixed(2)}€`;
  labelBalance.textContent = formatCurrency(
    acc.balance__value,
    acc.locale,
    acc.currency
  );
};
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPass = calcDaysPassed(new Date(), date);
  console.log(daysPass);

  if (daysPass === 0) return 'Today';
  if (daysPass === 1) return 'Yesterday';
  if (daysPass <= 7) return `${daysPass} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${year}/${month}/${day}}`;
    return new Intl.DateTimeFormat(locale).format(date); // Localized date formatting
  }
};
//Add Data to Movement Container and display movement
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // Combine movements and dates, with a fallback for missing dates
  const combinedMovsDates = acc.movements.map((mov, index) => ({
    movement: mov,
    movementDate: acc.movementsDates?.[index] || new Date().toISOString(),
  }));

  // Sort if necessary
  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);

  combinedMovsDates.forEach((mov, index) => {
    const { movement, movementDate } = mov;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    // Format the date
    const date = new Date(movementDate);
    const displayDate = formatMovementDate(date, acc.locale);
    //Currency
    const formattedMov = formatCurrency(movement, acc.locale, acc.currency);
    // Generate HTML
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Calculate the summary and display
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, val) => acc + val, 0);
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const outGoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, val) => acc + val, 0);
  // labelSumOut.textContent = `${Math.abs(outGoing).toFixed(2)}€`;
  labelSumOut.textContent = formatCurrency(outGoing, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(desposit => desposit > 0)
    .map(desposit => (desposit * acc.interestRate) / 100) //calculate each deposit interest
    .filter(interests => interests >= 1) //the interst will will if only it's >= 1
    .reduce((acc, val) => acc + val, 0); //summing all the interests in one amount
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};
//Create userName by getting Initials
const creatUserName = function (accs) {
  accs.forEach(eachAcc => {
    eachAcc.usrName = eachAcc.owner
      .toLowerCase()
      .split(' ')
      .map(usrName => usrName[0])
      .join('');
  });
};
creatUserName(accounts);

//Update UI function
const updateUI = function (account) {
  //Display Movement
  displayMovements(account);
  //Display Balance
  calDisplayBalance(account);
  //Display Summary
  calcDisplaySummary(account);
};

//Logout Timer
const logOutTimer = function () {
  //set timer to 5 minutes
  let timer = 100;

  const tick = function () {
    const minute = String(Math.trunc(timer / 60)).padStart(2, 0); // get the minutes
    const second = String(timer % 60).padStart(2, 0); // get seconds
    //In each call, print the remaining time to UI
    labelTimer.textContent = `${minute}:${second}`;

    //When it's 0 second timer stops and user is logged out
    if (timer === 0) {
      clearTimeout(userTimer);
      labelWelcome.textContent = 'Log in to get Started';
      containerApp.style.opacity = 0;
    }
    //Decrease 1s timer  each the callback function is called
    timer--;
  };
  //call time every second
  tick();
  const userTimer = setInterval(tick, 1000);
  return userTimer;
};
//Event Handlers: get user name and pin
let currentAccount, userTimer;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault(); //prevent form from submitting

  currentAccount = accounts.find(
    user => user.usrName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Update time based on the user locale
    const date = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      //weekday: 'long', //short
    };
    //const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(date);

    //Clear input field user and pin
    (inputLoginUsername.value = ''), (inputLoginPin.value = '');
    inputLoginPin.blur();

    //start timer function
    if (userTimer) clearInterval(userTimer);
    userTimer = logOutTimer();
    //Updating the UI calling the function
    updateUI(currentAccount);
  }
});
//console.log(currentAccount);
//Transfer money from user to a specific user
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Math.floor(inputTransferAmount.value); //Rounding user input
  const receiveAcc = accounts.find(
    acc => acc.usrName === inputTransferTo.value
  ); //find the username to transfer to...
  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance__value >= amount &&
    receiveAcc?.usrName !== currentAccount.usrName
  ) {
    //Setting the transactions
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);
    //Transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiveAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    //console.log(`${amount} Transfered Succefully`);
    //Reset timer when the user is still active

    //start timer function
    if (userTimer) clearInterval(userTimer);
    userTimer = logOutTimer();
  }
  //clear input fields
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});
//Button Loan request
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov > loanAmount * 0.1)
  ) {
    setTimeout(function () {
      //check if the last deposit is greater than 10% of the loan if so grant the loan
      currentAccount.movements.push(loanAmount);
      //Loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      //Update UI
      updateUI(currentAccount);
      //Reset timer when the user is still active
      //start timer function
      if (userTimer) clearInterval(userTimer);
      userTimer = logOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
});

//Close an Account using splice(index) & findIndex()
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.usrName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.usrName === currentAccount.usrName
    );
    accounts.splice(index, 1); //Delete Account, 1 item from the array accounts
    containerApp.style.opacity = 0; //Hide account, or remove from the UI
    //console.log(currentAccount.usrName + ' Account Deleted');
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});
//sorting movements and State variable to monitor sorting btn
let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  // displayMovements(acc.movements, !sorted);
  // sorted = !sorted;

  if (currentAccount) {
    // Pass currentAccount to displayMovements
    displayMovements(currentAccount, !sorted);
    sorted = !sorted; // Toggle the sorted state
  }
});

/* Praticals
//Convert string to number
console.log(Number('24'));
console.log(+'24');

//Parsing bit advanced
console.log(Number.parseInt('24em', 10)); //specify the base eg: 10
console.log(Number.parseInt('e24', 10)); //output NaN
console.log(Number.parseFloat('2.4em', 10)); //output: 2.4

//Check if a value is not a number
console.log(Number.isNaN(10));
console.log(Number.isNaN('24em'));

//Check if it's a real number
console.log(Number.isFinite(10));
console.log(Number.isInteger(10));
//Squareroot
console.log(Math.sqrt(25)); // output: 5
console.log(25 ** (1 / 2)); // output: 5

//cubuc root
console.log(8 ** (1 / 3)); // output: 2

//Claculate circle space
console.log(Math.PI * Number.parseFloat('12px') ** 2);

//function to generate random
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
console.log(randomInt(12, 20));

//Rounding methodes
console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor(23.9));

console.log(Math.trunc(23.3));

console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.9));

//Rounding the decimals
console.log((-23.3).toFixed(0));
console.log((2.3).toFixed(3));
console.log((2.753).toFixed(2));

/////////////////////////////////////////////////

calculate days difference on give two numbers
const future = new Date(2037,10,19,15,23);
console.log(+future);//str to number
const calcDaysPassed = (date1,date2)=> Math.abs((date2 -date1)/(1000*60*60*24));
(1000: convertes the milliseconds to seconds
   60* convertes seconds to minutes
   60* convertes minutes to an hour
   24 convertes hours to days)
   const daysDifer = calcDaysPassed(new Date(2037,3,14),new Date(2037,3,24));
console.log(daysDifer);

//Formating Number and Style , Units
const num = 3585459.25;

const option = {
  style: 'currency',
  unit: 'celsius',
  currency: 'ZAR',
};
console.log('RSA:', new Intl.NumberFormat('en-SA', option).format(num));
console.log('UK:', new Intl.NumberFormat('en-UK', option).format(num));
console.log('Fr:', new Intl.NumberFormat('fr-FR', option).format(num));

//SetimeOut
const ingredients = ['olives Cheese & Butter', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) =>
    console.log(`Here is your pizza made with ${ing1} and ${ing2} 🍕`),
  2500,
  ...ingredients
);
console.log('Wait... while we get your order Ready!');

//clear timeout based on acondition
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

const opt = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};
setInterval(function () {
  const now = new Date();
  const clock = new Intl.DateTimeFormat(navigator.language, opt).format(now);
  console.log(clock);
}, 1000);

*/
