
/**
 * @author Przemyslaw Hardyn • przemyslawhardyn.com
 * Landing page animation for my personal website.
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
    this.ctx.baseLineWidth = lineWidth;
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
    this.now = undefined;
    this.then = Date.now();
    this.interval = 1000/fps;
    this.delta = undefined;

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

      this.now = Date.now();
      this.delta = this.now - this.then;

      if (this.delta > this.interval) {
        this.then = this.now - (this.delta % this.interval);

        if (this.speed > 0) this.speed -= 0.5;

        this.clearCanvas();

        for (var i = 0; i < this.arcs.length; i++) {
          this.rotateArc(this.arcs[i]);

          this.drawArc(
            this.arcs[i].begin,
            this.arcs[i].end,
            this.arcs[i].color,
            this.arcs[i].thickness
          );
        }
      }
    }
  }

  /**
   * @description Clear drawing area.
   */
  clearCanvas () {
    this.drawArc(0, 2, this.backgroundColor, this.ctx.baseLineWidth + 2);
  }

  /**
   * @param {number} begin
   * @param {number} end
   * @param {string} color
   * @param {integer} thickness
   */
  addArc (begin, end, color, thickness) {
    this.arcs.push({
      begin: begin,
      end, end,
      color: color,
      thickness: thickness,
      weight: end - begin
    });
  }

  /**
   * @param {number} begin
   * @param {number} end
   * @param {string} color
   * @param {integer} [thickness]
   */
  drawArc (begin, end, color, thickness) {
    this.ctx.beginPath();
    this.ctx.arc(
      this.center.x,
      this.center.y,
      this.radius,
      begin * Math.PI,
      end * Math.PI
    );
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = thickness ? thickness : this.ctx.baseLineWidth;
    this.ctx.stroke();

    if (thickness) this.ctx.lineWidth = this.ctx.baseLineWidth;
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
