function generateUniqueId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function formatCurrency(amount, currencyCode = "USD") {
  const settings = loadData(STORAGE_KEYS.SETTINGS);
  const userCurrency = settings.currency || currencyCode;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: userCurrency,
  }).format(amount);
}

const STORAGE_KEYS = {
  WALLETS: "spendSmartWallets",
  TRANSACTIONS: "spendSmartTransactions",
  RECYCLE_BIN: "spendSmartRecycleBin",
  USER_PROFILE: "spendSmartUserProfile",
  SETTINGS: "spendSmartSettings",
};

function loadData(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error loading data from local storage for key ${key}:`, e);
    return defaultValue;
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving data to local storage for key ${key}:`, e);
  }
}

let wallets = loadData(STORAGE_KEYS.WALLETS);
let transactions = loadData(STORAGE_KEYS.TRANSACTIONS);
let recycleBin = loadData(STORAGE_KEYS.RECYCLE_BIN);
let userProfile = loadData(STORAGE_KEYS.USER_PROFILE, { name: "Guest" });
let settings = loadData(STORAGE_KEYS.SETTINGS, {
  theme: "light",
  currency: "INR",
});

const splashScreen = document.getElementById("splashScreen");
const appContent = document.getElementById("appContent");

const totalBalanceDisplay = document.getElementById("totalBalanceDisplay");
const walletsContainer = document.getElementById("walletsContainer");
const noWalletsMessage = document.getElementById("noWalletsMessage");
const transactionsContainer = document.getElementById("transactionsContainer");
const noTransactionsMessage = document.getElementById("noTransactionsMessage");

const addTransactionBtn = document.getElementById("addTransactionBtn");
const addWalletBtn = document.getElementById("addWalletBtn");
const viewWalletsBtn = document.getElementById("viewWalletsBtn");

const transactionModal = document.getElementById("transactionModal");
const transactionModalTitle = document.getElementById("transactionModalTitle");
const transactionForm = document.getElementById("transactionForm");
const transactionType = document.getElementById("transactionType");
const transactionAmount = document.getElementById("transactionAmount");
const transactionWallet = document.getElementById("transactionWallet");
const transactionCategory = document.getElementById("transactionCategory");
const transactionDate = document.getElementById("transactionDate");
const transactionDescription = document.getElementById(
  "transactionDescription"
);
const cancelTransactionBtn = document.getElementById("cancelTransactionBtn");
const transactionAmountError = document.getElementById(
  "transactionAmountError"
);
const transactionWalletError = document.getElementById(
  "transactionWalletError"
);
const transactionCategoryError = document.getElementById(
  "transactionCategoryError"
);
const transactionDateError = document.getElementById("transactionDateError");

const walletModal = document.getElementById("walletModal");
const walletModalTitle = document.getElementById("walletModalTitle");
const walletForm = document.getElementById("walletForm");
const walletName = document.getElementById("walletName");
const walletInitialBalance = document.getElementById("walletInitialBalance");
const cancelWalletBtn = document.getElementById("cancelWalletBtn");
const walletNameError = document.getElementById("walletNameError");
const walletInitialBalanceError = document.getElementById(
  "walletInitialBalanceError"
);

const transactionSearchInput = document.getElementById(
  "transactionSearchInput"
);

const userNameDisplay = document.getElementById("userNameDisplay");
const userNameDashboard = document.getElementById("userNameDashboard");
const userName = document.getElementById("userName");
const userNameError = document.getElementById("userNameError");
const saveProfileBtn = document.getElementById("saveProfileBtn");

const lightThemeBtn = document.getElementById("lightThemeBtn");
const darkThemeBtn = document.getElementById("darkThemeBtn");

const currencySelect = document.getElementById("currencySelect");
const saveCurrencyBtn = document.getElementById("saveCurrencyBtn");

const recycleBinContainer = document.getElementById("recycleBinContainer");
const recycleBinEmptyMessage = document.getElementById(
  "recycleBinEmptyMessage"
);
const clearRecycleBinInput = document.getElementById("clearRecycleBinInput");
const clearRecycleBinBtn = document.getElementById("clearRecycleBinBtn");

