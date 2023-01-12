const btnContainer = document.querySelector('[data-js="btn-container"]')

btnContainer.addEventListener("click", e => {
  const elementData = e.target.dataset.js

  const x = {
    fase1: () => {location.href = "./fase1/index.html"},
    fase2: () => {location.href = "./fase2/index.html"},
    fase3: () => {location.href = "./fase3/index.html"}
  }

  if (elementData !== "btn-container") {
    x[elementData]()
  }
})
