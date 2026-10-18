const activateAccount = document.getElementById('activate-account');
const balance = document.getElementById('balance');
const inputValue = document.getElementById('input-value');
const walletButtons = document.querySelectorAll('.wallet button');
const transactionList = document.getElementById('transaction-list');
const dialog = document.getElementById('dialog');
const dialogContent = document.getElementById('dialog-content');
const dialogClose = document.getElementById('close');

dialogClose.addEventListener('click', () => dialog.close() );


let currentUser;

activateAccount.addEventListener('click', () => {
  currentUser  = createBankAccount(0);

  const disabledElems = document.querySelectorAll('.disabled');  
  disabledElems.forEach(elem => {
    elem.removeAttribute('disabled');
    elem.classList.toggle('disabled');
  });

  activateAccount.setAttribute('disabled', '');
  activateAccount.classList.toggle('disabled');
});

function createBankAccount(initialBalance) {
  let balance = initialBalance;
  let transactions = [];

  const deposit = (amount) => {
    if (amount <= 0) return;
    transactions.push(`+ ₱${amount}`);
    return balance += amount;
  };
  const withdraw = (amount) => {
    if (amount <= 0 || amount > balance) return;
    transactions.push(`- ₱${amount}`);
    return balance -= amount;
  };
  const getTransactions = () => transactions;
  const getBalance = () => balance;

  return { deposit, withdraw, getBalance, getTransactions };
}

function formattedDate() {
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  return new Intl
    .DateTimeFormat('en-US', options)
    .format(new Date())
    .replace(' at', '')
    .replace(/,(\s\d{2}:\d{2}:\d{2})/, '$1');
}

walletButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const value = +inputValue.value;
    
    if (value <= 0) {
      dialogContent.textContent = 'Please enter a value greater than 0.';
      dialog.showModal();
      return inputValue.value = ''
    };

    const currentButtonId = button.getAttribute('id');
    
    const transaction = document.createElement('li');
    const amount = document.createElement('span');
    const dateTime = document.createElement('span');

    if (currentButtonId === 'deposit') {
      balance.innerText = currentUser.deposit(value);
      inputValue.value = '';

      amount.textContent = `+ ₱${value}`;
      amount.style.color = 'darkGreen';
      transaction.appendChild(amount);

      dateTime.textContent = formattedDate();
      transaction.appendChild(dateTime)
      
      transactionList.prepend(transaction);
      return;
    }

    if (value > currentUser.getBalance()) {
      dialogContent.textContent = 'Please enter an amount less than your balance.';
      dialog.showModal();
      return inputValue.value = '';
    }

    balance.innerText = currentUser.withdraw(value);
    inputValue.value = '';
    
    amount.textContent = `- ₱${value}`;
    amount.style.color = 'darkRed';
    transaction.appendChild(amount);

    dateTime.textContent = formattedDate();
    transaction.appendChild(dateTime)

    transactionList.prepend(transaction);
  });
});