const customAlertModal = document.getElementById("customAlertModal");
const customAlertMessage = document.getElementById("customAlertMessage");
const customAlertCloseBtn = document.getElementById("customAlertCloseBtn");
const alertContainer = document.getElementById("alertContainer");

const viewWalletTransactionsModal = document.getElementById(
  "viewWalletTransactionsModal"
);
const currentWalletName = document.getElementById("currentWalletName");
const walletTransactionsContainer = document.getElementById(
  "walletTransactionsContainer"
);
const noWalletTransactionsMessage = document.getElementById(
  "noWalletTransactionsMessage"
);
const closeWalletTransactionsBtn = document.getElementById(
  "closeWalletTransactionsBtn"
);

const clearDataModal = document.getElementById("clearDataModal");
const clearDataForm = document.getElementById("clearDataForm");
const clearDataConfirm1 = document.getElementById("clearDataConfirm1");
const clearDataConfirm2 = document.getElementById("clearDataConfirm2");
const cancelClearDataBtn = document.getElementById("cancelClearDataBtn");
const openClearDataBtn = document.getElementById("openClearDataBtn");
const clearDataError = document.getElementById("clearDataError");

function calculateTotalBalance() {
  return wallets.reduce((total, wallet) => total + wallet.balance, 0);
}

function renderTotalBalance() {
  totalBalanceDisplay.textContent = formatCurrency(
    calculateTotalBalance(),
    settings.currency
  );
}

function renderWallets() {
  walletsContainer.innerHTML = "";
  if (wallets.length === 0) {
    noWalletsMessage.classList.remove("hidden");
    return;
  } else {
    noWalletsMessage.classList.add("hidden");
  }

  wallets.forEach((wallet) => {
    const walletCard = document.createElement("div");
    walletCard.className = "wallet-card";
    walletCard.innerHTML = `
            <h3 class="text-xl font-semibold mb-2 text-text-color">${
              wallet.name
            }</h3>
            <p class="text-3xl font-bold ${
              wallet.balance >= 0 ? "text-primary-teal" : "text-expense-color"
            }">${formatCurrency(wallet.balance, settings.currency)}</p>
            <div class="mt-4 flex space-x-2">
                <button data-id="${
                  wallet.id
                }" class="view-wallet-transactions-btn btn-outline px-3 py-1 text-sm">View Transactions</button>
                <button data-id="${
                  wallet.id
                }" class="delete-wallet-btn btn-danger px-3 py-1 text-sm">Delete</button>
            </div>
        `;
    walletsContainer.appendChild(walletCard);
  });

  document
    .querySelectorAll(".view-wallet-transactions-btn")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        const walletId = event.target.dataset.id;
        viewWalletTransactions(walletId);
      });
    });
  document.querySelectorAll(".delete-wallet-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const walletId = event.target.dataset.id;
      confirmDeleteWallet(walletId);
    });
  });
}

function addWallet(name, initialBalance) {
  const newWallet = {
    id: generateUniqueId(),
    name: name,
    balance: parseFloat(initialBalance) || 0,
  };
  wallets.push(newWallet);
  saveData(STORAGE_KEYS.WALLETS, wallets);
  renderWallets();
  populateWalletDropdown();
  renderTotalBalance();
  showAlert(`Wallet "${name}" added successfully!`, "success");
}

function updateWalletBalance(walletId, amount) {
  const walletIndex = wallets.findIndex((w) => w.id === walletId);
  if (walletIndex !== -1) {
    wallets[walletIndex].balance += amount;
    saveData(STORAGE_KEYS.WALLETS, wallets);
    renderWallets();
    renderTotalBalance();
  }
}

