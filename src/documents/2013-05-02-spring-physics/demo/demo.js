/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function $$(id) {
  // Shorthand for getElementById.
  return document.getElementById(id);
}

function lambda(method) {
  // Convert a method func that uses a `this` context into a function that takes
  // the context object as the first parameter.
  return function (context) {
    var args = Array.prototype.slice.call(arguments, 1);
    return method.apply(context, args);
  };
}

var reduce = Array.reduce || lambda(Array.prototype.reduce);

function demo1(demoEl) {
  var restingPosition = (demoEl.clientWidth / 2);

  var particleEl = $$('demo-1-particle');

  particleEl.style.left = (restingPosition - (particleEl.clientWidth / 2)) + 'px';

  demoEl.addEventListener('mousedown', function (event) {
    particleEl.style.left = (event.clientX - 50) + 'px';
  });

  demoEl.addEventListener('mouseup', function (event) {
    var restingPosition = (demoEl.clientWidth / 2);

    var s = spring({
      distance: event.clientX - restingPosition,
      stiffness: 700,
      mass: 50,
      friction: 10
    });

    animateSpring(s, function animateParticleLeft(distance) {
      particleEl.style.left = (restingPosition + (distance - 50)) + 'px';
    });
  });
}

function demo2(demoEl) {
  var popoverEl = $$('demo-2-popover');

  function resetPopover(popoverEl) {
    popoverEl.style.left = '-900px';
    popoverEl.style.opacity = 0;
    popoverEl.style.transform = 'none';
    return popoverEl;
  }

  function openPopover(popoverEl, x, y) {
    var width = popoverEl.clientWidth;
    var height = popoverEl.clientHeight;

    var s = spring({
      distance: 300,
      stiffness: 500,
      mass: 20,
      friction: 10
    });

    // Open popover at x and y position.
    // Pin center of popover to x position.
    popoverEl.style.left = (x - (width / 2)) + 'px';
    // Pin top to y position.
    popoverEl.style.top = y + 'px';

    animateSpring(s, function (distance, opacitySet) {
      var adjustedWidth = (width + distance);
      var factor = width / adjustedWidth;
      popoverEl.style.transform = 'scale(' + factor + ')';

      if (!opacitySet) popoverEl.style.opacity = 1;

      return true;
    }, false);
  }

  var isOpen = false;

  resetPopover(popoverEl);

  demoEl.addEventListener('click', function (event) {
    if(!isOpen) {
      openPopover(popoverEl, event.clientX, event.clientY);
      isOpen = true;
    }
    else {
      resetPopover(popoverEl);
      isOpen = false;
    }
  });
}

function demo3(demoEl) {
  // Super hacky closure variable approach to drag-n-drop. Better to model this
  // with streams if doing properly.
  var isDragging = false;

  var restingPosition = (demoEl.clientWidth / 2);

  var sheetEl = $$('demo-3-sheet');

  var sheetCollection = demoEl.getElementsByClassName('sheet');

  reduce(sheetCollection, function (restingPosition, sheetEl) {
    sheetEl.style.left = (restingPosition - (sheetEl.clientWidth / 2)) + 'px';
    return restingPosition;
  }, restingPosition);

  sheetEl.addEventListener('mousedown', function (event) {
    isDragging = true;
  });

  sheetEl.addEventListener('mousemove', function(event) {
    if(!isDragging) return;
    var sheetEl = event.target;
    sheetEl.style.left = (event.clientX - (sheetEl.clientWidth/2)) + 'px';
  });

  sheetEl.addEventListener('mouseup', function (event) {
    var sheetEl = event.target;
    isDragging = false;

    var restingPosition = (demoEl.clientWidth / 2);

    var s = spring({
      distance: event.clientX - restingPosition,
      stiffness: 500,
      mass: 23,
      friction: 10
    });

    animateSpring(s, function animateParticleLeft(distance) {
      sheetEl.style.left = (restingPosition + (distance - (sheetEl.clientWidth / 2))) + 'px';
    });
  });
}

function demo4(demoEl) {
  var radialEl = $$('demo-4-radial');

  function resetRadial(radialEl) {
    radialEl.style.left = '-900px';
    radialEl.style.transform = 'none';
    return radialEl;
  }

  function openRadial(radialEl, x, y) {
    var width = radialEl.clientWidth;
    var height = radialEl.clientHeight;

    var s = spring({
      distance: 300,
      stiffness: 500,
      mass: 20,
      friction: 10
    });

    // Open radial at x and y position.
    // Pin center of radial to x position.
    radialEl.style.left = (x - (width / 2)) + 'px';
    // Pin top to y position.
    radialEl.style.top = (y - (height / 1.25)) + 'px';

    animateSpring(s, function (distance) {
      var adjustedWidth = (width + distance);
      var factor = width / adjustedWidth;
      radialEl.style.transform = 'scale(' + factor + ')';
    });

    return radialEl;
  }

  var isOpen = false;
  resetRadial(radialEl);

  demoEl.addEventListener('click', function (event) {
    if(!isOpen) {
      openRadial(radialEl, event.clientX, event.clientY);
      isOpen = true;
    }
    else {
      resetRadial(radialEl);
      isOpen = false;
    }
  });
}

demo1($$('demo-1'));
demo2($$('demo-2'));
demo3($$('demo-3'));
demo4($$('demo-4'));