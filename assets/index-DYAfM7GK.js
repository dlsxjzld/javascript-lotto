var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _numbers, _lottoList, _LottoMachine_instances, makeLotto_fn, _bonusNumber, _lotto, _winningLotto, _lottoList2, _LottoManager_instances, checkCondition_fn, _state, _eventHandler, _App_instances, initializePurchaseAmount_fn, initializeWinningNumbers_fn, initializeBonusNumber_fn, initializeRetry_fn, submitEventHandler_fn, clickEventHandler_fn, keyEventHandler_fn, setEventHandlers_fn, removeEventHandlers_fn, initializeWebInput_fn, purchaseLottosByWeb_fn, purchaseWinningLottoByWeb_fn, closeWinningStatisticsModal_fn, retryRunWeb_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const readline = {};
function readLineAsync(query) {
  return new Promise((resolve, reject) => {
    if (arguments.length !== 1) {
      reject(new Error("arguments must be 1"));
    }
    if (typeof query !== "string") {
      reject(new Error("query must be string"));
    }
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(query, (input) => {
      rl.close();
      resolve(input);
    });
  });
}
const INPUT_MESSAGE = {
  PURCHASE_AMOUNT: "> 구입금액을 입력해 주세요.",
  WINNING_NUMBERS: "> 당첨 번호를 입력해 주세요. ",
  BONUS_NUMBER: "> 보너스 번호를 입력해 주세요. ",
  RETRY: "> 다시 시작하시겠습니까? (y/n) "
};
const getPurchaseAmountInput = () => {
  return readLineAsync(INPUT_MESSAGE.PURCHASE_AMOUNT);
};
const getWinningNumbersInput = () => {
  return readLineAsync(INPUT_MESSAGE.WINNING_NUMBERS);
};
const getBonusNumberInput = () => {
  return readLineAsync(INPUT_MESSAGE.BONUS_NUMBER);
};
const getRetryInput = () => {
  return readLineAsync(INPUT_MESSAGE.RETRY);
};
const readUserInputUntilSuccess = async ({
  readUserInput,
  formatter,
  onError
}) => {
  try {
    const input = await readUserInput();
    return formatter(input);
  } catch (error) {
    onError(error);
    return await readUserInputUntilSuccess({
      readUserInput,
      formatter,
      onError
    });
  }
};
const convertFormat = {
  splitByComma: (input) => input.split(","),
  toNumber: (input) => Number(input)
};
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _numbers);
    __privateSet(this, _numbers, numbers);
  }
  getNumbers() {
    return [...__privateGet(this, _numbers)];
  }
  has(number) {
    return __privateGet(this, _numbers).includes(number);
  }
  match(targetLotto) {
    return __privateGet(this, _numbers).filter((number) => targetLotto.has(number)).length;
  }
}
_numbers = new WeakMap();
const LOTTO_DEFINITION = {
  PRICE_UNIT: 1e3,
  NUMBER_COUNTS: 6,
  MIN_NUMBER: 1,
  MAX_NUMBER: 45,
  MIN_PRICE: 1e3,
  MAX_PRICE: 1e5
};
const LOTTO_PRIZE_DEFINITION = {
  FIRST_PRIZE: "FIRST_PRIZE",
  SECOND_PRIZE: "SECOND_PRIZE",
  THIRD_PRIZE: "THIRD_PRIZE",
  FOURTH_PRIZE: "FOURTH_PRIZE",
  FIFTH_PRIZE: "FIFTH_PRIZE",
  NONE: "NONE"
};
const LOTTO_PRIZE_MONEY_DEFINITION = {
  FIRST_PRIZE: 2e9,
  SECOND_PRIZE: 3e7,
  THIRD_PRIZE: 15e5,
  FOURTH_PRIZE: 5e4,
  FIFTH_PRIZE: 5e3,
  NONE: 0
};
const ASCENDING = (a, b) => a - b;
const sorts = (how) => (array) => array.sort(how);
const sortAscending = sorts(ASCENDING);
const getRandomNumber = (min, max) => {
  return Math.ceil(Math.random() * (max - min) + min);
};
const makeNotDuplicatedRandomNumbers = (counts, range) => {
  const numbers = /* @__PURE__ */ new Set();
  while (numbers.size !== counts) {
    const randomNumber = getRandomNumber(range.min, range.max);
    numbers.add(randomNumber);
  }
  return Array.from(numbers);
};
class LottoMachine {
  constructor() {
    __privateAdd(this, _LottoMachine_instances);
    __privateAdd(this, _lottoList);
  }
  purchaseLotto(money) {
    return Math.floor(money / LOTTO_DEFINITION.PRICE_UNIT);
  }
  makeLottoList(lottoCount) {
    __privateSet(this, _lottoList, Array.from(
      { length: lottoCount },
      () => __privateMethod(this, _LottoMachine_instances, makeLotto_fn).call(this)
    ));
  }
  getLottoList() {
    return [...__privateGet(this, _lottoList)];
  }
  getLottoNumbersList() {
    return __privateGet(this, _lottoList).map((lotto) => lotto.getNumbers());
  }
}
_lottoList = new WeakMap();
_LottoMachine_instances = new WeakSet();
makeLotto_fn = function() {
  const numbers = makeNotDuplicatedRandomNumbers(
    LOTTO_DEFINITION.NUMBER_COUNTS,
    {
      min: LOTTO_DEFINITION.MIN_NUMBER,
      max: LOTTO_DEFINITION.MAX_NUMBER
    }
  );
  return new Lotto(sortAscending(numbers));
};
class WinningLotto {
  constructor(lotto, bonusNumber) {
    __privateAdd(this, _bonusNumber);
    __privateAdd(this, _lotto);
    __privateSet(this, _lotto, lotto);
    __privateSet(this, _bonusNumber, bonusNumber);
  }
  getNumbers() {
    return [...__privateGet(this, _lotto).getNumbers()];
  }
  getBonusNumber() {
    return __privateGet(this, _bonusNumber);
  }
  countMatchingNumbers(lotto) {
    return __privateGet(this, _lotto).match(lotto);
  }
  checkBonusNumber(lotto) {
    return lotto.getNumbers().includes(__privateGet(this, _bonusNumber));
  }
}
_bonusNumber = new WeakMap();
_lotto = new WeakMap();
class LottoManager {
  constructor(winningLotto, lottoList) {
    __privateAdd(this, _LottoManager_instances);
    __privateAdd(this, _winningLotto);
    __privateAdd(this, _lottoList2);
    __privateSet(this, _winningLotto, winningLotto);
    __privateSet(this, _lottoList2, lottoList);
  }
  compareWinningLotto() {
    return __privateGet(this, _lottoList2).reduce(
      (lottoResult, lotto) => {
        const matchingCount = __privateGet(this, _winningLotto).countMatchingNumbers(lotto);
        const hasBonusNumber = __privateGet(this, _winningLotto).checkBonusNumber(lotto);
        const rank = __privateMethod(this, _LottoManager_instances, checkCondition_fn).call(this, hasBonusNumber, matchingCount);
        lottoResult[rank] += 1;
        return lottoResult;
      },
      {
        FIRST_PRIZE: 0,
        SECOND_PRIZE: 0,
        THIRD_PRIZE: 0,
        FOURTH_PRIZE: 0,
        FIFTH_PRIZE: 0,
        NONE: 0
      }
    );
  }
  calculatePrize(result) {
    return Object.entries(result).reduce(
      (acc, [key, count]) => acc + LOTTO_PRIZE_MONEY_DEFINITION[key] * count,
      0
    );
  }
  calculateProfit(totalLottoPrize) {
    return totalLottoPrize / (LOTTO_DEFINITION.PRICE_UNIT * __privateGet(this, _lottoList2).length) * 100;
  }
}
_winningLotto = new WeakMap();
_lottoList2 = new WeakMap();
_LottoManager_instances = new WeakSet();
checkCondition_fn = function(hasBonusNumber, counts) {
  if (counts === 6) {
    return LOTTO_PRIZE_DEFINITION.FIRST_PRIZE;
  } else if (counts === 5 && hasBonusNumber) {
    return LOTTO_PRIZE_DEFINITION.SECOND_PRIZE;
  } else if (counts === 5 && !hasBonusNumber) {
    return LOTTO_PRIZE_DEFINITION.THIRD_PRIZE;
  } else if (counts === 4) {
    return LOTTO_PRIZE_DEFINITION.FOURTH_PRIZE;
  } else if (counts === 3) {
    return LOTTO_PRIZE_DEFINITION.FIFTH_PRIZE;
  } else {
    return LOTTO_PRIZE_DEFINITION.NONE;
  }
};
const NEW_LINE = "\n";
const EMPTY_LINE = "";
const outputView = {
  printLottoCount(lottoCounts) {
    console.log(`${lottoCounts}개를 구매했습니다.`);
  },
  printLottoList(lottoNumbersList) {
    lottoNumbersList.forEach((lottoNumbers) => {
      console.log(`[${lottoNumbers.join(", ")}]`);
    });
    console.log(EMPTY_LINE);
  },
  printLottoResultInstruction() {
    console.log(EMPTY_LINE);
    console.log("당첨 통계");
    console.log("--------------------");
  },
  printLottoResult(lottoResult) {
    const message = {
      FIRST_PRIZE: `6개 일치 (${LOTTO_PRIZE_MONEY_DEFINITION.FIRST_PRIZE.toLocaleString()}원) - ${lottoResult.FIRST_PRIZE}개`,
      SECOND_PRIZE: `5개 일치, 보너스 볼 일치 (${LOTTO_PRIZE_MONEY_DEFINITION.SECOND_PRIZE.toLocaleString()}원) - ${lottoResult.SECOND_PRIZE}개`,
      THIRD_PRIZE: `5개 일치 (${LOTTO_PRIZE_MONEY_DEFINITION.THIRD_PRIZE.toLocaleString()}원) - ${lottoResult.THIRD_PRIZE}개`,
      FOURTH_PRIZE: `4개 일치 (${LOTTO_PRIZE_MONEY_DEFINITION.FOURTH_PRIZE.toLocaleString()}원) - ${lottoResult.FOURTH_PRIZE}개`,
      FIFTH_PRIZE: `3개 일치 (${LOTTO_PRIZE_MONEY_DEFINITION.FIFTH_PRIZE.toLocaleString()}원) - ${lottoResult.FIFTH_PRIZE}개`
    };
    const keys = [
      "FIFTH_PRIZE",
      "FOURTH_PRIZE",
      "THIRD_PRIZE",
      "SECOND_PRIZE",
      "FIRST_PRIZE"
    ];
    keys.forEach((key) => {
      console.log(message[key]);
    });
    console.log(EMPTY_LINE);
  },
  printProfit(profit) {
    console.log(
      `총 수익률은 ${Number(profit.toFixed(1)).toLocaleString()}%입니다.`
    );
    console.log(EMPTY_LINE);
  },
  printErrorMessage(error) {
    console.error(error.message);
  }
};
const ERROR_PREFIX = "[ERROR]";
const COMMON_ERROR_MESSAGE = {
  NO_EMPTY_SPACE: `${ERROR_PREFIX} 공백이나 빈 문자열이 포함될 수 없습니다.${NEW_LINE}`,
  NOT_INTEGER: `${ERROR_PREFIX} 정수가 아닙니다.${NEW_LINE}`
};
const LOTTO_PURCHASE_AMOUNT = {
  INVALID_PURCHASE_UNIT: `${ERROR_PREFIX} 로또 구입 금액은 ${LOTTO_DEFINITION.PRICE_UNIT}원 단위의 정수여야 합니다.${NEW_LINE}`,
  INVALID_PURCHASE_RANGE: `${ERROR_PREFIX} 로또 구입 금액은 1회 ${LOTTO_DEFINITION.MIN_PRICE}원 이상 ${LOTTO_DEFINITION.MAX_PRICE}원 이하만 가능합니다.${NEW_LINE}`
};
const LOTTO_WINNING_NUMBERS = {
  INVALID_LOTTO_NUMBERS: `${ERROR_PREFIX} 당첨 번호 입력값에 공백이나 빈 문자열이 포함될 수 없습니다.${NEW_LINE}`,
  INVALID_LOTTO_COUNT: `${ERROR_PREFIX} 당첨 번호는 ${LOTTO_DEFINITION.NUMBER_COUNTS}개여야 합니다.${NEW_LINE}`,
  INVALID_LOTTO_RANGE: `${ERROR_PREFIX} 당첨 번호는 ${LOTTO_DEFINITION.MIN_NUMBER} 이상 ${LOTTO_DEFINITION.MAX_NUMBER} 이하의 정수여야 합니다.${NEW_LINE}`,
  DUPLICATE_LOTTO_NUMBERS: `${ERROR_PREFIX} 당첨 번호는 중복될 수 없습니다.${NEW_LINE}`
};
const LOTTO_BONUS_NUMBER = {
  INVALID_BONUS_RANGE: `${ERROR_PREFIX} 보너스 번호는 ${LOTTO_DEFINITION.MIN_NUMBER} 이상 ${LOTTO_DEFINITION.MAX_NUMBER} 이하의 정수여야 합니다.${NEW_LINE}`,
  DUPLICATE_BONUS_NUMBER: `${ERROR_PREFIX} 보너스 번호는 당첨 번호와 중복될 수 없습니다.${NEW_LINE}`
};
const RETRY_MESSAGE = `${ERROR_PREFIX} 'y' 또는 'n'가 아닙니다.${NEW_LINE}`;
const hasEmptySpace = (input) => {
  return input.includes(" ") || input.trim() === "";
};
const isInteger = (input) => {
  return Number.isInteger(input);
};
const hasEmptySpaceInArray = (input) => {
  return input.some((input2) => hasEmptySpace(input2));
};
const validateInteger = (input) => {
  if (isInteger(input) === false) {
    throw new Error(`${COMMON_ERROR_MESSAGE.NOT_INTEGER}`);
  }
};
const validateEmptySpace = (input) => {
  if (hasEmptySpace(input)) {
    throw new Error(`${COMMON_ERROR_MESSAGE.NO_EMPTY_SPACE}`);
  }
};
const isInvalidPurchaseAmountUnit = (input) => {
  return input % 1e3 !== 0;
};
const isInvalidPurchaseAmountRange = (input) => {
  return input < 1e3 || input > 1e5;
};
const validatePurchaseAmountUnit = (input) => {
  if (isInvalidPurchaseAmountUnit(input)) {
    throw new Error(LOTTO_PURCHASE_AMOUNT.INVALID_PURCHASE_UNIT);
  }
};
const validatePurchaseAmountRange = (input) => {
  if (isInvalidPurchaseAmountRange(input)) {
    throw new Error(LOTTO_PURCHASE_AMOUNT.INVALID_PURCHASE_RANGE);
  }
};
const validatePurchaseAmount = (input) => {
  validateInteger(input);
  validatePurchaseAmountUnit(input);
  validatePurchaseAmountRange(input);
};
const hasWrongLottoNumberRange = (input) => {
  return input < LOTTO_DEFINITION.MIN_NUMBER || input > LOTTO_DEFINITION.MAX_NUMBER;
};
const hasWrongLength = (input) => {
  return LOTTO_DEFINITION.NUMBER_COUNTS !== input.length;
};
const hasDuplicate = (input) => {
  return input.length !== new Set(input).size;
};
const validateWrongWinningNumbersLength = (input) => {
  if (hasWrongLength(input)) {
    throw new Error(LOTTO_WINNING_NUMBERS.INVALID_LOTTO_COUNT);
  }
};
const validateDuplicateWinningNumbers = (input) => {
  if (hasDuplicate(input)) {
    throw new Error(LOTTO_WINNING_NUMBERS.DUPLICATE_LOTTO_NUMBERS);
  }
};
const validateWinningNumbersRange = (input) => {
  if (input.some((number) => hasWrongLottoNumberRange(number))) {
    throw new Error(LOTTO_WINNING_NUMBERS.INVALID_LOTTO_RANGE);
  }
};
const validateWinningNumbersInteger = (input) => {
  if (input.some((number) => isInteger(number) === false)) {
    throw new Error(COMMON_ERROR_MESSAGE.NOT_INTEGER);
  }
};
const validateEmptySpaceInWinningNumbers = (input) => {
  if (hasEmptySpaceInArray(input)) {
    throw new Error(LOTTO_WINNING_NUMBERS.INVALID_LOTTO_NUMBERS);
  }
};
const validateWinningNumbers = (input) => {
  validateWrongWinningNumbersLength(input);
  validateDuplicateWinningNumbers(input);
  validateWinningNumbersRange(input);
  validateWinningNumbersInteger(input);
};
const hasDuplicateBonusNumber = (input, winningNumbersInput) => {
  return winningNumbersInput.includes(input);
};
const validateBonusNumberRange = (input) => {
  if (hasWrongLottoNumberRange(input)) {
    throw new Error(LOTTO_BONUS_NUMBER.INVALID_BONUS_RANGE);
  }
};
const validateWinningNumberHasBonusNumber = (input, winningNumbersInput) => {
  if (hasDuplicateBonusNumber(input, winningNumbersInput)) {
    throw new Error(LOTTO_BONUS_NUMBER.DUPLICATE_BONUS_NUMBER);
  }
};
const validateBonusNumber = (input, winningNumbersInput) => {
  validateInteger(input);
  validateBonusNumberRange(input);
  validateWinningNumberHasBonusNumber(input, winningNumbersInput);
};
const isYorN = (input) => {
  return input === "y" || input === "n";
};
const validateYorN = (input) => {
  if (isYorN(input) === false) {
    throw new Error(RETRY_MESSAGE);
  }
};
const outputViewByWeb = {
  displayErrorMessage(error) {
    alert(error.message);
  }
};
const createElementWithAttributes = ({
  tag,
  id = "",
  className = "",
  attributes = {},
  textContent = "",
  children = []
} = {}) => {
  const element = document.createElement(tag);
  if (id) {
    element.setAttribute("id", id);
  }
  if (className) {
    element.classList.add(...className.split(" "));
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  if (textContent) {
    element.textContent = textContent;
  }
  if (Array.isArray(children) && children.length) {
    const fragment = new DocumentFragment();
    children.forEach(
      (child) => fragment.append(createElementWithAttributes(child))
    );
    element.append(fragment);
  }
  return element;
};
const createWinningNumbersInputs = () => {
  return {
    tag: "div",
    className: "winning-numbers-container",
    children: [
      {
        tag: "label",
        attributes: { for: "lottoNumber1" },
        textContent: "당첨 번호"
      },
      {
        tag: "div",
        className: "winning-numbers-input-container",
        children: Array.from({ length: 6 }, (_, i) => ({
          tag: "input",
          className: "winning-numbers-input",
          id: `lottoNumber${i + 1}`,
          attributes: {
            name: "winningNumber",
            required: true,
            minLength: 1,
            maxLength: 2
          }
        }))
      }
    ]
  };
};
const createBonusNumberInput = () => {
  return {
    tag: "div",
    className: "bonus-number-container",
    children: [
      {
        tag: "label",
        className: "bonus-number-label",
        attributes: { for: "bonusNumber" },
        textContent: "보너스 번호"
      },
      {
        tag: "div",
        className: "bonus-number-input-container",
        children: [
          {
            tag: "input",
            className: "bonus-number-input",
            attributes: {
              id: "bonusNumber",
              name: "bonusNumber",
              required: true,
              minLength: 1,
              maxLength: 2
            }
          }
        ]
      }
    ]
  };
};
const createWinningLottoForm = () => {
  return createElementWithAttributes({
    tag: "form",
    id: "winningLottoForm",
    className: "winning-lotto-form",
    children: [
      {
        tag: "h3",
        className: "winning-lotto-form-instruction",
        textContent: "지난 주 당첨번호 6개와 보너스 번호 1개를 입력해주세요."
      },
      {
        tag: "div",
        className: "winning-lotto-container",
        children: [createWinningNumbersInputs(), createBonusNumberInput()]
      },
      {
        tag: "button",
        className: "lotto-result-check-button",
        textContent: "결과 확인하기"
      }
    ]
  });
};
const createDisplayLottoCount = (lottoCounts) => {
  return {
    tag: "p",
    className: "lotto-count-display",
    textContent: `총 ${lottoCounts}개를 구매했습니다.`
  };
};
const createLottoNumbersList = (lottoNumbersList) => {
  return {
    tag: "ul",
    children: lottoNumbersList.map((lottoNumbers) => ({
      tag: "li",
      className: "lotto",
      children: [
        { tag: "span", className: "lotto-ticket", textContent: "🎟️" },
        {
          tag: "span",
          className: "lotto-numbers",
          textContent: `${lottoNumbers.join(", ")}`
        }
      ]
    }))
  };
};
const createLottoListDisplay = (lottoCounts, lottoNumbersList) => {
  const article = createElementWithAttributes({
    tag: "article",
    id: "lottoListDisplay",
    className: "lotto-list-display",
    children: [
      createDisplayLottoCount(lottoCounts),
      createLottoNumbersList(lottoNumbersList)
    ]
  });
  return article;
};
const createLottoResultList = (lottoResult) => {
  const message = {
    FIRST_PRIZE: [
      "6개",
      LOTTO_PRIZE_MONEY_DEFINITION.FIRST_PRIZE.toLocaleString(),
      `${lottoResult.FIRST_PRIZE}개`
    ],
    SECOND_PRIZE: [
      "5개+보너스 볼",
      LOTTO_PRIZE_MONEY_DEFINITION.SECOND_PRIZE.toLocaleString(),
      `${lottoResult.SECOND_PRIZE}개`
    ],
    THIRD_PRIZE: [
      "5개",
      LOTTO_PRIZE_MONEY_DEFINITION.THIRD_PRIZE.toLocaleString(),
      `${lottoResult.THIRD_PRIZE}개`
    ],
    FOURTH_PRIZE: [
      "4개",
      LOTTO_PRIZE_MONEY_DEFINITION.FOURTH_PRIZE.toLocaleString(),
      `${lottoResult.FOURTH_PRIZE}개`
    ],
    FIFTH_PRIZE: [
      "3개",
      LOTTO_PRIZE_MONEY_DEFINITION.FIFTH_PRIZE.toLocaleString(),
      `${lottoResult.FIFTH_PRIZE}개`
    ]
  };
  const keys = [
    "FIFTH_PRIZE",
    "FOURTH_PRIZE",
    "THIRD_PRIZE",
    "SECOND_PRIZE",
    "FIRST_PRIZE"
  ];
  const lottoResultListHeader = {
    tag: "li",
    className: "modal-content-lotto-result",
    children: ["일치 갯수", "당첨금", "당첨 갯수"].map((text) => ({
      tag: "span",
      textContent: text
    }))
  };
  return [
    lottoResultListHeader,
    ...keys.map((key) => ({
      tag: "li",
      className: "modal-content-lotto-result",
      children: message[key].map((text) => ({
        tag: "span",
        textContent: text
      }))
    }))
  ];
};
const createWinningStatisticsModal = (lottoResult = {}, lottoProfit = 0) => {
  return createElementWithAttributes({
    tag: "div",
    id: "modal",
    className: "modal",
    children: [
      {
        tag: "div",
        id: "modalOverlay",
        className: "modal-overlay"
      },
      {
        tag: "div",
        id: "modalContent",
        className: "modal-content",
        children: [
          {
            tag: "h3",
            className: "text-subtitle",
            textContent: "🏆 당첨 통계 🏆",
            children: [
              {
                tag: "button",
                id: "modalCloseButton",
                className: "modal-close-button",
                children: [
                  {
                    tag: "img",
                    attributes: { src: "/public/vector.svg", alt: "close" }
                  }
                ]
              }
            ]
          },
          {
            tag: "ul",
            className: "modal-content-lotto-list-result",
            children: createLottoResultList(lottoResult)
          },
          {
            tag: "span",
            className: "modal-content-profit",
            textContent: `당신의 총 수익률은 ${Number(lottoProfit.toFixed(1)).toLocaleString()}%입니다.`
          },
          {
            tag: "button",
            id: "modalRestartButton",
            className: "modal-restart-button",
            textContent: "다시 시작하기"
          }
        ]
      }
    ]
  });
};
const validateAndFormatPurchaseAmountInput = (input) => {
  validateEmptySpace(input);
  const convertedInput = convertFormat.toNumber(input);
  validatePurchaseAmount(convertedInput);
  return convertedInput;
};
class App {
  constructor() {
    __privateAdd(this, _App_instances);
    __privateAdd(this, _state, {});
    __privateAdd(this, _eventHandler, {});
    __privateSet(this, _eventHandler, {
      submit: __privateMethod(this, _App_instances, submitEventHandler_fn).call(this),
      click: __privateMethod(this, _App_instances, clickEventHandler_fn).call(this),
      keydown: __privateMethod(this, _App_instances, keyEventHandler_fn).call(this)
    });
  }
  async run() {
    const purchaseAmount = await __privateMethod(this, _App_instances, initializePurchaseAmount_fn).call(this);
    const { lottoCounts, lottoNumbersList, lottoList } = this.buyLottos(purchaseAmount);
    outputView.printLottoCount(lottoCounts);
    outputView.printLottoList(lottoNumbersList);
    const winningNumbers = await __privateMethod(this, _App_instances, initializeWinningNumbers_fn).call(this);
    const bonusNumber = await __privateMethod(this, _App_instances, initializeBonusNumber_fn).call(this, winningNumbers);
    const winningLotto = new WinningLotto(
      new Lotto(winningNumbers),
      bonusNumber
    );
    const { lottoResult, lottoProfit } = this.getLottoResult(
      winningLotto,
      lottoList
    );
    outputView.printLottoResultInstruction();
    outputView.printLottoResult(lottoResult);
    outputView.printProfit(lottoProfit);
    await this.retryRun();
  }
  buyLottos(purchaseAmount) {
    const lottoMachine = new LottoMachine();
    const lottoCounts = lottoMachine.purchaseLotto(purchaseAmount);
    lottoMachine.makeLottoList(lottoCounts);
    const lottoNumbersList = lottoMachine.getLottoNumbersList();
    const lottoList = lottoMachine.getLottoList();
    return { lottoCounts, lottoNumbersList, lottoList };
  }
  getLottoResult(winningLotto, lottoList) {
    const lottoManager = new LottoManager(winningLotto, lottoList);
    const lottoResult = lottoManager.compareWinningLotto();
    const totalLottoPrize = lottoManager.calculatePrize(lottoResult);
    const lottoProfit = lottoManager.calculateProfit(totalLottoPrize);
    return { lottoResult, lottoProfit };
  }
  async retryRun() {
    const retry = await __privateMethod(this, _App_instances, initializeRetry_fn).call(this);
    if (retry === "y") {
      await this.run();
    }
  }
  runWeb() {
    __privateMethod(this, _App_instances, setEventHandlers_fn).call(this);
  }
}
_state = new WeakMap();
_eventHandler = new WeakMap();
_App_instances = new WeakSet();
initializePurchaseAmount_fn = async function() {
  const purchaseAmountInput = await readUserInputUntilSuccess({
    readUserInput: getPurchaseAmountInput,
    formatter: (input) => {
      validateEmptySpace(input);
      const convertedInput = convertFormat.toNumber(input);
      validatePurchaseAmount(convertedInput);
      return convertedInput;
    },
    onError: (error) => outputView.printErrorMessage(error)
  });
  return purchaseAmountInput;
};
initializeWinningNumbers_fn = async function() {
  const winningNumbersInput = await readUserInputUntilSuccess({
    readUserInput: getWinningNumbersInput,
    formatter: (input) => {
      validateEmptySpace(input);
      const splittedInput = convertFormat.splitByComma(input);
      validateEmptySpaceInWinningNumbers(splittedInput);
      const numbers = splittedInput.map(Number);
      validateWinningNumbers(numbers);
      return numbers;
    },
    onError: (error) => outputView.printErrorMessage(error)
  });
  return winningNumbersInput;
};
initializeBonusNumber_fn = async function(winningNumbersInput) {
  const bonusNumberInput = await readUserInputUntilSuccess({
    readUserInput: getBonusNumberInput,
    formatter: (input) => {
      validateEmptySpace(input);
      const convertedInput = convertFormat.toNumber(input);
      validateBonusNumber(convertedInput, winningNumbersInput);
      return convertedInput;
    },
    onError: (error) => outputView.printErrorMessage(error)
  });
  return bonusNumberInput;
};
initializeRetry_fn = async function() {
  const retryInput = await readUserInputUntilSuccess({
    readUserInput: getRetryInput,
    formatter: (input) => {
      validateEmptySpace(input);
      validateYorN(input);
      return input;
    },
    onError: (error) => outputView.printErrorMessage(error)
  });
  return retryInput;
};
submitEventHandler_fn = function() {
  return (event) => {
    event.preventDefault();
    const $target = event.target;
    if ($target.id === "lottoPurchaseForm") {
      __privateMethod(this, _App_instances, purchaseLottosByWeb_fn).call(this, $target);
    }
    if ($target.id === "winningLottoForm") {
      __privateMethod(this, _App_instances, purchaseWinningLottoByWeb_fn).call(this, $target);
    }
  };
};
clickEventHandler_fn = function() {
  return (event) => {
    var _a;
    const $target = event.target;
    if ($target.id === "modalCloseButton" || $target.id === "modalOverlay" || ((_a = $target.closest("#modalCloseButton")) == null ? void 0 : _a.id) === "modalCloseButton") {
      __privateMethod(this, _App_instances, closeWinningStatisticsModal_fn).call(this);
    }
    if ($target.id === "modalRestartButton") {
      __privateMethod(this, _App_instances, retryRunWeb_fn).call(this);
    }
  };
};
keyEventHandler_fn = function() {
  return (event) => {
    const $modal = document.querySelector("#modal");
    if ($modal && event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.key === "Escape") {
      __privateMethod(this, _App_instances, closeWinningStatisticsModal_fn).call(this);
    }
  };
};
setEventHandlers_fn = function() {
  const $app = document.querySelector("#app");
  $app.addEventListener("submit", __privateGet(this, _eventHandler).submit);
  $app.addEventListener("click", __privateGet(this, _eventHandler).click);
  $app.addEventListener("keydown", __privateGet(this, _eventHandler).keydown);
};
removeEventHandlers_fn = function() {
  const $app = document.querySelector("#app");
  $app.removeEventListener("submit", __privateGet(this, _eventHandler).submit);
  $app.removeEventListener("click", __privateGet(this, _eventHandler).click);
  $app.removeEventListener("keydown", __privateGet(this, _eventHandler).keydown);
};
initializeWebInput_fn = function({ readUserInput, formatter, onError }) {
  try {
    const input = readUserInput();
    return formatter(input);
  } catch (error) {
    onError(error);
    return null;
  }
};
purchaseLottosByWeb_fn = function($target) {
  const formData = new FormData($target);
  const purchaseAmountInput = __privateMethod(this, _App_instances, initializeWebInput_fn).call(this, {
    readUserInput: () => formData.get("purchaseAmount"),
    formatter: validateAndFormatPurchaseAmountInput,
    onError: (error) => outputViewByWeb.displayErrorMessage(error)
  });
  if (purchaseAmountInput === null) {
    return;
  }
  const { lottoCounts, lottoNumbersList, lottoList } = this.buyLottos(purchaseAmountInput);
  __privateSet(this, _state, { lottoList });
  const $input = document.querySelector("#purchaseAmountInput");
  $input.setAttribute("disabled", true);
  const $button = document.querySelector("#purchaseAmountButton");
  $button.setAttribute("disabled", true);
  const $section = document.querySelector("#lottoListWinningLottoContainer");
  const $article = createLottoListDisplay(lottoCounts, lottoNumbersList);
  $section.appendChild($article);
  const $form = createWinningLottoForm();
  $section.appendChild($form);
  const $winningNumberInput = document.querySelector("#lottoNumber1");
  $winningNumberInput.focus();
};
purchaseWinningLottoByWeb_fn = function($target) {
  const { lottoList } = __privateGet(this, _state);
  const formData = new FormData($target);
  const winningNumbersInput = __privateMethod(this, _App_instances, initializeWebInput_fn).call(this, {
    readUserInput: () => formData.getAll("winningNumber"),
    formatter: (input) => {
      validateEmptySpaceInWinningNumbers(input);
      const numbers = input.map(Number);
      validateWinningNumbers(numbers);
      return numbers;
    },
    onError: (error) => outputViewByWeb.displayErrorMessage(error)
  });
  if (winningNumbersInput === null) {
    return;
  }
  const bonusNumberInput = __privateMethod(this, _App_instances, initializeWebInput_fn).call(this, {
    readUserInput: () => formData.get("bonusNumber"),
    formatter: (input) => {
      validateEmptySpace(input);
      const convertedInput = convertFormat.toNumber(input);
      validateBonusNumber(convertedInput, winningNumbersInput);
      return convertedInput;
    },
    onError: (error) => outputViewByWeb.displayErrorMessage(error)
  });
  if (bonusNumberInput === null) {
    return;
  }
  const winningLotto = new WinningLotto(
    new Lotto(winningNumbersInput),
    bonusNumberInput
  );
  const { lottoResult, lottoProfit } = this.getLottoResult(
    winningLotto,
    lottoList
  );
  __privateSet(this, _state, { ...__privateGet(this, _state), lottoResult, lottoProfit });
  const $winningStatisticsModal = createWinningStatisticsModal(
    lottoResult,
    lottoProfit
  );
  document.querySelector("#app").prepend($winningStatisticsModal);
  const $form = $target.closest("#winningLottoForm");
  const $inputs = $form.querySelectorAll("input");
  $inputs.forEach((input) => {
    input.setAttribute("readonly", true);
  });
};
closeWinningStatisticsModal_fn = function() {
  const $modal = document.querySelector("#modal");
  if ($modal) {
    $modal.remove();
  }
};
retryRunWeb_fn = function() {
  __privateMethod(this, _App_instances, closeWinningStatisticsModal_fn).call(this);
  const $input = document.querySelector("#purchaseAmountInput");
  $input.value = null;
  $input.removeAttribute("disabled");
  const $button = document.querySelector("#purchaseAmountButton");
  $button.removeAttribute("disabled");
  const $section = document.querySelector("#lottoListWinningLottoContainer");
  $section.replaceChildren();
  __privateMethod(this, _App_instances, removeEventHandlers_fn).call(this);
  this.runWeb();
};
const app = new App();
app.runWeb();