function confirmDeleteWallet(walletId) {
  const wallet = wallets.find((w) => w.id === walletId);
  if (!wallet) return;

  if (wallet.balance !== 0) {
    showAlert(
      `Wallet "${wallet.name}" cannot be deleted. Balance must be zero.`,
      "error"
    );
    return;
  }

  showCustomAlert(
    `Are you sure you want to delete wallet "${wallet.name}"? It will be moved to Recycle Bin for 30 days.`,
    () => {
      deleteWallet(walletId);
    }
  );
}

function deleteWallet(walletId) {
  const walletIndex = wallets.findIndex((w) => w.id === walletId);
  if (walletIndex !== -1) {
    const walletToDelete = wallets[walletIndex];
    addToRecycleBin(walletToDelete, "wallet");
    wallets.splice(walletIndex, 1);
    saveData(STORAGE_KEYS.WALLETS, wallets);
    renderWallets();
    populateWalletDropdown();
    renderTotalBalance();
    showAlert(`Wallet "${walletToDelete.name}" moved to Recycle Bin.`, "info");
    renderRecycleBin();
  }
}

function populateWalletDropdown() {
  transactionWallet.innerHTML = "";
  if (wallets.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No wallets available. Add one first.";
    option.disabled = true;
    option.selected = true;
    transactionWallet.appendChild(option);
    addTransactionBtn.disabled = true;
  } else {
    addTransactionBtn.disabled = false;
    wallets.forEach((wallet) => {
      const option = document.createElement("option");
      option.value = wallet.id;
      option.textContent = wallet.name;
      transactionWallet.appendChild(option);
    });
  }
}

function viewWalletTransactions(walletId) {
  const wallet = wallets.find((w) => w.id === walletId);
  if (!wallet) return;

  currentWalletName.textContent = wallet.name;
  walletTransactionsContainer.innerHTML = "";

  const walletTransactions = transactions
    .filter((t) => t.walletId === walletId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (walletTransactions.length === 0) {
    noWalletTransactionsMessage.classList.remove("hidden");
    walletTransactionsContainer.appendChild(noWalletTransactionsMessage);
  } else {
    noWalletTransactionsMessage.classList.add("hidden");
    walletTransactions.forEach((transaction) => {
      const transactionItem = document.createElement("div");

      transactionItem.className = `transaction-item-card ${
        transaction.type === "expense" ? "expense-bg" : ""
      }`;
      transactionItem.innerHTML = `
                <div>
                    <p class="font-medium text-text-color">${
                      transaction.category
                    }</p>
                    <p class="text-sm text-secondary-text">${
                      transaction.description || "No description"
                    }</p>
                </div>
                <div class="text-right">
                    <p class="text-lg font-semibold ${
                      transaction.type === "income" ? "income" : "expense"
                    }">${
        transaction.type === "income" ? "+" : "-"
      }${formatCurrency(transaction.amount, settings.currency)}</p>
                    <p class="text-xs text-secondary-text">${new Date(
                      transaction.date
                    ).toLocaleDateString()}</p>
                </div>
            `;
      walletTransactionsContainer.appendChild(transactionItem);
    });
  }
  showModal(viewWalletTransactionsModal);
}

const MAX_TRANSACTIONS_DISPLAY = 10;

function renderTransactions(searchTerm = "") {
  transactionsContainer.innerHTML = "";
  let filteredTransactions = transactions;

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    filteredTransactions = filteredTransactions.filter((t) => {
      const wallet = wallets.find((w) => w.id === t.walletId);
      const walletName = wallet ? wallet.name.toLowerCase() : "";
      return (
        t.amount.toString().includes(lowerCaseSearchTerm) ||
        t.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        t.category.toLowerCase().includes(lowerCaseSearchTerm) ||
        t.date.includes(lowerCaseSearchTerm) ||
        walletName.includes(lowerCaseSearchTerm)
      );
    });
  }

  if (filteredTransactions.length === 0) {
    noTransactionsMessage.classList.remove("hidden");
    return;
  } else {
    noTransactionsMessage.classList.add("hidden");
  }

  filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  const groupedTransactions = filteredTransactions.reduce(
    (acc, transaction) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    },
    {}
  );

  let transactionCount = 0;
  for (const date in groupedTransactions) {
    const transactionsForDate = groupedTransactions[date].filter(
      () => transactionCount < MAX_TRANSACTIONS_DISPLAY
    );
    if (
      transactionsForDate.length === 0 &&
      transactionCount >= MAX_TRANSACTIONS_DISPLAY
    ) {
      continue;
    }

    const dateGroup = document.createElement("div");
    dateGroup.innerHTML = `
            <h3 class="timeline-date-header">${new Date(
              date
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</h3>
            <div class="divide-y divide-border-color"></div>
        `;
    const transactionList = dateGroup.querySelector("div");

    groupedTransactions[date].forEach((transaction) => {
      if (transactionCount < MAX_TRANSACTIONS_DISPLAY) {
        const walletName =
          wallets.find((w) => w.id === transaction.walletId)?.name ||
          "Unknown Wallet";
        const transactionItem = document.createElement("div");

        transactionItem.className = `transaction-item-card ${
          transaction.type === "expense" ? "expense-bg" : ""
        }`;
        transactionItem.innerHTML = `
                    <div>
                        <p class="font-medium text-text-color">${
                          transaction.category
                        }</p>
                        <p class="text-sm text-secondary-text">${
                          transaction.description
                            ? transaction.description + " - "
                            : ""
                        } <span class="font-semibold">${walletName}</span></p>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-semibold ${
                          transaction.type === "income" ? "income" : "expense"
                        }">${
          transaction.type === "income" ? "+" : "-"
        }${formatCurrency(transaction.amount, settings.currency)}</p>
                        <button data-id="${
                          transaction.id
                        }" class="delete-transaction-btn text-expense-color hover:text-red-700 text-sm mt-1">Delete</button>
                    </div>
                `;
        transactionList.appendChild(transactionItem);
        transactionCount++;
      }
    });
    transactionsContainer.appendChild(dateGroup);
  }

  document.querySelectorAll(".delete-transaction-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const transactionId = event.target.dataset.id;
      confirmDeleteTransaction(transactionId);
    });
  });
}

