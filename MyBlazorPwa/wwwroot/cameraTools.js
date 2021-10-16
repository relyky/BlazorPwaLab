/// <reference path="lib/jslib-html5-camera-photo/build/index.js" />
/// <reference path="lib/jslib-html5-camera-photo/build/index.js" />
/*
 * 於手機上照像
 * ref→[jslib-html5-camera-photo](https://www.npmjs.com/package/jslib-html5-camera-photo)
 * JS module, ES6+
 *
 * HTML 應用參考
<div>... 
</div>
 */

const FACING_MODES = JslibHtml5CameraPhoto.FACING_MODES;
const IMAGE_TYPES = JslibHtml5CameraPhoto.IMAGE_TYPES;


//import CameraPhoto, { FACING_MODES, IMAGE_TYPES } from './jslib-html5-camera-photo.min.js';
// JslibHtml5CameraPhoto

/// 停止連續掃描 QR code
export function startCamera(dotNetObject) {

  // get video and image elements
  const videoElement = document.getElementById('videoId');
  const imgElement = document.getElementById('imgId');


  //// pass the video element to the constructor.
  //let cameraPhoto = new CameraPhoto(videoElement);
  const cameraPhoto = new JslibHtml5CameraPhoto.default(videoElement);

  // environment (camera point to environment)
  cameraPhoto.startCamera(FACING_MODES.ENVIRONMENT, {})
    .then((stream) => {/* ... */ })
    .catch((error) => {/* ... */ });
}