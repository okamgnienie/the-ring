
/**
 * @author Przemyslaw Hardyn • przemyslawhardyn.com
 * Home page animation for my personal website.
 * https://github.com/phardyn/ring
 */


/** Class representing an animation ring. */
class Ring {
  /**
   * @param {string} elementId
   * @param {integer} lineWidth
   * @param {integer} radius
   * @param {string} backgroundColor
   * @param {integer} fps
   */
  constructor (elementId, lineWidth, radius, backgroundColor, fps) {
    // Canvas element used as the display:
    this.element = document.getElementById(elementId);
    this.ctx = this.element.getContext('2d');

    // Arcs properties:
    this.baselineWidth = lineWidth;
    this.ctx.lineWidth = lineWidth;
    this.backgroundColor = backgroundColor;
    this.radius = radius;
    this.center = {
      x: this.element.width / 2,
      y: this.element.height / 2
    };

    // Arcs movement speed:
    // (modified later with mouse movement)
    this.speed = 0;

    // Redrawing interval:
    this.then = Date.now();
    this.interval = 1000/fps;

    // Animation state:
    this.listener = undefined;
    this.animationOn = false;

    // Generated arcs:
    this.arcs = [];
  }

  /**
   * @description Main animation loop.
   */
  animationLoop () {
    if (this.animationOn === true) {
      requestAnimationFrame(
        function () {
          this.animationLoop();
        }.bind(this)
      );

      let now = Date.now();
      let delta = now - this.then;

      if (delta > this.interval) {
        this.then = now - (delta % this.interval);

        if (this.speed > 0) this.speed -= 0.5;

        this.clearCanvas();

        for (var i = 0; i < this.arcs.length; i++) {
          this.rotateArc(this.arcs[i]);

          this.drawArc(
            this.arcs[i].begin,
            this.arcs[i].end,
            this.arcs[i].color,
            this.arcs[i].lineWidth
          );
        }
      }
    }
  }

  /**
   * @description Clear drawing area.
   */
  clearCanvas () {
    this.drawArc(0, 2, this.backgroundColor, this.baselineWidth + 2);
  }

  /**
   * @param {number} begin
   * @param {number} end
   * @param {string} color
   * @param {integer} lineWidth
   */
  addArc (begin, end, color, lineWidth) {
    this.arcs.push({
      begin: begin,
      end, end,
      color: color,
      lineWidth: lineWidth,
      weight: end - begin
    });
  }

  /**
   * @param {number} begin
   * @param {number} end
   * @param {string} color
   * @param {integer} [lineWidth]
   */
  drawArc (begin, end, color, lineWidth) {
    this.ctx.beginPath();
    this.ctx.arc(
      this.center.x,
      this.center.y,
      this.radius,
      begin * Math.PI,
      end * Math.PI
    );
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth ? lineWidth : this.baselineWidth;
    this.ctx.stroke();

    if (lineWidth) this.ctx.lineWidth = this.baselineWidth;
  }

  /**
   * @param {Object} arc
   */
  rotateArc (arc) {
    arc.begin +=  this.speed * 0.0008 / arc.weight;
    arc.end += this.speed * 0.0008 / arc.weight;
  }

  /**
   * @description Turn on cursor tracking and animation loop.
   */
  start () {
    this.animationOn = true;
    this.animationLoop();

    this.listener = function (event) {
      if (this.speed <= 32.5) this.speed += 0.5;
    }.bind(this);

    document.addEventListener('mousemove', this.listener, false);
  }

  /**
   * @description Turn off cursor tracking and animation loop.
   */
  stop () {
    document.removeEventListener('mousemove', this.listener, false);
    this.animationOn = false;
  }
}
