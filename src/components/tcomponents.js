
// Listen for cursor clicks, modify colors of clicked 3D model object, and report
// click event details to the browser console.
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


// Custom Component to display information objects which user can click
// to provide additional information about the marked real-world item.
AFRAME.registerComponent("infopoint", {
  schema: {
    color: { type: "string", default: "blue" },
    radius: { type: "string", default: ".4" },
    iTitle: { type: "string", default: "NO INFO YET" },
    iBody: { type: "string", default: "NO CONTENT YET" }
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
      console.log("Title:", this.data.iTitle);
      console.log("Body:", this.data.iBody);
    },
    mouseleave: function (ev) {
      this.el.setAttribute("material", "color", this.data.color);
    }
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
    title: "infopoint.iTitle",
    body: "infopoint.iBody"
  }
});



// Custom Component to navigate to another scene in another HTML page.
AFRAME.registerComponent("navpoint", {
  schema: {
    color: { type: "string", default: "white" },
  },

  init: function () {
    this.el.setAttribute("geometry", "primitive", "circle");
    this.el.setAttribute("material", {
      shader: "flat",
      side: "double",
      src: "#arrow"
    });
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
  }
});



AFRAME.registerComponent("mlisten", {
  schema: {
    htmlFile: { type: "string" },
    movement: { type: "boolean",default:false }
  },
  init: function () {
    // simplify reference to the entity in code
    let el = this.el;
    let mat = el.getAttribute("material");
    let elcolor = mat.color

    // the input provided by the component defined on the entity
    let htmlFile = this.data.htmlFile;
    let movement = this.data.movement
    // callbacks setup to handle behavior from different mousing interactions
    this.el.addEventListener("mouseenter", function (e) {
      // play with emissivity
      el.setAttribute("material", "color", "#5ef7ff");
      //el.setAttribute("material","emissiveIntensity","1")
    });
    this.el.addEventListener("mouseleave", function () {
      //el.setAttribute("material", "emissiveIntensity",'.2')
      el.setAttribute("material", "color", elcolor);
    });
    // this is if the html file was the content put in
    this.el.addEventListener("click", function () {
      console.log("clicked on info");
      // check if we are supposed to move when we trigger this click
      if (movement) {
        // move to a different scene
        let newUrl = `${htmlFile}`
        console.log(newUrl)
        window.location.href = newUrl
      } else {
        // load whatever popout is needed for this part
        createTextPopout(htmlFile);
      }
    });
  },
});
