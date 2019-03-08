import { Runtime } from './Runtime'
import { Sprite } from './Sprite'

import { registry } from './registry'

const lib = function (canvasElement) {
    if (!canvasElement) {
        throw "Missing argument. "
    }

    this.canvasElement = canvasElement
    try {
        this.gl = this.canvasElement.getContext("webgl2")
        registry.runtime = new Runtime(this.gl)
    } catch (e) {
        throw "Failed to initalize webgl2 with error: " + e
    }
}

lib.prototype = {
    start: function () {
        return registry.runtime.start()
    },
    stop: function () {
        return registry.runtime.stop()
    },
    createSprite: function (dimension, color) {
        return new Sprite(dimension, color)
    }
}

export const twod = function (canvasElement) {
    return new lib(canvasElement)
}