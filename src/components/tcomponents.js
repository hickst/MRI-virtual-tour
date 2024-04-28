// const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function showInfoPopup (info) {
  let theIFrame = document.querySelector("#the-iframe");
  console.log("theIFrame:", theIFrame);     // for DEBUG

  if (theIFrame.style.display == "block") {
    theIFrame.style.display = "none";
  } else {
    let theTitle = theIFrame.contentDocument.querySelector("#the-title");
    console.log("theTitle:", theTitle);       // for DEBUG
    theTitle.innerText = info.title;

    let theImage = theIFrame.contentDocument.querySelector("#the-image");
    console.log("theImage:", theImage);       // for DEBUG

    let theBody = theIFrame.contentDocument.querySelector("#the-body");
    console.log("theBody:", theBody);         // for DEBUG
    theBody.innerText = info.body;

    // await sleepNow(1000);
    let closeBtn = theIFrame.contentDocument.querySelector("#close-btn");
    console.log("closeBtn:", closeBtn);       // for DEBUG
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        document.querySelector("#the-iframe").style.display = "none";
      });
    };

    theIFrame.style.display = "block";
  };
};


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
    infoKey: { type: "string", default: "" },
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
      // console.log("infoKey:", this.data.infoKey);   // for DEBUG
    },
    mouseleave: function (ev) {
      this.el.setAttribute("material", "color", this.data.color);
    },
    click: function (ev) {
      var hasKey = this.data.infoKey in tourInfo;
      if (hasKey) {
        var info = tourInfo[this.data.infoKey];
        // console.log(info);                  // for DEBUG
        showInfoPopup(info);
      } else {
        console.log("WARNING: No info data found for key:", this.data.infoKey);
      };
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
    infokey: "infopoint.infoKey",
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