function addTransaction(type, amount, category, date, walletId, description) {
  const newTransaction = {
    id: generateUniqueId(),
    type: type,
    amount: parseFloat(amount),
    category: category,
    date: date,
    walletId: walletId,
    description: description,
    timestamp: new Date().toISOString(),
  };
  transactions.push(newTransaction);
  saveData(STORAGE_KEYS.TRANSACTIONS, transactions);
  updateWalletBalance(
    walletId,
    type === "income" ? parseFloat(amount) : -parseFloat(amount)
  );
  renderTransactions(transactionSearchInput.value);
  showAlert("Transaction added successfully!", "success");
}

function confirmDeleteTransaction(transactionId) {
  const transaction = transactions.find((t) => t.id === transactionId);
  if (!transaction) return;

  showCustomAlert(
    `Your transaction for ${formatCurrency(
      transaction.amount,
      settings.currency
    )} (${
      transaction.category
    }) will be moved to Recycle Bin for 30 days. You can recover it from Recycle Bin (Settings tab).`,
    () => {
      deleteTransaction(transactionId);
    }
  );
}

function deleteTransaction(transactionId) {
  const transactionIndex = transactions.findIndex(
    (t) => t.id === transactionId
  );
  if (transactionIndex !== -1) {
    const transaction = transactions[transactionIndex];

    updateWalletBalance(
      transaction.walletId,
      transaction.type === "income" ? -transaction.amount : transaction.amount
    );
    addToRecycleBin(transaction, "transaction");
    transactions.splice(transactionIndex, 1);
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);
    renderTransactions(transactionSearchInput.value);
    showAlert("Transaction moved to Recycle Bin.", "info");
    renderRecycleBin();
  }
}

const RECYCLE_BIN_RETENTION_DAYS = 30;

