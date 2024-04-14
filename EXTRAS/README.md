# Instructions

This repo contains a demonstration of how to build scenes of the scanner VR tour in aframe using the 360 image assets from our visit to the scanner a number of weeks ago

## Workflow

I'll be recording a meeting showing these steps but roughly they go as follows
### Blender
* open blender
* add an environment material to the world and set the 360 image as the src for that material
* rotate the UV map for that by 180 so that the default camera positions in blender match the AFRAME system
    * this stems from the fact that Blender is a z-UP system and AFRAME is a y-up system
* place and orient a camera at the origin at a height of 1.6m 
* then add in named empties that will correspond to either movement  or info icons in the AFRAME scene
    * the info icons will trigger lhs popouts of text or videos
    * the movement icons will trigger  loading a new scene in a different scanner lab location 
* orient as needed using the knowledge that the icon will live in the XZ plane 
    * I recommend using the `ARROWS` empty in blender so it's clear what the XZ plane is
* Fine tune the placement of the empties using a constrained `LOOK AT` camera modified so that we can predict how they will look in the final AFRAME scene
* Select these empties when you have placed them in their locations and export as `.glb`
* Then name the file according to the pattern `scene-anchors.glb` where the scene is replaced by the scanner lab scene you are working on
### AFRAME
* make a new AFRAME html file scene  by copying the base `index.html` here
* you will need to modify a few small things first
    * ensure that in the assets section that you include the updated name of the anchors glb
    * update the source of the 360 image also
* then the bulk of your modifications are going to be related to the info and movement icons
    * ensure that there is one custom anchor-reader entity for each empty you created in blender
        * in the index.html file there are 3 of these right now (two info icons and one movement)
    * you will need to update the anchor-reader's `anchorName` input in order to ensure that the circle child of the anchor-reader gets placed on the correct empty from the provided `.glb` file
    * you will also need to then modify the circle child's mlisten `htmlFile` input with the html that's supposed to be revealed on circle clicking interactions
    * if the circle is supposed to trigger movement to a new scene then you will also need to specify `movement:true` in the mlisten component's inputs also

## Final considerations

Although it's possible to navigate from one scene to another within the scenes this way, it might be important to have a home page with a map that is interactive so that people can jump to scenes they are specifically interested in. 

