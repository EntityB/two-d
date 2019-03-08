import { registry } from './registry'

/**
 * 
 * @param {Array[2]} topLeft 
 * @param {Array[2]} dimension 
 * @param {Array[4]} color 
 */
export const Sprite = function (topLeft, dimension, color) {
    this.topLeft = topLeft
    this.dimension = dimension
    this.color = color
    this._register()
}

Sprite.prototype = {
    _register: function () {
        this._runtimeIndex = registry.runtime.registerSprite([
            ...this.topLeft,
            this.topLeft[0] + this.dimension[0], this.topLeft[1] + this.dimension[1]
        ], this.color)
    },
    /**
     * 
     * @param {*} shiftX 
     * @param {*} shiftY 
     * @param {*} scaleX 
     * @param {*} scaleY 
     * @param {*} deltaAngle 
     */
    animate: function (shiftX, shiftY, scaleX, scaleY, deltaAngle) {
        if (shiftX) {
            registry.runtime.registerUpdate((deltaTime) => {
                this.topLeft[0] += deltaTime * shiftX

                registry.runtime.updateSprite(
                    this._runtimeIndex,
                    [
                        ...this.topLeft,
                        this.topLeft[0] + this.dimension[0], this.topLeft[1] + this.dimension[1]
                    ], this.color
                )

            })
        }
    }
}