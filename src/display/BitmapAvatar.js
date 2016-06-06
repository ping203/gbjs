/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	/**
	 * @class BitmapAvatar
	 * @extends Bitmap
	 * @constructor
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to
	 * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
	 * If it is a URI, a new Image object will be constructed and assigned to the .image property.
	 **/
	function BitmapAvatar(imageOrUri) {
		this.Bitmap_constructor(imageOrUri);
	}


	var p = createjs.extend(BitmapAvatar, createjs.Bitmap);

	gbjs.BitmapAvatar = createjs.promote(BitmapAvatar, "Bitmap");

})();