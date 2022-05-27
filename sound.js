$(document).ready(function() {
  Tone.start();
});

const Afilter = new Tone.AutoFilter(4).start();
const autoPanner = new Tone.AutoPanner("4n").start()
const delay = new Tone.Delay(0.1).toMaster();
const reverb = new Tone.Reverb({
  wet: 0.7,
  decay: 30,
  preDelay: 0.01
}).toMaster();

// The synth

// const synth = new Tone.Synth({
//   volume: -15, // the oscillator volume set to -12dB
//   oscillator: {
//     type: "square" // oscillator type to square wave
//   },
//   envelope: {
//     attack: 0.5, // envelope attack set to 20ms
//     release: 3 // envelope release set to 1s
//   }
// });

// synth.chain(reverb,Afilter,delay,autoPanner);

const connectUrl = "wss://iomust:eqdhdYeiwHmfZl7o@iomust.cloud.shiftr.io";
const client = mqtt.connect(connectUrl);

/* global AFRAME, THREE */
AFRAME.registerComponent("synth", {
  // The schema defines arguments accepted by this component
  schema: {
    // The note / octave
    note: {
      type: "string",
      default: "C4"
    },
    // The duration: 8n describes an eighth note
    duration: {
      type: "string",
      default: "8n"
    }
  },
  init: function() {
    // setup the fusing/hover event listener
    this.el.addEventListener("click", this.trigger.bind(this));
  },
  trigger: function() {
    // trigger a note on the synth
    // this.data refers to the arguments defined
    client.publish('fromVR', this.el.attributes.id.value)
    synth.triggerAttackRelease(this.data.note, this.data.duration);
  },
  update: function() {},
  tick: function() {},
  remove: function() {},
  pause: function() {},
  play: function() {}
});

let frequency = {
  value: 0,
  min: 0.0,
  max: 1.0
}

/* global AFRAME, THREE */
AFRAME.registerComponent('slider', {
  schema: {
    width: { default: 0.5 }
  },

  init: function () {
    var trackEl = this.trackEl = document.createElement('a-entity');
    this.localPosition = new THREE.Vector3();
    this.onPinchedMoved = this.onPinchedMoved.bind(this);

    trackEl.setAttribute('geometry', {
      primitive: 'box',
      height: 0.01,
      width: this.data.width,
      depth: 0.01
    });

    trackEl.setAttribute('material', {
      color: 'white'
    });

    this.el.appendChild(trackEl);

    var pickerEl = this.pickerEl = document.createElement('a-entity');

    pickerEl.setAttribute('geometry', {
      primitive: 'cylinder',
      radius: 0.02,
      height: 0.05
    });

    pickerEl.setAttribute('material', {
      color: '#3a50c5'
    });

    pickerEl.setAttribute('pinchable', {
      pinchDistance: 0.05
    });

    pickerEl.setAttribute('rotation', {
      x: 90, y: 0, z: 0
    });


    this.el.appendChild(pickerEl);
    console.log(this.localPosition.x)
    pickerEl.addEventListener('pinchedmoved', this.onPinchedMoved);
  },

  onPinchedMoved: function (evt) {
    var el = this.el;
    var evtDetail = this.evtDetail;
    var halfWidth = this.data.width / 2;
    var localPosition = this.localPosition;
    localPosition.copy(evt.detail.position);
    el.object3D.updateMatrixWorld();
    el.object3D.worldToLocal(localPosition);
    if (localPosition.x < -halfWidth || localPosition.x > halfWidth) { return; }
    this.pickerEl.object3D.position.x = localPosition.x;
    frequency.value = (((this.pickerEl.object3D.position.x + 0.25) * (frequency.max - frequency.min)) / this.data.width) + frequency.min
    this.pickerEl.setAttribute('color-change', '');
    client.publish(`fromVR${this.el.attributes.id.value}`, `${frequency.value}`)
  }
});