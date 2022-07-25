let price = 1000.22;
let stockStatus = "+";
const RAND_MIN = 2;
const RAND_MAX = -2;
let stockValue = { price: 1000.22, stockStatus: "", newPrice: 0 };
// value of pullback after each price change (MIN: 0 MAX: 1)
const PULLBACK_PARAM = 0.1;

const generatePrice = (price, status, acc) => {
  // randomize the acceleration parameter
  const randAcc = (Math.random() * (RAND_MAX - RAND_MIN) + RAND_MIN) * acc;
  let newPrice;

  if (acc > 0) {
    newPrice =
      status == "+" ? price - randAcc * PULLBACK_PARAM : price + randAcc;
  } else {
    newPrice =
      status == "+" ? price + randAcc : price - randAcc * PULLBACK_PARAM;
  }

  setActualData(newPrice > 0 ? newPrice : 0, status, newPrice);

  console.log(
    `price: ${
      newPrice > 0 ? newPrice : 0
    } | status: ${status} | acc: ${acc} | randAcc: ${randAcc} | newPrice: ${newPrice}`
  );

  newPrice = Math.round(newPrice * 10000) / 10000;

  return newPrice > 0 ? newPrice : 0;
};

const setActualData = (price, stockStatus, newPrice) => {
  stockValue = {
    price,
    stockStatus,
    newPrice,
  };
};

const simulateStock = (acc) => {
  let newPrice = generatePrice(price, stockStatus, acc);
  stockStatus = newPrice - price > 0 ? "+" : "-";
  price = newPrice;
  return stockValue;
};

module.exports = simulateStock;
