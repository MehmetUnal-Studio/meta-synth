/* global AFRAME */
AFRAME.registerComponent('ring', {
  schema: {
    color: {default: 'red'},
    width: {default: 0.11},
    toggable: {default: true}
  },
  init: function () {
    var el = this.el;
    var labelEl = this.labelEl = document.createElement('a-entity');

    this.color = this.data.color;
    el.setAttribute('material', {color: this.color});
    el.setAttribute('pressable', '');

    this.bindMethods();
    this.el.addEventListener('stateadded', this.stateChanged);
    this.el.addEventListener('stateremoved', this.stateChanged);
    this.el.addEventListener('pressedstarted', this.onPressedStarted);
    this.el.addEventListener('pressedended', this.onPressedEnded);
  },

  bindMethods: function () {
    this.stateChanged = this.stateChanged.bind(this);
    this.onPressedStarted = this.onPressedStarted.bind(this);
    this.onPressedEnded = this.onPressedEnded.bind(this);
  },

  stateChanged: function () {
    var color = this.el.is('pressed') ? 'green' : this.color;
    this.el.setAttribute('material', {color: color});
  },

  onPressedStarted: function () {
    var el = this.el;
    el.setAttribute('material', {color: 'green'});
    el.emit('click');
    if (this.data.togabble) {
      if (el.is('pressed')) {
        el.removeState('pressed');
      } else {
        el.addState('pressed');
      }
    }
  },

  onPressedEnded: function () {
    if (this.el.is('pressed')) { return; }
    this.el.setAttribute('material', {color: this.color});
  }
});
