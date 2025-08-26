class SumXCalculator {
  constructor() {
    this.display = document.getElementById("display");
    this.history = document.getElementById("history");
    this.currentValue = "0";
    this.previousValue = "";
    this.operator = null;
    this.waitingForInput = false;
    this.lastOperation = null;
    this.init();
  }
  init() {
    this.setupEventListeners();
    this.setupModal();
    this.updateDisplay();
  }
  setupEventListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("key")) {
        this.handleButtonPress(e.target);
        this.addRippleEffect(e.target);
      }
    });
    document.addEventListener("keydown", (e) => {
      this.handleKeyPress(e);
    });
    document.addEventListener("contextmenu", (e) => {
      if (e.target.classList.contains("key")) {
        e.preventDefault();
      }
    });
    document.addEventListener("touchstart", (e) => {
      if (e.target.classList.contains("key")) {
        e.target.style.transform = "scale(0.95)";
      }
    });
    document.addEventListener("touchend", (e) => {
      if (e.target.classList.contains("key")) {
        setTimeout(() => {
          e.target.style.transform = "";
        }, 100);
      }
    });
  }
  setupModal() {
    const infoBtn = document.getElementById("info-btn");
    const modalOverlay = document.getElementById("modal-overlay");
    const closeBtn = document.getElementById("close-btn");
    const shareBtn = document.getElementById("share-btn");
    infoBtn.addEventListener("click", () => {
      modalOverlay.classList.add("active");
    });
    closeBtn.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
    });
    shareBtn.addEventListener("click", () => {
      this.handleShare();
    });
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
        modalOverlay.classList.remove("active");
      }
    });
  }
  handleButtonPress(button) {
    const { action, number } = button.dataset;
    if (number !== undefined) {
      this.inputNumber(number);
    } else if (action) {
      this.performAction(action);
    }
  }
  handleKeyPress(e) {
    const calculatorKeys = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "+",
      "-",
      "*",
      "/",
      "=",
      "Enter",
      ".",
      "%",
      "Escape",
      "Backspace",
      "Delete",
      "c",
      "C",
    ];
    if (calculatorKeys.includes(e.key)) {
      e.preventDefault();
    }
    if (/\d/.test(e.key)) {
      this.inputNumber(e.key);
    } else {
      switch (e.key) {
        case "+":
          this.performAction("add");
          break;
        case "-":
          this.performAction("subtract");
          break;
        case "*":
          this.performAction("multiply");
          break;
        case "/":
          this.performAction("divide");
          break;
        case "=":
        case "Enter":
          this.performAction("calculate");
          break;
        case ".":
          this.performAction("decimal");
          break;
        case "%":
          this.performAction("percent");
          break;
        case "c":
        case "C":
        case "Escape":
        case "Delete":
          this.performAction("clear");
          break;
        case "Backspace":
          this.backspace();
          break;
      }
    }
  }
  addRippleEffect(button) {
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "";
    }, 100);
  }
  inputNumber(num) {
    if (this.waitingForInput) {
      this.currentValue = num;
      this.waitingForInput = false;
    } else {
      if (this.currentValue === "0") {
        this.currentValue = num;
      } else {
        if (this.currentValue.length < 15) {
          this.currentValue += num;
        }
      }
    }
    this.updateDisplay();
  }
  performAction(action) {
    switch (action) {
      case "clear":
        this.clear();
        break;
      case "toggle-sign":
        this.toggleSign();
        break;
      case "percent":
        this.percent();
        break;
      case "decimal":
        this.inputDecimal();
        break;
      case "add":
      case "subtract":
      case "multiply":
      case "divide":
        this.inputOperator(action);
        break;
      case "calculate":
        this.calculate();
        break;
    }
  }
  clear() {
    this.currentValue = "0";
    this.previousValue = "";
    this.operator = null;
    this.waitingForInput = false;
    this.lastOperation = null;
    this.updateDisplay();
    this.updateHistory("");
    this.clearOperatorHighlight();
  }
  toggleSign() {
    if (this.currentValue !== "0") {
      this.currentValue = this.currentValue.startsWith("-")
        ? this.currentValue.slice(1)
        : "-" + this.currentValue;
      this.updateDisplay();
    }
  }
  percent() {
    const value = parseFloat(this.currentValue);
    this.currentValue = (value / 100).toString();
    this.updateDisplay();
  }
  inputDecimal() {
    if (this.waitingForInput) {
      this.currentValue = "0.";
      this.waitingForInput = false;
    } else if (this.currentValue.indexOf(".") === -1) {
      this.currentValue += ".";
    }
    this.updateDisplay();
  }
  inputOperator(nextOperator) {
    const inputValue = parseFloat(this.currentValue);
    if (this.previousValue === "") {
      this.previousValue = this.currentValue;
    } else if (this.operator && !this.waitingForInput) {
      const result = this.performCalculation();
      this.currentValue = result.toString();
      this.previousValue = this.currentValue;
      this.updateDisplay();
    }
    this.waitingForInput = true;
    this.operator = nextOperator;
    this.updateHistory(
      `${this.formatNumber(this.previousValue)} ${this.getOperatorSymbol(
        nextOperator
      )}`
    );
    this.highlightOperator(nextOperator);
  }
  calculate() {
    if (this.operator && this.previousValue !== "" && !this.waitingForInput) {
      const result = this.performCalculation();
      this.lastOperation = {
        operator: this.operator,
        operand: this.currentValue,
      };
      this.currentValue = result.toString();
      this.previousValue = "";
      this.operator = null;
      this.waitingForInput = true;
      this.updateDisplay();
      this.updateHistory("");
      this.clearOperatorHighlight();
    } else if (this.lastOperation && this.waitingForInput) {
      this.previousValue = this.currentValue;
      this.operator = this.lastOperation.operator;
      this.currentValue = this.lastOperation.operand;
      const result = this.performCalculation();
      this.currentValue = result.toString();
      this.updateDisplay();
    }
  }
  performCalculation() {
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
    let result;
    switch (this.operator) {
      case "add":
        result = prev + current;
        break;
      case "subtract":
        result = prev - current;
        break;
      case "multiply":
        result = prev * current;
        break;
      case "divide":
        if (current === 0) {
          this.showError("Cannot divide by zero");
          return 0;
        }
        result = prev / current;
        break;
      default:
        return current;
    }
    return Math.round(result * 1000000000000) / 1000000000000;
  }
  getOperatorSymbol(operator) {
    const symbols = {
      add: "+",
      subtract: "−",
      multiply: "×",
      divide: "÷",
    };
    return symbols[operator] || "";
  }
  highlightOperator(operator) {
    this.clearOperatorHighlight();
    const button = document.querySelector(`[data-action="${operator}"]`);
    if (button && button.classList.contains("operator")) {
      button.classList.add("active");
    }
  }
  clearOperatorHighlight() {
    document.querySelectorAll(".operator").forEach((btn) => {
      btn.classList.remove("active");
    });
  }
  updateDisplay() {
    this.display.textContent = this.formatNumber(this.currentValue);
  }
  updateHistory(text) {
    this.history.textContent = text;
  }
  formatNumber(num) {
    const number = parseFloat(num);
    if (isNaN(number)) return "0";
    if (
      Math.abs(number) > 999999999999 ||
      (Math.abs(number) < 0.000001 && number !== 0)
    ) {
      return number.toExponential(6);
    }
    const formatted = number.toLocaleString("en-US", {
      maximumFractionDigits: 10,
      useGrouping: false,
    });
    return formatted;
  }
  backspace() {
    if (this.currentValue.length > 1) {
      this.currentValue = this.currentValue.slice(0, -1);
    } else {
      this.currentValue = "0";
    }
    this.updateDisplay();
  }
  async handleShare() {
    const shareData = {
      title: "SumX Calculator",
      text: "Check out this awesome iPhone-style calculator app built with JavaScript!",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("✅ SumX shared successfully");
      } else {
        this.fallbackShare(shareData);
      }
    } catch (error) {
      console.log("❌ Error sharing:", error);
      this.fallbackShare(shareData);
    }
  }
  fallbackShare(shareData) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareData.url)
        .then(() => {
          this.showShareNotification("Link copied to clipboard!");
        })
        .catch(() => {
          this.showShareNotification("Share: " + shareData.url);
        });
    } else {
      alert(`${shareData.title}\n${shareData.text}\n\n${shareData.url}`);
    }
  }
  showShareNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--btn-operator);
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(255, 149, 0, 0.3);
      z-index: 10000;
      animation: slideInDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = "slideOutUp 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  showError(message) {
    this.display.textContent = "Error";
    setTimeout(() => {
      this.clear();
    }, 2000);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new SumXCalculator();
  console.log("🧮 SumX Calculator v1.0.0 - Ready!");
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        console.log("📱 SumX SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("❌ SumX SW registration failed: ", registrationError);
      });
  });
}
