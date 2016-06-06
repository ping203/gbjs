/**
 * @module Text Username
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	/**
	 * @class TextUsername
	 * @extends Text
	 * @constructor
	 * @param {String} [text] The text to display.
	 * @param {String} [font] The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold
	 * 36px Arial").
	 * @param {String} [color] The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex.
	 * "#F00", "red", or "#FF0000").
	 */
	function TextUsername(text, font, color) {
		// this super class constructor reference is automatically created by createjs.extends:
		this.Text_constructor(text, font, color);
	}


	var p = createjs.extend(TextUsername, createjs.Text);
	
	// set up the inheritance relationship: TextUsername extends Text.
	gbjs.TextUsername = createjs.promote(TextUsername, "Text");

})();