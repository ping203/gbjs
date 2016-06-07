/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";

	/**
	 * @class BitmapCard
	 * @extends Bitmap
	 * @constructor
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | String} imageOrUri The source object or URI to an image to
	 * display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use.
	 * If it is a URI, a new Image object will be constructed and assigned to the .image property.
	 **/
	function BitmapCard(imageOrUri, cursor) {
		this.Bitmap_constructor(imageOrUri);

		/**
		 * @protected
		 * @type {Boolean}
		 */
		this.ready = false;

		/**
		 * @protected
		 * @type {String}
		 */
		this.cursor = cursor;



		/**
		 * @private
		 * @type {createjs.Shadow<Object>}
		 */
		this._hoverShadow;

		/**
		 * @private
		 * @type {createjs.Shadow<Object>}
		 */
		this._shadow;


		//enable pointer
		if(this.cursor) {
			this.cursor = cursor;
			this.addEventListener('click', this.handleEventClick.bind(this));
			this.addEventListener("rollover", this);
			this.addEventListener("rollout", this);
		}
	}


	


	var p = createjs.extend(BitmapCard, createjs.Bitmap);

	/**
	 * Draws the display object into the specified context ignoring its visible, alpha, shadow, and transform.
	 * Returns true if the draw was handled (useful for overriding functionality).
	 *
	 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
	 * @method draw
	 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
	 * @param {Boolean} [ignoreCache=false] Indicates whether the draw operation should ignore any current cache.
	 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
	 * into itself).
	 **/
	p.draw = function(ctx, ignoreCache) {
		this.shadow = this._shadow;
		// call Text's drawing method to do the real work of drawing to the canvas:
		// this super class method reference is automatically created by createjs.extends for methods overridden in the subclass:
		this.Bitmap_draw(ctx, ignoreCache);
		if(this.hover) {
			this.shadow = this._hoverShadow;
		}
		
	}

	/**
	 * @method setHoverShadow
	 * @constructor
	 * @param {String} color The color of the shadow. This can be any valid CSS color value.
	 * @param {Number} offsetX The x offset of the shadow in pixels.
	 * @param {Number} offsetY The y offset of the shadow in pixels.
	 * @param {Number} blur The size of the blurring effect.
	 */
	p.setHoverShadow = function( color,  offsetX,  offsetY,  blur ) {
		this._hoverShadow = new createjs.Shadow(color,  offsetX,  offsetY,  blur);
	}

	/**
	 * @method setShadow
	 * @constructor
	 * @param {String} color The color of the shadow. This can be any valid CSS color value.
	 * @param {Number} offsetX The x offset of the shadow in pixels.
	 * @param {Number} offsetY The y offset of the shadow in pixels.
	 * @param {Number} blur The size of the blurring effect.
	 */
	p.setShadow = function(color,  offsetX,  offsetY,  blur) {
		this._shadow = new createjs.Shadow(color,  offsetX,  offsetY,  blur);
	}

	/**
	 * set up the handlers for click
	 */
	p.handleEventClick = function() {
		var y = this.y;
		if(this.ready === true) {
			y +=30;
		} else {
			y -=30;
		}

		createjs.Tween.get(this).to({y:y}, 100);
		this.ready = !this.ready;
	}

	/**
	 * @description 
	 * set up the handlers for mouseover / out
	 */
	p.handleEvent = function (evt) {
		this.hover = (evt.type == "rollover");
	};

	gbjs.BitmapCard = createjs.promote(BitmapCard, "Bitmap");

})();