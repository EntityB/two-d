import { Runtime } from './Runtime'
import { Sprite } from './Sprite'

import { registry } from './registry'

const lib = function (canvasElement, viewportDimension, opt_spriteLimit) {
    if (!canvasElement) {
        throw "Missing argument. "
    }

    this.viewportDimension = viewportDimension
    this.canvasElement = canvasElement
    try {
        this.gl = this.canvasElement.getContext("webgl2")
        registry.runtime = new Runtime(this.gl, this.viewportDimension, opt_spriteLimit)
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
    createSprite: function (topLeft, dimension, color) {
        return new Sprite(topLeft, dimension, color)
    }
}

export const twod = function (canvasElement, viewportDimension, opt_spriteLimit) {
    return new lib(canvasElement, viewportDimension, opt_spriteLimit)
}