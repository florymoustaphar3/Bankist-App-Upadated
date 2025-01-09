# Bankist-App-Upadated
Overview

Bankist App Updated is a modern and interactive banking application that allows users to manage their finances efficiently. It simulates real-world banking functionalities such as money transfers, loans, and account closures with a seamless user experience.

Features

User Authentication: Secure login system with unique usernames and PINs.

Account Management:

View account balances and transaction summaries.

Deposit and withdrawal tracking with dates.

Sort transactions by amount.

Money Transfer: Transfer money between accounts securely.

Loan Request: Request loans based on account transaction history.

Account Closure: Close accounts with user verification.

Real-Time Updates:

Auto-update of balances and transactions.

Countdown logout timer for security.

Localized currency and date formatting based on user locale.

Technologies Used

HTML, CSS, JavaScript: Front-end development.

Intl API: For localized date and currency formatting.

Event Listeners: For handling user interactions.

How to Use

Login:

Use the following demo accounts for testing:

Username: js, PIN: 1111 (Jonas Schmedtmann)

Username: jd, PIN: 2222 (Jessica Davis)

Features:

View account balance, transactions, and summaries after login.

Transfer money by entering the recipient's username and amount.

Request a loan by entering the desired amount (loan approval is subject to a condition).

Sort transactions using the "Sort" button.

Close the account by providing your username and PIN.

Auto Logout: Remain logged in as long as the session is active. Inactivity triggers an auto-logout after a specified time.

Code Highlights

Account Data Structure

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
  locale: 'pt-PT', // Portuguese
};

Formatting Currency and Dates

const formatCurrency = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPass = calcDaysPassed(new Date(), date);

  if (daysPass === 0) return 'Today';
  if (daysPass === 1) return 'Yesterday';
  if (daysPass <= 7) return `${daysPass} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

How to Run

Clone the repository:

git clone <repository-url>

Open the project in a code editor (e.g., Visual Studio Code).

Open the index.html file in your browser.

Use the demo accounts to explore the application.

Screenshots

Login Page



Dashboard



Future Improvements

Add backend integration for real-world banking functionality.

Enhance security with encrypted PINs and session handling.

Implement more advanced financial features like savings and investments.

License

This project is licensed under the MIT License.

Contributions

Feel free to fork the repository, submit issues, or create pull requests. Contributions are always welcome!
