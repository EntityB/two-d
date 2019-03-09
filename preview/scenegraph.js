(function(e, a) { for(var i in a) e[i] = a[i]; }(window, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "engine", function() { return engine; });
/* harmony import */ var _Runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _Sprite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);




const lib = function (canvasElement, viewportDimension, opt_spriteLimit) {
  if (!canvasElement) {
    throw "Missing argument. ";
  }

  this.viewportDimension = viewportDimension;
  this.canvasElement = canvasElement;

  try {
    this.gl = this.canvasElement.getContext("webgl2");
    _registry__WEBPACK_IMPORTED_MODULE_2__["registry"].runtime = new _Runtime__WEBPACK_IMPORTED_MODULE_0__["Runtime"](this.gl, this.viewportDimension, opt_spriteLimit);
  } catch (e) {
    throw "Failed to initalize webgl2 with error: " + e;
  }
};

lib.prototype = {
  start: function () {
    return _registry__WEBPACK_IMPORTED_MODULE_2__["registry"].runtime.start();
  },
  stop: function () {
    return _registry__WEBPACK_IMPORTED_MODULE_2__["registry"].runtime.stop();
  },
  createSprite: function (topLeft, dimension, color) {
    return new _Sprite__WEBPACK_IMPORTED_MODULE_1__["Sprite"](topLeft, dimension, color);
  }
};
const engine = function (canvasElement, viewportDimension, opt_spriteLimit) {
  return new lib(canvasElement, viewportDimension, opt_spriteLimit);
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Runtime", function() { return Runtime; });
/**
 * 
 * @param {*} gl 
 * @param {*} viewportDimension 
 */
const Runtime = function (gl, viewportDimension, opt_spriteLimit) {
  this.gl = gl;

  if (!viewportDimension || !viewportDimension[0] || !viewportDimension[1]) {
    throw "Failed to initalize viewport dimension";
  }

  this._viewportDimension = viewportDimension;
  this.spriteLimit = opt_spriteLimit || 10000;
  this._spriteCount = 0;
  this.updateRegistry = [];

  this._init();
};
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
        `;
    let fragmentShaderSource = `#version 300 es
        
        precision mediump float;

        in vec4 v_color;
        
        // we need to declare an output for the fragment shader
        out vec4 outColor;
        
        void main() {
          outColor = v_color;
        }
        `;
    let gl = this.gl;
    let vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertexShaderSource);
    gl.compileShader(vShader);
    let compiled = gl.getShaderParameter(vShader, gl.COMPILE_STATUS);

    if (!compiled) {
      let lastError = gl.getShaderInfoLog(vShader);
      throw "V Shader failed to compile with error: " + lastError;
    }

    let fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragmentShaderSource);
    gl.compileShader(fShader);
    compiled = gl.getShaderParameter(fShader, gl.COMPILE_STATUS);

    if (!compiled) {
      lastError = gl.getShaderInfoLog(fShader);
      throw "F Shader failed to compile with error: " + lastError;
    }

    let program = gl.createProgram();
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!linked) {
      lastError = gl.getProgramInfoLog(program);
      throw "Program linking failed: " + lastError;
    } // look up where the vertex data needs to go.


    let positionAttributeLocation = gl.getAttribLocation(program, "a_position"); // look up uniform locations

    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    let colorAttributeLocation = gl.getAttribLocation(program, "a_color"); // Create a buffer and put a single pixel space rectangle in
    // it (2 triangles)
    // Create a buffer and put three 2d clip space points in it
    // Create a vertex array object (attribute state)

    let vao = gl.createVertexArray(); // and make it the one we're currently working with

    gl.bindVertexArray(vao); // Turn on the attribute

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);
    let positionBuffer = gl.createBuffer(); // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let positionTypeArray = new Float32Array(12 * this.spriteLimit);
    gl.bufferData(gl.ARRAY_BUFFER, positionTypeArray, gl.STREAM_DRAW); // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

    let size = 2; // 2 components per iteration

    let type = gl.FLOAT; // the data is 32bit floats

    let normalize = false; // don't normalize the data

    let stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position

    let offset = 0; // start at the beginning of the buffer

    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    this.positionTypeArray = positionTypeArray;
    this.positionBuffer = positionBuffer;
    let colorBuffer = gl.createBuffer(); // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let colorTypeArray = new Float32Array(24 * this.spriteLimit);
    gl.bufferData(gl.ARRAY_BUFFER, colorTypeArray, gl.STREAM_DRAW); // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

    size = 4; // 2 components per iteration

    type = gl.FLOAT; // the data is 32bit floats

    normalize = false; // don't normalize the data

    stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position

    offset = 0; // start at the beginning of the buffer

    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);
    this.colorTypeArray = colorTypeArray;
    this.colorBuffer = colorBuffer; // Tell it to use our program (pair of shaders)

    gl.useProgram(program); // Pass in the canvas resolution so we can convert from
    // pixels to clipspace in the shader

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  },
  start: function () {
    let step = deltaTime => {
      this._render();

      this._update(deltaTime * 0.001);

      window.requestAnimationFrame(step);
    };

    return window.requestAnimationFrame(step);
  },
  stop: function () {},
  registerSprite: function (position, color) {
    let index = this._spriteCount;
    this._spriteCount++;
    this.positionTypeArray.set([position[0], position[1], position[2], position[1], position[0], position[3], position[0], position[3], position[2], position[1], position[2], position[3]], 6 * 2 * index);
    let c = color;
    this.colorTypeArray.set([c[0], c[1], c[2], c[3], c[0], c[1], c[2], c[3], c[0], c[1], c[2], c[3], c[0], c[1], c[2], c[3], c[0], c[1], c[2], c[3], c[0], c[1], c[2], c[3]], 6 * 4 * index);
    return index;
  },
  updateSprite: function (index, opt_position, opt_color) {
    if (typeof index !== 'number') {
      throw "sprite index must be provided";
    }

    if (opt_position) {
      let position = opt_position;
      this.positionTypeArray.set([position[0], position[1], position[2], position[1], position[0], position[3], position[0], position[3], position[2], position[1], position[2], position[3]], 6 * 2 * index);
    }

    return index;
  },
  _render: function () {
    let gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.positionTypeArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colorTypeArray); // Tell WebGL how to convert from clip space to pixels

    gl.viewport(0, 0, this._viewportDimension[0], this._viewportDimension[1]); // Clear the canvas

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 6 * this.spriteLimit;
    gl.drawArrays(primitiveType, offset, count);
  },
  _update: function (deltaTime) {
    this.updateRegistry.forEach(callback => {
      try {
        callback(deltaTime);
      } catch (e) {
        console.error("Failed to cast update with error: " + e);
      }
    });
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
      throw "Callback argument must be a function";
    }

    return this.updateRegistry.push(callback);
  },
  unregisterUpdate: function (index) {
    return this.updateRegistry.splice(index, 1);
  }
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sprite", function() { return Sprite; });
/* harmony import */ var _registry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

/**
 * 
 * @param {Array[2]} topLeft 
 * @param {Array[2]} dimension 
 * @param {Array[4]} color 
 */

const Sprite = function (topLeft, dimension, color) {
  this.topLeft = topLeft;
  this.dimension = dimension;
  this.color = color;

  this._register();
};
Sprite.prototype = {
  _register: function () {
    this._runtimeIndex = _registry__WEBPACK_IMPORTED_MODULE_0__["registry"].runtime.registerSprite([...this.topLeft, this.topLeft[0] + this.dimension[0], this.topLeft[1] + this.dimension[1]], this.color);
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
      _registry__WEBPACK_IMPORTED_MODULE_0__["registry"].runtime.registerUpdate(deltaTime => {
        this.topLeft[0] += deltaTime * shiftX;
        _registry__WEBPACK_IMPORTED_MODULE_0__["registry"].runtime.updateSprite(this._runtimeIndex, [...this.topLeft, this.topLeft[0] + this.dimension[0], this.topLeft[1] + this.dimension[1]], this.color);
      });
    }
  }
};

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registry", function() { return registry; });
let registry = {
  runtime: null
};

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _engine_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
 // <canvas id="app" width=864 height=480></canvas>

let canvasEl = document.createElement('canvas');
canvasEl.width = 864;
canvasEl.height = 480;
canvasEl.style.border = "2px solid black";
document.body.append(canvasEl);
let app = Object(_engine_index__WEBPACK_IMPORTED_MODULE_0__["engine"])(canvasEl, [864, 480], 30000);

for (let i = 0; i < 1; i++) {
  let topLeft = [Math.floor(Math.random() * 864), Math.floor(Math.random() * 480)];
  let dimension = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 40)];
  let color = [Math.random(), Math.random(), Math.random(), 1];
  let sprite = app.createSprite(topLeft, dimension, color);
}

for (let i = 0; i < 1; i++) {
  let topLeft = [Math.floor(Math.random() * 10000) - 5000, Math.floor(Math.random() * 480)];
  let dimension = [Math.floor(Math.random() * 100), Math.floor(Math.random() * 40)];
  let color = [Math.random(), Math.random(), Math.random(), 1];
  let sprite = app.createSprite(topLeft, dimension, color);
  sprite.animate(Math.random() * 3);
}

app.start();

/***/ })
/******/ ])));