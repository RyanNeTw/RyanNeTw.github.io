let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let isDrawing = false;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
let predictionTimeout;

const labels = [
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
  "add",
  "div",
  "mul",
  "sub",
];
let resultofpred = [];

var bouton = document.getElementById("ExtractButton");
bouton.addEventListener("click", MakeOperation);
var bouton2 = document.getElementById("ClearButton");
bouton2.addEventListener("click", () => {
  resultofpred = [];
  displayArray(resultofpred);
  clear();
});

window.onload = async function () {
  await loadModel();
};

async function loadModel() {
  let loadingIndicator = document.getElementById("loadingIndicator");
  loadingIndicator.innerText = "Loading model...";
  model = new onnx.InferenceSession();
  await model.loadModel("./static/model/model.onnx");
  loadingIndicator.innerText = "Model loaded. Start drawing!";
}

function startPredictionTimer() {
  clearTimeout(predictionTimeout);
  predictionTimeout = setTimeout(async function () {
    await eval();
    clear();
  }, 2000);
}

canvas.addEventListener("mousedown", (e) => {
  startPredictionTimer();
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

canvas.addEventListener("mouseup", () => {
  startPredictionTimer();
  isDrawing = false;
});

canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", function (e) {
  startPredictionTimer();
  e.preventDefault();
  isDrawing = true;
  let touch = e.touches[0];
  ctx.beginPath();
  ctx.moveTo(
    touch.clientX - canvas.offsetLeft,
    touch.clientY - canvas.offsetTop
  );
});

canvas.addEventListener("touchend", function (e) {
  startPredictionTimer();
  e.preventDefault();
  isDrawing = false;
});

canvas.addEventListener("touchmove", function (e) {
  e.preventDefault();
  if (!isDrawing) return;
  let touch = e.touches[0];
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.lineTo(
    touch.clientX - canvas.offsetLeft,
    touch.clientY - canvas.offsetTop
  );
  ctx.stroke();
});

function draw(event) {
  if (!isDrawing) return;

  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";

  ctx.lineTo(
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop
  );
  ctx.stroke();
}

function clear() {
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

async function eval() {
  let prediction = await predict();
  resultofpred.push(labels[prediction]);
  displayArray(resultofpred);
}

async function displayArray(array) {
  const arrayDisplayDiv = document.getElementById("arrayDisplay");
  const valueMap = {
    add: "+",
    mul: "*",
    sub: "-",
    div: "/",
  };
  const transformedArray = array.map((item) => valueMap[item] || item);
  arrayDisplayDiv.textContent = transformedArray.join("");
}

async function predict() {
  let tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = 28;
  tmpCanvas.height = 28;
  let tmpCtx = tmpCanvas.getContext("2d");

  tmpCtx.drawImage(canvas, 0, 0, 28, 28);
  let imgData = tmpCtx.getImageData(0, 0, 28, 28).data;

  let input = new Float32Array(28 * 28);
  for (let i = 0; i < imgData.length; i += 4) {
    let grayscale = imgData[i] != 0 ? 255 : 0;
    input[i / 4] = grayscale / 255 - 0.1736 / 0.3317;
  }

  for (let i = 0; i < input.length; i++) {
    if (input[i] < 1) input[i] = 0;
  }

  let tensorInput = new onnx.Tensor(input, "float32", [1, 1, 28, 28]);
  let outputMap = await model.run([tensorInput]);

  let outputData = outputMap.values().next().value.data;
  return outputData.indexOf(Math.max(...outputData));
}

function MakeOperation() {
  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const operations = ["add", "div", "mul", "sub"];
  let array = resultofpred;
  let temp = [];
  let temp2 = [];
  let operationsArray = [];

  for (let i = 0; i < array.length; i++) {
    if (numbers.includes(array[i])) {
      temp.push(array[i]);
    } else if (operations.includes(array[i])) {
      if (temp.length > 0) {
        let num = temp.join("");
        temp2.push(parseInt(num));
        temp = [];
      }
      operationsArray.push(array[i]);
    }
  }
  if (temp.length > 0) {
    let num = temp.join("");
    temp2.push(parseInt(num));
  }

  while (operationsArray.includes("mul") || operationsArray.includes("div")) {
    if (operationsArray.includes("mul")) {
      let index = operationsArray.indexOf("mul");
      let result = temp2[index] * temp2[index + 1];
      temp2.splice(index, 2, result);
      operationsArray.splice(index, 1);
    }
    if (operationsArray.includes("div")) {
      let index = operationsArray.indexOf("div");
      let result = temp2[index] / temp2[index + 1];
      temp2.splice(index, 2, result);
      operationsArray.splice(index, 1);
    }
  }

  while (operationsArray.includes("add") || operationsArray.includes("sub")) {
    if (operationsArray.includes("add")) {
      let index = operationsArray.indexOf("add");
      let result = temp2[index] + temp2[index + 1];
      temp2.splice(index, 2, result);
      operationsArray.splice(index, 1);
    }
    if (operationsArray.includes("sub")) {
      let index = operationsArray.indexOf("sub");
      let result = temp2[index] - temp2[index + 1];
      temp2.splice(index, 2, result);
      operationsArray.splice(index, 1);
    }
  }

  resultofpred = temp2;
  displayArray(resultofpred);
}