function addToRecycleBin(item, type) {
  const recycledItem = {
    id: item.id,
    type: type,
    data: item,
    deletedAt: new Date().toISOString(),
  };
  recycleBin.push(recycledItem);
  saveData(STORAGE_KEYS.RECYCLE_BIN, recycleBin);
}

function restoreFromRecycleBin(recycledItemId) {
  const itemIndex = recycleBin.findIndex((item) => item.id === recycledItemId);
  if (itemIndex !== -1) {
    const itemToRestore = recycleBin[itemIndex];
    if (itemToRestore.type === "transaction") {
      transactions.push(itemToRestore.data);
      saveData(STORAGE_KEYS.TRANSACTIONS, transactions);

      updateWalletBalance(
        itemToRestore.data.walletId,
        itemToRestore.data.type === "income"
          ? itemToRestore.data.amount
          : -itemToRestore.data.amount
      );
      renderTransactions(transactionSearchInput.value);
      showAlert("Transaction restored successfully!", "success");
    } else if (itemToRestore.type === "wallet") {
      wallets.push(itemToRestore.data);
      saveData(STORAGE_KEYS.WALLETS, wallets);
      renderWallets();
      populateWalletDropdown();
      renderTotalBalance();
      showAlert("Wallet restored successfully!", "success");
    }
    recycleBin.splice(itemIndex, 1);
    saveData(STORAGE_KEYS.RECYCLE_BIN, recycleBin);
    renderRecycleBin();
  }
}

function cleanupRecycleBin() {
  const now = new Date();
  const cleanedRecycleBin = recycleBin.filter((item) => {
    const deletedDate = new Date(item.deletedAt);
    const diffTime = Math.abs(now - deletedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= RECYCLE_BIN_RETENTION_DAYS;
  });
  if (cleanedRecycleBin.length !== recycleBin.length) {
    recycleBin = cleanedRecycleBin;
    saveData(STORAGE_KEYS.RECYCLE_BIN, recycleBin);
    console.log("Recycle bin cleaned up.");
  }
}

function permanentlyDeleteRecycleBin() {
  if (clearRecycleBinInput.value !== "CLEARRECYCLEBIN") {
    showAlert('Please type "CLEARRECYCLEBIN" to confirm deletion.', "error");
    return;
  }

  recycleBin = [];
  saveData(STORAGE_KEYS.RECYCLE_BIN, recycleBin);
  renderRecycleBin();
  clearRecycleBinInput.value = "";
  showAlert("Recycle Bin has been cleared.", "success");
}

function renderRecycleBin() {
  recycleBinContainer.innerHTML = "";
  if (recycleBin.length === 0) {
    recycleBinEmptyMessage.classList.remove("hidden");
    return;
  } else {
    recycleBinEmptyMessage.classList.add("hidden");
  }

  recycleBin.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "recycle-item";
    const deletedDate = new Date(item.deletedAt);
    const retentionEndDate = new Date(
      deletedDate.getTime() + RECYCLE_BIN_RETENTION_DAYS * 24 * 60 * 60 * 1000
    );
    const daysLeft = Math.ceil(
      (retentionEndDate - new Date()) / (1000 * 60 * 60 * 24)
    );

    let itemDetails = "";
    if (item.type === "transaction") {
      itemDetails = `Transaction: ${item.data.category} (${formatCurrency(
        item.data.amount,
        settings.currency
      )})`;
    } else if (item.type === "wallet") {
      itemDetails = `Wallet: ${item.data.name}`;
    }

    itemElement.innerHTML = `
            <div>
                <p class="font-medium">${itemDetails}</p>
                <p class="text-sm text-secondary-text">Deleted: ${deletedDate.toLocaleDateString()} - Auto-delete in ${daysLeft} days</p>
            </div>
            <button data-id="${
              item.id
            }" class="restore-recycle-item-btn btn-outline px-3 py-1 text-sm">Restore</button>
        `;
    recycleBinContainer.appendChild(itemElement);
  });

  document.querySelectorAll(".restore-recycle-item-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemId = event.target.dataset.id;
      restoreFromRecycleBin(itemId);
    });
  });
}

