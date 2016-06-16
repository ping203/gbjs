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
		 * @type {Number}
		 */
		this.dragIndex;

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
		var o = evt.target;
		this.dragObj = o;
		if(this.space) {
			return true;
		}
		var o1 = o.parent.getChildAt(0);
		var o2 = o.parent.getChildAt(1);
		if(o1 && o2) {
			this.space = o2.x - o1.x;
		}
	}

	Sortable.prototype._dragStarted = function(evt) {
		// bump the target in front of its siblings:
		var o = evt.target;
		o.offset = {x: o.x - evt.stageX, y: o.y - evt.stageY};
		o.draggable = true;
		Sortable.active = this;
		this.updateDragIndex();
		this.cloneObj = o.clone();
	}


	Sortable.prototype.updateDragIndex = function() {
		var lastChild = this.parent.getChildAt(this.parent.numChildren - 1);
		if(lastChild != this.dragObj) {
			this.parent.addChild(this.dragObj);
		}
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
			this._dragStarted(evt);
		}
		var child, cloneChild;
		var o = evt.target;
		var children = this.parent.children;
		var x = evt.stageX + o.offset.x;
		var y = evt.stageY + o.offset.y;

		this.updateDragIndex();


		o.x = x;
		o.y = y;

		if(x < 0) {
			x = 0;
		}
		var newIndex = Math.round(x/this.space);

		if(newIndex >= children.length) {
			newIndex = children.length - 1;
		}

		if(newIndex == this.newIndex) {
			return;
		}
		this.newIndex = newIndex;
		this._sort();
	}

	/**
	 * @method _sort
	 */
	Sortable.prototype._sort = function() {
		var index = this.newIndex;
		var children = this.parent.children;
		var space = this.space;
		//update before item
		for(var i = 0; i < index; i++) {
			var child = children[i];
			createjs.Tween.get(child).to({x:i * space}, 100);
		}

		//update before item
		for(var i =index; i < children.length -1; i++) {
			var child = children[i];
			createjs.Tween.get(child).to({x:(i + 1) * space}, 100);
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
		if(!Sortable.active) return;
		Sortable.active = false;
		var o = evt.target;
		o.parent.addChildAt(o, this.newIndex);
		o.x = this.newIndex * this.space;
		o.y = this.cloneObj.y;
		o.draggable = false;
	}

	/**
	 * @method _onDrop
	 * 
	 * @param  {Event} evt
	 */
	Sortable.prototype._onDrop = function(evt) {
		// body...
	}


	Sortable.prototype.destroy = function() {
		parent.on('pressmove', this._onTouchMove, this);
		parent.on('pressup', this._onDragOver, this);
	}


	function _onMove(argument) {
		// body...
	}

	gbjs.Sortable = Sortable;

})();