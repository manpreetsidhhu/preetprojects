class Calculator {
  constructor() {
    this.display = document.getElementById("display");
    this.history = document.getElementById("history");
    this.currentInput = "0";
    this.previousInput = "";
    this.operator = null;
    this.waitingForOperand = false;
    this.lastOperator = null;
    this.lastOperand = null;

    this.init();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  init() {
    document.addEventListener("click", (e) => {
      if (e.target.matches("button")) {
        const button = e.target;
        this.addPressEffect(button);

        if (button.dataset.number !== undefined) {
          this.inputNumber(button.dataset.number);
        } else if (button.dataset.action) {
          this.performAction(button.dataset.action);
        }
      }
    });

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      this.handleKeyPress(e);
    });
  }

  addPressEffect(button) {
    button.classList.add("pressed");
    setTimeout(() => button.classList.remove("pressed"), 100);
  }

  updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
    document.getElementById("current-time").textContent = timeString;
  }

  inputNumber(num) {
    if (this.waitingForOperand) {
      this.currentInput = num;
      this.waitingForOperand = false;
    } else {
      this.currentInput =
        this.currentInput === "0" ? num : this.currentInput + num;
    }
    this.updateDisplay();
  }

  performAction(action) {
    const prev = parseFloat(this.previousInput);
    const current = parseFloat(this.currentInput);

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
    this.currentInput = "0";
    this.previousInput = "";
    this.operator = null;
    this.waitingForOperand = false;
    this.lastOperator = null;
    this.lastOperand = null;
    this.updateDisplay();
    this.updateHistory("");
    this.clearOperatorHighlight();
  }

  toggleSign() {
    if (this.currentInput !== "0") {
      this.currentInput =
        this.currentInput.charAt(0) === "-"
          ? this.currentInput.slice(1)
          : "-" + this.currentInput;
      this.updateDisplay();
    }
  }

  percent() {
    this.currentInput = (parseFloat(this.currentInput) / 100).toString();
    this.updateDisplay();
  }

  inputDecimal() {
    if (this.waitingForOperand) {
      this.currentInput = "0.";
      this.waitingForOperand = false;
    } else if (this.currentInput.indexOf(".") === -1) {
      this.currentInput += ".";
    }
    this.updateDisplay();
  }

  inputOperator(nextOperator) {
    const inputValue = parseFloat(this.currentInput);

    if (this.previousInput === "") {
      this.previousInput = this.currentInput;
    } else if (this.operator) {
      const result = this.performCalculation();
      this.currentInput = String(result);
      this.previousInput = this.currentInput;
      this.updateDisplay();
    }

    this.waitingForOperand = true;
    this.operator = nextOperator;
    this.updateHistory(
      `${this.previousInput} ${this.getOperatorSymbol(nextOperator)}`
    );
    this.highlightOperator(nextOperator);
  }

  calculate() {
    if (this.operator && this.previousInput !== "") {
      const result = this.performCalculation();
      this.lastOperator = this.operator;
      this.lastOperand = this.currentInput;

      this.currentInput = String(result);
      this.previousInput = "";
      this.operator = null;
      this.waitingForOperand = true;

      this.updateDisplay();
      this.updateHistory("");
      this.clearOperatorHighlight();
    } else if (this.lastOperator && this.lastOperand) {
      // Repeat last operation
      this.previousInput = this.currentInput;
      this.currentInput = this.lastOperand;
      this.operator = this.lastOperator;

      const result = this.performCalculation();
      this.currentInput = String(result);
      this.previousInput = "";
      this.operator = null;
      this.waitingForOperand = true;

      this.updateDisplay();
      this.updateHistory("");
    }
  }

  performCalculation() {
    const prev = parseFloat(this.previousInput);
    const current = parseFloat(this.currentInput);
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
        result = current !== 0 ? prev / current : 0;
        break;
      default:
        return current;
    }

    return Math.round(result * 100000000) / 100000000; // Avoid floating point errors
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
    if (button) {
      button.classList.add("active");
    }
  }

  clearOperatorHighlight() {
    document.querySelectorAll(".operator").forEach((btn) => {
      btn.classList.remove("active");
    });
  }

  updateDisplay() {
    const value = this.currentInput;
    this.display.textContent = this.formatNumber(value);
  }

  updateHistory(text) {
    this.history.textContent = text;
  }

  formatNumber(num) {
    const number = parseFloat(num);
    if (isNaN(number)) return "0";

    // Handle very large numbers
    if (Math.abs(number) > 999999999) {
      return number.toExponential(3);
    }

    // Format with commas for large numbers
    return number.toLocaleString("en-US", {
      maximumFractionDigits: 8,
      useGrouping: true,
    });
  }

  handleKeyPress(e) {
    const key = e.key;

    // Prevent default for calculator keys
    if (
      /[\d\+\-\*\/\=\.\%]/.test(key) ||
      key === "Enter" ||
      key === "Escape" ||
      key === "Backspace"
    ) {
      e.preventDefault();
    }

    if (/\d/.test(key)) {
      this.inputNumber(key);
    } else {
      switch (key) {
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
        case "Escape":
        case "c":
        case "C":
          this.performAction("clear");
          break;
        case "Backspace":
          this.backspace();
          break;
      }
    }
  }

  backspace() {
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = "0";
    }
    this.updateDisplay();
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Calculator();
});