function renderUserProfile() {
  userNameDisplay.textContent = userProfile.name;
  userNameDashboard.textContent = userProfile.name;
  userName.value = userProfile.name;
}

function saveUserProfile() {
  const newName = userName.value.trim();
  if (newName === "") {
    showErrorMessage(userNameError, "Name cannot be empty.");
    return;
  }
  hideErrorMessage(userNameError);
  userProfile.name = newName;
  saveData(STORAGE_KEYS.USER_PROFILE, userProfile);
  renderUserProfile();
  showAlert("Profile updated successfully!", "success");
}

const CURRENCIES = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
];

function populateCurrencyDropdown() {
  currencySelect.innerHTML = "";
  CURRENCIES.forEach((currency) => {
    const option = document.createElement("option");
    option.value = currency.code;
    option.textContent = `${currency.name} (${currency.symbol})`;
    if (currency.code === settings.currency) {
      option.selected = true;
    }
    currencySelect.appendChild(option);
  });
}

function saveCurrencySetting() {
  settings.currency = currencySelect.value;
  saveData(STORAGE_KEYS.SETTINGS, settings);
  showAlert("Currency updated successfully!", "success");
  renderTotalBalance();
  renderTransactions(transactionSearchInput.value);
  renderRecycleBin();
}

function applyTheme(theme) {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);
  settings.theme = theme;
  saveData(STORAGE_KEYS.SETTINGS, settings);
}

function showModal(modalElement) {
  modalElement.classList.remove("hidden");

  const firstInput = modalElement.querySelector(
    'input:not([type="hidden"]):not([readonly]), select, textarea'
  );
  if (firstInput) {
    firstInput.focus();
  }
}

function hideModal(modalElement) {
  modalElement.classList.add("hidden");

  modalElement
    .querySelectorAll(".input-error-message")
    .forEach((el) => el.classList.add("hidden"));
  modalElement
    .querySelectorAll(".input-field")
    .forEach((el) => el.classList.remove("border-red-500"));
}

function showAlert(message, type = "info") {
  alertContainer.style.pointerEvents = "auto";

  if (window.innerWidth >= 768) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `custom-alert show`;
    alertDiv.innerHTML = `
            <p class="text-text-color mr-4">${message}</p>
            <button class="text-secondary-text hover:text-text-color text-xl font-bold ml-2">&times;</button>
        `;

    if (type === "success") {
      alertDiv.style.borderLeftColor = "var(--primary-teal)";
    } else if (type === "error") {
      alertDiv.style.borderLeftColor = "var(--expense-color)";
    } else {
      alertDiv.style.borderLeftColor = "var(--secondary-text)";
    }

    alertContainer.prepend(alertDiv);

    const closeBtn = alertDiv.querySelector("button");
    closeBtn.addEventListener("click", () => {
      alertDiv.classList.remove("show");
      alertDiv.classList.add("hide");
      alertDiv.addEventListener("animationend", () => {
        alertDiv.remove();

        if (alertContainer.children.length === 0) {
          alertContainer.style.pointerEvents = "none";
        }
      });
    });

    setTimeout(() => {
      alertDiv.classList.remove("show");
      alertDiv.classList.add("hide");
      alertDiv.addEventListener("animationend", () => {
        alertDiv.remove();

        if (alertContainer.children.length === 0) {
          alertContainer.style.pointerEvents = "none";
        }
      });
    }, 3000);
  } else {
    customAlertMessage.textContent = message;
    customAlertModal.classList.remove("hidden");
    const modalContent = customAlertModal.querySelector(".modal-content");
    modalContent.style.borderLeftColor =
      type === "success"
        ? "var(--primary-teal)"
        : type === "error"
        ? "var(--expense-color)"
        : "var(--secondary-text)";

    setTimeout(() => {
      customAlertModal.classList.add("hidden");
    }, 3000);
  }
}

