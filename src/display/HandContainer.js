/**
 * @module Container
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";


	function HandContainer() {
		this.Container_constructor();
	}


	var p = createjs.extend(HandContainer, createjs.Container);

	/**
	 * Deal card
	 * @return {[type]} [description]
	 */
	p.dealCard = function() {
		// body...
	}

	/**
	 * On Touch Move
	 * @param  {Event|TouchEvent} event
	 * @return {void}
	 */
	p._onTapStart = function(event) {
		// body...
	}

	/**
	 * On Touch Move
	 * @param  {TouchEvent} event
	 * @return {void}
	 */
	p._onTouchMove = function(event) {
		// body...
	}

	/**
	 * On Drag Start
	 * @param  {Event} event
	 * @return {void}
	 */
	p._onDragStart = function(event) {
		// body...
	}

	/**
	 * On Drag Over
	 * @param  {Event} event
	 * @return {void}
	 */
	p._onDragOver = function(event) {
		// body...
	}

	gbjs.HandContainer = createjs.promote(HandContainer, "Container");

})();