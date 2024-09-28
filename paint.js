// paint.js

document.addEventListener('DOMContentLoaded', createCell)

const size = 28
let values = []

let isMouseDown = false;

document.addEventListener('mousedown', function() {isMouseDown = true;});

document.addEventListener('mouseup', function() {isMouseDown = false;});

function createCell() {
 const container = $('#container')
 for (let i = 0; i < size**2; i++) {
  const cell = document.createElement('div')
  cell.classList.add('cell')
  container.append(cell)
  cell.addEventListener('click', () => {paint(i)})
  cell.addEventListener('mouseenter', () => {if (isMouseDown) paint(i)})
  values[i] = 0
 }
}

function paint(index) {
 const x = index % size
 const y = (index - index % size) / size
 /**
  * Returns a cell element from it's index
  * @param {Number} px 
  * @param {Number} py 
  * @returns {HTMLElement}
  */
 const _ = (px, py) => $(`#container :nth-child(${px+py*size+1})`)[0]
 const q = (px, py) => px+py*size
 values[q(x, y)] += 0.5
 values[q(x+1, y)] += 0.3
 values[q(x-1, y)] += 0.3
 values[q(x, y+1)] += 0.3
 values[q(x, y-1)] += 0.3
 values[q(x+1, y+1)] += 0.2
 values[q(x-1, y+1)] += 0.2
 values[q(x-1, y-1)] += 0.2
 values[q(x+1, y-1)] += 0.2
 values = values.slice(0, size**2)
 for (let i = 0; i < values.length; i++) {
  values[i] = Math.min(1, Math.max(0, values[i]))
  $(`#container :nth-child(${i+1})`).css('background-color', `rgba(0, 0, 0, ${values[i]}`);
 }
}