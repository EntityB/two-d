

let cEl = document.getElementById("app")

let app = twod(cEl, [864, 480], 30000)


for (let i = 0; i < 10000; i++) {
    let topLeft = [Math.floor(Math.random() * 864), Math.floor(Math.random() * 480)]
    let dimension = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 40)]
    let color = [Math.random(), Math.random(), Math.random(), 1]

    let sprite = app.createSprite(topLeft, dimension, color)

}

for (i = 0; i < 10000; i++) {
    let topLeft = [Math.floor(Math.random() * 10000) - 5000, Math.floor(Math.random() * 480)]
    let dimension = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 40)]
    let color = [Math.random(), Math.random(), Math.random(), 1]

    let sprite = app.createSprite(topLeft, dimension, color)

    sprite.animate(Math.random() * 3)
}

app.start()