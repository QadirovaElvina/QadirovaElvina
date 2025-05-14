document.addEventListener("DOMContentLoaded", () => {
  // Данные обменных курсов
  const exchangeRates = {
    USD: { RUB: 92.5, EUR: 0.92, GBP: 0.79, JPY: 150.2, CNY: 7.24, AZN: 1.7, UAH: 39.5 },
    EUR: { USD: 1.09, RUB: 100.8, GBP: 0.86, JPY: 163.5, CNY: 7.88, AZN: 1.85, UAH: 43.2 },
    RUB: { USD: 0.0108, EUR: 0.0099, GBP: 0.0085, JPY: 1.62, CNY: 0.078, AZN: 0.0184, UAH: 0.427 },
    GBP: { USD: 1.27, EUR: 1.16, RUB: 117.2, JPY: 190.1, CNY: 9.17, AZN: 2.16, UAH: 50.3 },
    JPY: { USD: 0.0067, EUR: 0.0061, RUB: 0.617, GBP: 0.0053, CNY: 0.048, AZN: 0.0114, UAH: 0.264 },
    CNY: { USD: 0.138, EUR: 0.127, RUB: 12.8, GBP: 0.109, JPY: 20.75, AZN: 0.235, UAH: 5.46 },
    AZN: { USD: 0.588, EUR: 0.54, RUB: 54.4, GBP: 0.463, JPY: 88.35, CNY: 4.26, UAH: 23.2 },
    UAH: { USD: 0.0253, EUR: 0.0232, RUB: 2.34, GBP: 0.0199, JPY: 3.79, CNY: 0.183, AZN: 0.0431 },
  }

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    RUB: "₽",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    AZN: "₼",
    UAH: "₴",
  }

  // Данные о флагах валют
  const flagUrls = {
    USD: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1920px-Flag_of_the_United_States.svg.png",
    EUR: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/500px-Flag_of_Europe.svg.png",
    RUB: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Russia.svg/500px-Flag_of_Russia.svg.png",
    GBP: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Flag_of_the_United_Kingdom.svg/500px-Flag_of_the_United_Kingdom.svg.png",
    JPY: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/500px-Flag_of_Japan.svg.png",
    CNY: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/500px-Flag_of_the_People%27s_Republic_of_China.svg.png",
    AZN: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Flag_of_Azerbaijan.svg/1200px-Flag_of_Azerbaijan.svg.png",
    UAH: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/500px-Flag_of_Ukraine.svg.png",
  }

  // Создаем CSS для флагов
  createFlagStyles();

  // Элементы DOM
  const fromCurrencySelect = document.getElementById("fromCurrency")
  const toCurrencySelect = document.getElementById("toCurrency")
  const amountInput = document.getElementById("amount")
  const resultInput = document.getElementById("result")
  const swapButton = document.getElementById("swapButton")
  const rateValueElement = document.getElementById("rateValue")
  const fromFlagElement = document.getElementById("fromFlag")
  const toFlagElement = document.getElementById("toFlag")
  const fromCurrencyCodeElement = document.getElementById("fromCurrencyCode")
  const toCurrencyCodeElement = document.getElementById("toCurrencyCode")
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  // Функция для создания стилей флагов
  function createFlagStyles() {
    const styleElement = document.createElement("style");
    let styleContent = "";
    
    // Базовый стиль для всех флагов
    styleContent += `
      .currency-flag {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin-right: 8px;
      }
    `;
    
    // Добавляем стили для каждого флага
    for (const [currency, url] of Object.entries(flagUrls)) {
      styleContent += `
        .flag-${currency.toLowerCase()} {
          background-image: url('${url}');
        }
      `;
    }
    
    styleElement.textContent = styleContent;
    document.head.appendChild(styleElement);
  }

  // Функция конвертации валюты
  function convertCurrency() {
    const fromCurrency = fromCurrencySelect.value
    const toCurrency = toCurrencySelect.value
    const amount = Number.parseFloat(amountInput.value) || 0

    if (fromCurrency === toCurrency) {
      resultInput.value = formatNumber(amount)
      return
    }

    const rate = exchangeRates[fromCurrency][toCurrency]
    const result = amount * rate
    resultInput.value = formatNumber(result)

    // Обновляем отображение курса
    rateValueElement.textContent = `${rate.toFixed(4)} ${currencySymbols[toCurrency]}`
  }

  // Функция для обмена валют местами
  function swapCurrencies() {
    const fromCurrency = fromCurrencySelect.value
    const toCurrency = toCurrencySelect.value

    fromCurrencySelect.value = toCurrency
    toCurrencySelect.value = fromCurrency

    updateFlags()
    convertCurrency()
  }

  // Функция обновления флагов
  function updateFlags() {
    const fromCurrency = fromCurrencySelect.value
    const toCurrency = toCurrencySelect.value

    // Удаляем все классы флагов
    fromFlagElement.className = "currency-flag"
    toFlagElement.className = "currency-flag"

    // Добавляем соответствующие классы флагов
    fromFlagElement.classList.add(`flag-${fromCurrency.toLowerCase()}`)
    toFlagElement.classList.add(`flag-${toCurrency.toLowerCase()}`)

    fromCurrencyCodeElement.textContent = fromCurrency
    toCurrencyCodeElement.textContent = toCurrency
    
    // Обновляем все флаги в таблице курсов и боковой панели
    updateAllFlags();
  }
  
  // Обновляем все флаги на странице
  function updateAllFlags() {
    // Обновляем флаги в таблице курсов
    document.querySelectorAll('.currency-info .currency-flag').forEach(flagElement => {
      const currencyCode = flagElement.closest('.currency-info').querySelector('.currency-code').textContent;
      updateFlagElement(flagElement, currencyCode);
    });
    
    // Обновляем флаги в боковой панели
    document.querySelectorAll('.currency-with-flag .currency-flag').forEach(flagElement => {
      const currencyCode = flagElement.nextElementSibling?.textContent || 
                           flagElement.previousElementSibling?.textContent;
      if (currencyCode && currencyCode.length <= 3) {
        updateFlagElement(flagElement, currencyCode);
      }
    });
  }
  
  // Обновляем отдельный элемент флага
  function updateFlagElement(element, currencyCode) {
    if (!currencyCode) return;
    
    // Удаляем все классы флагов
    element.className = "currency-flag";
    
    // Добавляем соответствующий класс флага
    const code = currencyCode.trim();
    element.classList.add(`flag-${code.toLowerCase()}`);
  }

  // Форматирование числа с разделителями тысяч
  function formatNumber(num) {
    return num.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Переключение вкладок
  function switchTab(tabId) {
    tabButtons.forEach((button) => {
      button.classList.remove("active")
      if (button.dataset.tab === tabId) {
        button.classList.add("active")
      }
    })

    tabContents.forEach((content) => {
      content.classList.remove("active")
      if (content.id === tabId) {
        content.classList.add("active")
      }
    })
  }

  // Обработчики событий
  fromCurrencySelect.addEventListener("change", () => {
    updateFlags()
    convertCurrency()
  })

  toCurrencySelect.addEventListener("change", () => {
    updateFlags()
    convertCurrency()
  })

  amountInput.addEventListener("input", convertCurrency)
  swapButton.addEventListener("click", swapCurrencies)

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.tab)
    })
  })

  

  // Инициализация
  convertCurrency()
  updateFlags()
})
