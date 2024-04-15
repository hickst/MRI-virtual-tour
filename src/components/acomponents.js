// create function that loads an iframe of the popout page in this page
let createTextPopout = (filehtml) => {
  // generates a sub page on the current web VR view, it isn't actually a VR page now.
  let iframeElement = document.createElement("iframe");
  // use the html that was passed in when we called this function
  iframeElement.src = filehtml;
  document.body.append(iframeElement);
  // bind the close button
  // recursive timeout till selection passes
  // TODO check if this actually does anything right now
  let closeInt = setInterval(() => {
    let btn = iframeElement.contentDocument.querySelector("button");
    if (btn) {
      // add image to close it
      // ignoring old PNG based x
      let xPopoutIcon = document.createElement("img");
      xPopoutIcon.src =
        "x.svg";
      // various positioning code to make sure that the iframe is on the far left
      iframeElement.contentDocument.body.append(xPopoutIcon);
      xPopoutIcon.style.position = "absolute";
      xPopoutIcon.style.top = "0px";
      xPopoutIcon.style.right = "0px";
      xPopoutIcon.addEventListener("click", () => {
        document.querySelector("iframe").remove();
      });

      btn.addEventListener("click", () => {
        document.querySelector("iframe").remove();
      });
      clearInterval(closeInt);
    }
  }, 1000);
  // ensure that we have the option to close the popout also
  iframeElement.contentDocument
    .querySelector("button")
    .addEventListener("click", () => {
      document.querySelector("iframe").remove();
    });
};


// this is a Aframe component, it allows us to extend the basic entities so
// that they can do custom things like work with 3d models from blender for
// example this anchor-reader is the name of the component we will define;
// like an html element attribute (shown later), and the rest of the
// definition allows us to set up the types of input the component can accept
// and how it should initialize we will actually be using this to reposition
// the aframe entities that we place inside of the entity, in our case this
// will mostly be little circles that either hold the info or the movement
// icon you will have the option to customize the kind of behavior that each
// on triggers through the mlisten component defined later
AFRAME.registerComponent("anchor-reader", {
  schema: {
    // accept our input as the name of the empty from the blender file that
    // we used to more intuitively position the info and movement icons
    anchorName: { type: "string" },
  },
  init: function () {
    // this is the function that we will use to update the location of the child
    var match_name = function () {
      var mesh = this.el.getObject3D("mesh") // might need to specify the name actually
      // console.log("this mesh is the one we loaded", mesh)
      // can search the children for a name matching anchorName
      // then get the circle within the entity and set the rotation and translation on that
      let infoCircle = this.el.children[0]
      for (let anchor of mesh.children) {
        if (anchor.name == this.data.anchorName) {
          // unfortunate change of how values are handled between blender's
          // zup and threejs y up because we switched systems we have to
          // invert the x, and then change which is z vs y, and then make the
          // rotation use y instead of z, the same kinds of inversions are
          // probably used if needing to handle other kinds of rotation, but
          // for eye level info buttons this should be enough
          infoCircle.object3D.position.copy(anchor.position)
          infoCircle.object3D.rotation.copy(anchor.rotation)

        }
      }

    }
    match_name = match_name.bind(this)
    // here we iterate over the model if it's finished loading and then introduce
    this.el.addEventListener("model-loaded", match_name)
  },
});


// This component is similarly defined but accomplishes a different kind of
// action. It lets us click on icons and open popups. Another component will
// be defined that lets us move to a different scene also.
AFRAME.registerComponent("mlisten", {
  schema: {
    htmlFile: { type: "string" },
    movement: { type: "boolean",default:false }
  },
  init: function () {
    // simplify reference to the entity in code
    let el = this.el;
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
      el.setAttribute("material", "color", "white");
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
