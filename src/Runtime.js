/**
 * 
 * @param {*} gl 
 * @param {*} viewportDimension 
 */
export const Runtime = function (gl, viewportDimension, opt_spriteLimit) {
    this.gl = gl

    if (!viewportDimension || !viewportDimension[0] || !viewportDimension[1]) {
        throw "Failed to initalize viewport dimension"
    }
    this._viewportDimension = viewportDimension
    this.spriteLimit = opt_spriteLimit || 10000
    this._spriteCount = 0
    this.updateRegistry = []
    this._init()
}

Runtime.prototype = {
    _init: function () {
        let vertexShaderSource = `#version 300 es

        // an attribute is an input (in) to a vertex shader.
        // It will receive data from a buffer
        in vec2 a_position;
        in vec4 a_color;
        out vec4 v_color;

        // Used to pass in the resolution of the canvas
        uniform vec2 u_resolution;
        
        // all shaders have a main function
        void main() {
        
          // convert the position from pixels to 0.0 to 1.0
          vec2 zeroToOne = a_position / u_resolution;
        
          // convert from 0->1 to 0->2
          vec2 zeroToTwo = zeroToOne * 2.0;
        
          // convert from 0->2 to -1->+1 (clipspace)
          vec2 clipSpace = zeroToTwo - 1.0;
        
          v_color = a_color;
          gl_Position = vec4(clipSpace, 0, 1);
        }
        `

        let fragmentShaderSource = `#version 300 es
        
        precision mediump float;

        in vec4 v_color;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {
          outColor = v_color;
        }
        `

        let gl = this.gl

        let vShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vShader, vertexShaderSource)
        gl.compileShader(vShader)
        let compiled = gl.getShaderParameter(vShader, gl.COMPILE_STATUS)
        if (!compiled) {
            let lastError = gl.getShaderInfoLog(vShader)
            throw "V Shader failed to compile with error: " + lastError
        }

        let fShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fShader, fragmentShaderSource)
        gl.compileShader(fShader)
        compiled = gl.getShaderParameter(fShader, gl.COMPILE_STATUS)
        if (!compiled) {
            lastError = gl.getShaderInfoLog(fShader)
            throw "F Shader failed to compile with error: " + lastError
        }

        let program = gl.createProgram()
        gl.attachShader(program, vShader)
        gl.attachShader(program, fShader)
        gl.linkProgram(program)
        let linked = gl.getProgramParameter(program, gl.LINK_STATUS)
        if (!linked) {
            lastError = gl.getProgramInfoLog(program)
            throw "Program linking failed: " + lastError
        }

        // look up where the vertex data needs to go.
        let positionAttributeLocation = gl.getAttribLocation(program, "a_position")

        // look up uniform locations
        let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")

        let colorAttributeLocation = gl.getAttribLocation(program, "a_color")

        // Create a buffer and put a single pixel space rectangle in
        // it (2 triangles)
        // Create a buffer and put three 2d clip space points in it

        // Create a vertex array object (attribute state)
        let vao = gl.createVertexArray()

        // and make it the one we're currently working with
        gl.bindVertexArray(vao)

        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation)
        gl.enableVertexAttribArray(colorAttributeLocation)


        let positionBuffer = gl.createBuffer()

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

        let positionTypeArray = new Float32Array(12 * this.spriteLimit)
        gl.bufferData(gl.ARRAY_BUFFER, positionTypeArray, gl.STREAM_DRAW)

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2          // 2 components per iteration
        let type = gl.FLOAT   // the data is 32bit floats
        let normalize = false // don't normalize the data
        let stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0        // start at the beginning of the buffer
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
        this.positionTypeArray = positionTypeArray
        this.positionBuffer = positionBuffer


        let colorBuffer = gl.createBuffer()
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)

        let colorTypeArray = new Float32Array(24 * this.spriteLimit)
        gl.bufferData(gl.ARRAY_BUFFER, colorTypeArray, gl.STREAM_DRAW)

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        size = 4          // 2 components per iteration
        type = gl.FLOAT   // the data is 32bit floats
        normalize = false // don't normalize the data
        stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
        offset = 0        // start at the beginning of the buffer
        gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset)
        this.colorTypeArray = colorTypeArray
        this.colorBuffer = colorBuffer

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program)

        // Pass in the canvas resolution so we can convert from
        // pixels to clipspace in the shader
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
    },
    start: function () {

        let step = (deltaTime) => {
            this._render()
            this._update(deltaTime * 0.001)
            window.requestAnimationFrame(step)
        }

        return window.requestAnimationFrame(step)
    },
    stop: function () {

    },
    registerSprite: function (position, color) {
        let index = this._spriteCount

        this._spriteCount++

        this.positionTypeArray.set([
            position[0], position[1],
            position[2], position[1],
            position[0], position[3],
            position[0], position[3],
            position[2], position[1],
            position[2], position[3]
        ], 6 * 2 * index)

        let c = color
        this.colorTypeArray.set([
            c[0], c[1], c[2], c[3],
            c[0], c[1], c[2], c[3],
            c[0], c[1], c[2], c[3],
            c[0], c[1], c[2], c[3],
            c[0], c[1], c[2], c[3],
            c[0], c[1], c[2], c[3]
        ], 6 * 4 * index)

        return index
    },
    updateSprite: function (index, opt_position, opt_color) {
        if (typeof index !== 'number') {
            throw "sprite index must be provided"
        }

        if (opt_position) {
            let position = opt_position
            this.positionTypeArray.set([
                position[0], position[1],
                position[2], position[1],
                position[0], position[3],
                position[0], position[3],
                position[2], position[1],
                position[2], position[3]
            ], 6 * 2 * index)
        }

        return index
    },
    _render: function () {
        let gl = this.gl

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.positionTypeArray)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colorTypeArray)

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, this._viewportDimension[0], this._viewportDimension[1])

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        let primitiveType = gl.TRIANGLES
        let offset = 0
        let count = 6 * this.spriteLimit
        gl.drawArrays(primitiveType, offset, count)
    },
    _update: function (deltaTime) {
        this.updateRegistry.forEach(callback => {
            try {
                callback(deltaTime)
            } catch (e) {
                console.error("Failed to cast update with error: " + e)
            }
        })
    },
    /**
     * This callback is displayed as part of the Requester class.
     * @callback Runtime~registerUpdateCallback
     * @param {number} deltaTime
     */
    /**
     * 
     * @param {Runtime~registerUpdateCallback} callback 
     */
    registerUpdate: function (callback) {
        if (typeof callback !== 'function') {
            throw "Callback argument must be a function"
        }
        return this.updateRegistry.push(callback)
    },
    unregisterUpdate: function (index) {
        return this.updateRegistry.splice(index, 1)
    }
}