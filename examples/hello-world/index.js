
import { engine } from '../../engine/index'

// <canvas id="app" width=864 height=480></canvas>
let canvasEl = document.createElement('canvas')
canvasEl.width = 864
canvasEl.height = 480
canvasEl.style.border = "2px solid black"

document.body.append(canvasEl)

let app = engine(canvasEl, [864, 480], 30000)


for (let i = 0; i < 10000; i++) {
    let topLeft = [Math.floor(Math.random() * 864), Math.floor(Math.random() * 480)]
    let dimension = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 40)]
    let color = [Math.random(), Math.random(), Math.random(), 1]

    let sprite = app.createSprite(topLeft, dimension, color)

}

for (let i = 0; i < 10000; i++) {
    let topLeft = [Math.floor(Math.random() * 10000) - 5000, Math.floor(Math.random() * 480)]
    let dimension = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 40)]
    let color = [Math.random(), Math.random(), Math.random(), 1]

    let sprite = app.createSprite(topLeft, dimension, color)

    sprite.animate(Math.random() * 3)
}

app.start()