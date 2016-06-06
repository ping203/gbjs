/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	function BitmapDesk() {
		this.Container_constructor();
	}


	var p = createjs.extend(BitmapDesk, createjs.Bitmap);

	gbjs.BitmapDesk = createjs.promote(BitmapDesk, "Bitmap");

})();