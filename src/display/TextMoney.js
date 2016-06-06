/**
 * @module Text Money
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	/**
	 * @class TextMoney
	 * @extends Text
	 * @constructor
	 * @param {String} [text] The text to display.
	 * @param {String} [font] The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold
	 * 36px Arial").
	 * @param {String} [color] The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex.
	 * "#F00", "red", or "#FF0000").
	 */
	function TextMoney(text, font, color) {
		// this super class constructor reference is automatically created by createjs.extends:
		this.Text_constructor(text, font, color);
	}


	var p = createjs.extend(TextMoney, createjs.Text);
	
	// set up the inheritance relationship: TextMoney extends Text.
	gbjs.TextMoney = createjs.promote(TextMoney, "Text");

})();