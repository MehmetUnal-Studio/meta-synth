/* global AFRAME */
AFRAME.registerComponent('ring-manager', {
  
  init: function () {
    this.bindMethods();
    this.ring = this.el.querySelector('a-ring')
  },

  bindMethods: function () {
    this.onClick = this.onClick.bind(this);
  },

  onClick: function (evt) {
    var targetEl = evt.target;
    this.ring.removeState('pressed');
    targetEl.addState('pressed');
  }
});
