// Listen for cursor clicks, modify colors of clicked 3D model object, and report
// click event details to the browser console. NB: for testing only, not used in tour.
AFRAME.registerComponent('click-listener', {
  init: function () {
    var lastIndex = -1;
    var COLORS = ['red', 'green', 'blue'];
    this.el.addEventListener('click', function (evt) {
      lastIndex = (lastIndex + 1) % COLORS.length;
      this.setAttribute('material', 'color', COLORS[lastIndex]);
      console.log('Click event intersection: ', evt.detail.intersection);
      console.log('MouseClick event detail: ', evt.detail.mouseEvent);
    });
  }
});


// Custom Component Modifier: brighten a plane component on mouse enter, dim on mouse leave.
AFRAME.registerComponent('plane-bright', {
  events: {
    mouseenter: function (ev) {
      this.el.setAttribute("material", "opacity", "0.5");
      // console.log("Enter EL:", this.el);   // for DEBUG
    },
    mouseleave: function (ev) {
      this.el.setAttribute("material", "opacity", "0.2");
      // console.log("Leave EL:", this.el);   // for DEBUG
    },
  }
});


// Custom Component Modifier: brighten a plane component on mouse enter, dim on mouse leave.
AFRAME.registerComponent('plane-warn', {
  events: {
    mouseenter: function (ev) {
      this.el.setAttribute("material", "opacity", "0.5");
      document.querySelector("#warn-iframe").style.display = "block";
      // console.log("Enter EL:", this.el);   // for DEBUG
    },
    mouseleave: function (ev) {
      this.el.setAttribute("material", "opacity", "0.2");
      document.querySelector("#warn-iframe").style.display = "none";
      // console.log("Leave EL:", this.el);   // for DEBUG
    },
  }
});


// Custom Component to display information objects which user can click
// to provide additional information about the marked real-world item.
AFRAME.registerComponent("infopoint", {
  schema: {
    color: { type: "string", default: "blue" },
    radius: { type: "string", default: ".4" },
  },

  init: function () {
    this.el.setAttribute("geometry", "primitive", "sphere");
    this.el.setAttribute("geometry", "radius", this.data.radius);
    // this.el.setAttribute("material", "shader", "flat");
    this.el.setAttribute("material", "color", this.data.color);
  },

  events: {
    mouseenter: function (ev) {
      this.data.color = this.el.getAttribute("material").color;
      this.el.setAttribute("material", "color", "#5ef7ff");
      // console.log("tourInfo:", tourInfo);   // for DEBUG
    },
    mouseleave: function (ev) {
      this.el.setAttribute("material", "color", this.data.color);
    },
  },
});

// register the infopoint component as a primitive
AFRAME.registerPrimitive("t-infopoint", {
  defaultComponents: {
    infopoint: {},
  },
  mappings: {
    color: "infopoint.color",
    radius: "infopoint.radius",
  }
});


// Custom Component to navigate to another scene in another HTML page.
AFRAME.registerComponent("navpoint", {
  schema: {
    color: { type: "string", default: "white" },
    icon: { type: "string", default: "#arrow" },
    radius: { type: "string", default: "1.0" },
  },

  init: function () {
    this.el.setAttribute("geometry", "primitive", "circle");
    this.el.setAttribute("material", {shader: "flat", side: "double"});
    this.el.setAttribute("geometry", "radius", this.data.radius);
    this.el.setAttribute("material", "src", this.data.icon);
    this.el.setAttribute("material", "color", this.data.color);
  },

  events: {
    mouseenter: function (ev) {
      this.data.color = this.el.getAttribute("material").color;
      this.el.setAttribute("material", "color", "#5ef7ff");
    },
    mouseleave: function (ev) {
      this.el.setAttribute("material", "color", this.data.color);
    }
  },
});

// register the navpoint component as a primitive
AFRAME.registerPrimitive("t-navpoint", {
  defaultComponents: {
    navpoint: {},
  },
  mappings: {
    color: "navpoint.color",
    icon: "navpoint.icon",
    radius: "navpoint.radius",
  }
});
