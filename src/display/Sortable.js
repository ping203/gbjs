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
		 * Setup event
		 */
		parent.on('mousedown', this._onDragStart, this);
		parent.on('pressmove', this._onTouchMove, this);
		parent.on('pressup', this._onDragOver, this);


	}

	/**
	 * @method _onDragStart
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype._onDragStart = function(evt) {
		var target = this.dragObj = evt.target, 
				parent = this.parent;
		this.oldIndex = parent.getChildIndex(evt.target);
		target.parent.addChild(target);
		this.oldOffset = {x: target.x, y: target.y}
		target.offset = {x: target.x - evt.stageX, y: target.y - evt.stageY};


	}

	/**
	 * @method _onTouchMove
	 * 
	 * @param  {Event|TouchEvent} evt
	 *
	 */
	Sortable.prototype._onTouchMove = function(evt) {
		if(!this.dragObj) return;

		// only set the status to dragging, when we are actually dragging
		if (!Sortable.active) {
			this._dragStarted();
		}

		var target = evt.target;
		target.x = evt.stageX + target.offset.x || 0;
		target.y = evt.stageY + target.offset.y || 0;


	}

	/**
	 * @method handleEvent
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype.handleEvent =function (evt) {
		var type = evt.type;

		if (type === 'dragover' || type === 'dragenter') {
			if (this.dragObj) {
				this._onDragOver(evt);
			}
		}
		else if (type === 'drop' || type === 'dragend') {
			this._onDrop(evt);
		}
	}

	/**
	 * @method _onDragOver
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype._onDragOver = function(evt) {
		if(!this.dragObj) return;
		var o = evt.target;
		o.parent.addChildAt(o, this.oldIndex);
		o.x = this.oldOffset.x;
		o.y = this.oldOffset.y;

		this.dragObj = null;
	}

	/**
	 * @method _onDrop
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype._onDrop = function(evt) {
		// body...
	}

	gbjs.Sortable = Sortable;

})();