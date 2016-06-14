/**
 * @module Sortable
 */
this.gbjs = this.gbjs || {};

(function() {
	"use strict";



	function Sortable(parent) {
		/**
		 * @protected
		 * @type {createjs.Container}
		 */
		this.parent = parent;

		/**
		 * @protected
		 * @type {String}
		 */
		this.oldIndex;

		/**
		 * @protected
		 * @type {String}
		 */
		this.oldOffset;

		/**
		 * @protected
		 * @type {String}
		 */
		this.dragObj;

		/**
		 * @protected
		 * @type {String}
		 */
		this.newIndex;

		/**
		 * @protected
		 * @type {Number}
		 */
		this.nextIndex;

		/**
		 * @protected
		 * @type {Object}
		 */
		this.nextObj;

		/**
		 * @protected
		 * @type {Object}
		 */
		this.cloneObj;

		/**
		 * @protected
		 * @type {Number}
		 */
		this.space;

		/**
		 * Setup event
		 */
		parent.on('mousedown', this._onDragStart, this);
		parent.on('pressmove', this._onTouchMove, this);
		parent.on('pressup', this._onDragOver, this);


	}

	/**
	 * @protected
	 * @type {Boolean}
	 */
	Sortable.active = false;

	/**
	 * @method _onDragStart
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype._onDragStart = function(evt) {
		


	}

	Sortable.prototype._dragStarted = function(evt) {
		// bump the target in front of its siblings:
		var o = evt.target;
		o.parent.addChild(o);
		o.offset = {x: o.x - evt.stageX, y: o.y - evt.stageY};
		Sortable.active = this;
	}

	/**
	 * @method _onTouchMove
	 * 
	 * @param  {Event|TouchEvent} evt
	 *
	 */
	Sortable.prototype._onTouchMove = function(evt) {
		// only set the status to dragging, when we are actually dragging
		if (!Sortable.active) {
			this._dragStarted(evt);
		}
		var child, cloneChild;
		var o = evt.target;
		var children = this.parent.children;
		var action = 'next';

		var x = evt.stageX + o.offset.x;
		var y = evt.stageY + o.offset.y;

		if(x < o.x) {
			action = 'prev';
		}

		o.x = x;
		o.y = y;

		if(o.x < 0) {
			o.x = 0;
		}

		var newIndex = Math.round(o.x/70);
		if(newIndex != this.newIndex) {
			this.newIndex = newIndex;
		}


		if(action == 'next') {
			//update before item
			for(var i = 0; i < this.newIndex; i++) {
				var child = children[i];
				child.x = i * 70;
			}
		} else {
			//update before item
			for(var i = this.newIndex; i < children.length -1; i++) {
				var child = children[i];
				child.x = (i + 1) * 70;
			}
		}
	}



	/**
	 * @method handleEvent
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype.handleEvent =function (evt) {

	}

	/**
	 * @method _onDragOver
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype._onDragOver = function(evt) {
		Sortable.active = false;
		var o = evt.target;
		o.parent.addChildAt(o, this.newIndex);
		o.x = this.newIndex * 70;
		o.y = 270;
	}

	/**
	 * @method _onDrop
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype._onDrop = function(evt) {
		// body...
	}


	function _onMove(argument) {
		// body...
	}

	gbjs.Sortable = Sortable;

})();