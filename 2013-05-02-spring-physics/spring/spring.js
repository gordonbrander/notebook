/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function dampenedHookeForce(displacement, stiffness, damping, velocity) {
  // Hooke's Law -- the basic spring force.
  // <http://en.wikipedia.org/wiki/Hooke%27s_law>
  //
  //     F = -kx
  //
  // Where:
  // x is the vector displacement of the end of the spring from its equilibrium,
  // k is a constant describing the tightness of the spring.
  var hookeForce = -1 * (stiffness * displacement);

  // Applying friction to Hooke's Law for realistic physics
  // <http://gafferongames.com/game-physics/spring-physics/>
  //
  //     F = -kx - bv
  //
  // Where:
  // b is damping (friction),
  // v is the relative velocity between the 2 points.
  return hookeForce - (damping * velocity);
}

function spring(options) {
  /* Create a new spring object. Override any property with your own options
  object.

  Returns an object with all required spring properties. */
  return {
    distance: options.distance || 0,
    mass: options.mass || 1,
    stiffness: options.stiffness || 0,
    friction: options.friction || 1,
    speed: options.speed || 0    
  };
}

function tickSpring(spring) {
  /* Mutates a spring object, updating it to its next state. */
  var force = dampenedHookeForce(spring.distance, spring.stiffness, spring.friction, spring.speed);

  var acceleration = force / spring.mass;
  
  spring.speed += acceleration;
  // Update distance from 0 (resting).
  spring.distance += spring.speed / 100;
  
  return spring;
}

function isSpringResting(spring) {
  /* Find out whether a spring is at rest. A spring is at rest when near 0
  distance at a speed less than 0.2.

  Returns a boolean. */
  return Math.round(spring.distance) === 0 && Math.abs(spring.speed) < 0.2;
}

function animateSpring(spring, callback, reduction) {
  /* Animate a spring from its current state to resting state using `callback` */
  spring = Object.create(spring);

  var requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

  function looper() {
    tickSpring(spring);
    if(isSpringResting(spring)) return;
    // `callback` will be called with the spring `distance` and `reduction`.
    // The return value of callback becomes the value of `reduction` for the
    // next call.
    reduction = callback(spring.distance, reduction);
    requestAnimationFrame(looper);
  }

  looper();
}