function showCustomAlert(message, confirmCallback) {
  customAlertMessage.textContent = message;
  customAlertModal.classList.remove("hidden");
  const modalContent = customAlertModal.querySelector(".modal-content");
  modalContent.style.borderLeftColor = "var(--primary-teal)";

  const confirmBtn = document.createElement("button");
  confirmBtn.textContent = "Confirm";
  confirmBtn.className = "btn-danger mr-3";
  confirmBtn.onclick = () => {
    confirmCallback();
    hideModal(customAlertModal);
    customAlertCloseBtn.style.display = "block";
    confirmBtn.remove();
  };

  customAlertCloseBtn.style.display = "none";
  customAlertModal
    .querySelector(".modal-content")
    .insertBefore(confirmBtn, customAlertCloseBtn);
}

function showErrorMessage(element, message) {
  element.textContent = message;
  element.classList.remove("hidden");

  const input = element.previousElementSibling;
  if (input && input.classList.contains("input-field")) {
    input.classList.add("border-red-500");
  }
}

function hideErrorMessage(element) {
  element.classList.add("hidden");
  const input = element.previousElementSibling;
  if (input && input.classList.contains("input-field")) {
    input.classList.remove("border-red-500");
  }
}

document
  .querySelectorAll(".sidebar-nav-item, .mobile-nav-item")
  .forEach((button) => {
    button.addEventListener("click", (e) => {
      const tabName = e.currentTarget.dataset.tab;

      document
        .querySelectorAll(".sidebar-nav-item")
        .forEach((btn) => btn.classList.remove("active"));
      const desktopTabButton = document.querySelector(
        `.sidebar-nav-item[data-tab="${tabName}"]`
      );
      if (desktopTabButton) desktopTabButton.classList.add("active");

      document
        .querySelectorAll(".mobile-nav-item")
        .forEach((btn) => btn.classList.remove("active"));
      const mobileTabButton = document.querySelector(
        `.mobile-nav-item[data-tab="${tabName}"]`
      );
      if (mobileTabButton) mobileTabButton.classList.add("active");

      document
        .querySelectorAll(".tab-content")
        .forEach((content) => content.classList.add("hidden"));

      document.getElementById(`${tabName}Tab`).classList.remove("hidden");

      if (tabName === "wallets") {
        renderWallets();
      } else if (tabName === "settings") {
        renderUserProfile();
        populateCurrencyDropdown();
        renderRecycleBin();
      } else if (tabName === "dashboard") {
        renderTransactions(transactionSearchInput.value);
      }
    });
  });

addTransactionBtn.addEventListener("click", () => {
  if (wallets.length === 0) {
    showAlert(
      "Please create at least one wallet before adding transactions.",
      "error"
    );
    return;
  }
  transactionModalTitle.textContent = "Add New Transaction";
  transactionForm.reset();
  transactionDate.valueAsDate = new Date();
  populateWalletDropdown();
  hideErrorMessage(transactionAmountError);
  hideErrorMessage(transactionWalletError);
  hideErrorMessage(transactionCategoryError);
  hideErrorMessage(transactionDateError);
  showModal(transactionModal);
});

cancelTransactionBtn.addEventListener("click", () =>
  hideModal(transactionModal)
);

transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;

  if (
    parseFloat(transactionAmount.value) <= 0 ||
    isNaN(parseFloat(transactionAmount.value))
  ) {
    showErrorMessage(
      transactionAmountError,
      "Amount must be a positive number."
    );
    isValid = false;
  } else {
    hideErrorMessage(transactionAmountError);
  }
  if (!transactionWallet.value) {
    showErrorMessage(transactionWalletError, "Please select a wallet.");
    isValid = false;
  } else {
    hideErrorMessage(transactionWalletError);
  }
  if (!transactionCategory.value.trim()) {
    showErrorMessage(transactionCategoryError, "Category cannot be empty.");
    isValid = false;
  } else {
    hideErrorMessage(transactionCategoryError);
  }
  if (!transactionDate.value) {
    showErrorMessage(transactionDateError, "Date cannot be empty.");
    isValid = false;
  } else {
    hideErrorMessage(transactionDateError);
  }

  if (!isValid) return;

  addTransaction(
    transactionType.value,
    transactionAmount.value,
    transactionCategory.value.trim(),
    transactionDate.value,
    transactionWallet.value,
    transactionDescription.value.trim()
  );
  hideModal(transactionModal);
});

