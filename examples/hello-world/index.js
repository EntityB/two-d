

let cEl = document.getElementById("app")

let app = twod(cEl)

let dimension = [100, 200, 0, 0]
let color = [1, 0, 0, 1]

let sprite1 = app.createSprite(dimension, color)


app.start()