import { registry } from './registry'

/**
 * 
 * @param {Array[4]} dimension 
 * @param {Array[4]} color 
 */
export const Sprite = function (dimension, color) {
    this.dimension = dimension
    this.color = color
}

Sprite.prototype = {
    _register: function () {
        this._index = registry.runtime.registerSprite(this.dimension, this.color)
    }
}