addWalletBtn.addEventListener("click", () => {
  walletModalTitle.textContent = "Add New Wallet";
  walletForm.reset();
  walletInitialBalance.value = "0.00";
  hideErrorMessage(walletNameError);
  hideErrorMessage(walletInitialBalanceError);
  showModal(walletModal);
});

cancelWalletBtn.addEventListener("click", () => hideModal(walletModal));

walletForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;
  if (!walletName.value.trim()) {
    showErrorMessage(walletNameError, "Wallet name cannot be empty.");
    isValid = false;
  } else {
    hideErrorMessage(walletNameError);
  }
  if (isNaN(parseFloat(walletInitialBalance.value))) {
    showErrorMessage(
      walletInitialBalanceError,
      "Initial balance must be a number."
    );
    isValid = false;
  } else {
    hideErrorMessage(walletInitialBalanceError);
  }

  if (!isValid) return;

  addWallet(walletName.value.trim(), walletInitialBalance.value);
  hideModal(walletModal);
});

viewWalletsBtn.addEventListener("click", () => {
  document.querySelector('.mobile-nav-item[data-tab="wallets"]').click();
});

transactionSearchInput.addEventListener("input", () => {
  renderTransactions(transactionSearchInput.value);
});

saveProfileBtn.addEventListener("click", saveUserProfile);

lightThemeBtn.addEventListener("click", () => applyTheme("light"));
darkThemeBtn.addEventListener("click", () => applyTheme("dark"));

saveCurrencyBtn.addEventListener("click", saveCurrencySetting);

clearRecycleBinBtn.addEventListener("click", permanentlyDeleteRecycleBin);

customAlertCloseBtn.addEventListener("click", () =>
  hideModal(customAlertModal)
);
closeWalletTransactionsBtn.addEventListener("click", () =>
  hideModal(viewWalletTransactionsModal)
);

openClearDataBtn.addEventListener("click", () => {
  clearDataForm.reset();
  hideErrorMessage(clearDataError);
  showModal(clearDataModal);
});

cancelClearDataBtn.addEventListener("click", () => hideModal(clearDataModal));

clearDataForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const confirmText = "DELETEMYDATA";
  if (
    clearDataConfirm1.value === confirmText &&
    clearDataConfirm2.value === confirmText
  ) {
    hideErrorMessage(clearDataError);
    // Clear all data from localStorage
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    // Show a success message and reload the page
    hideModal(clearDataModal);
    showAlert("All app data has been deleted.", "success");
    setTimeout(() => {
      location.reload();
    }, 1500);
  } else {
    showErrorMessage(
      clearDataError,
      `Please type "${confirmText}" in both fields to confirm.`
    );
  }
});

document.addEventListener("DOMContentLoaded", () => {
  splashScreen.classList.remove("hidden");
  appContent.classList.add("hidden");

  setTimeout(() => {
    splashScreen.classList.add("opacity-0");
    splashScreen.addEventListener(
      "transitionend",
      () => {
        splashScreen.classList.add("hidden");
        appContent.classList.remove("hidden");
        renderApp();
      },
      { once: true }
    );
  }, 1000); // Reduced splash screen time

  applyTheme(settings.theme);

  cleanupRecycleBin();
});

function renderApp() {
  appContent.classList.remove("hidden");

  document.querySelector('[data-tab="dashboard"]').click();
  renderTotalBalance();
  renderUserProfile();
}

document.addEventListener("focusin", (event) => {
  if (event.target.classList.contains("input-field")) {
    const errorElement = event.target.nextElementSibling;
    if (
      errorElement &&
      errorElement.classList.contains("input-error-message")
    ) {
      hideErrorMessage(errorElement);
    }
  }
});
