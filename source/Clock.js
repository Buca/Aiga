function Clock( elapsed = 0, startImmediately = true ) {

	var _elapsed = 0;

	this.started = false;
	this.paused = true;

	this.startTS = null;
	this.pauseTS = Aiga.now();

	Object.defineProperty( this, 'elapsed', {

		set: function( value ) {

			value = Math.max( 0, value );

			if( this.paused === true ) _elapsed = value;

			else if( this.started === true ) {

				var now = Aiga.now();

				this.startTS = now;
				_elapsed = value;

			}

		},

		get: function() {

			if( this.started === true ) {

				var now = Aiga.now();

				return _elapsed + now - this.startTS;

			}

			return _elapsed;

		}

	} );

	if( elapsed !== undefined ) this.elapsed = elapsed;

	if( startImmediately === true ) this.start();

	return this;

};

var Clock_pool = [];

Clock.create = function( elapsed = 0, startImmediately = true ) {

	if( Clock_pool.length !== 0 ) {

		var clock = Clock_pool.pop();

		clock.elapsed = elapsed;
		clock.pauseTS = Aiga.now();
		clock.startTS = null;

		if( startImmediately === true ) return clock.start();

		return clock;

	}

	return new Clock( elapsed = 0, startImmediately );

};


Object.assign( Clock.prototype, {

	/**
	 * @method start
	*/
	start: function() {

		if( this.started === true ) return this;

		this.startTS = Aiga.now();
		this.started = true;
		this.paused = false;

		return this; 

	},

	/**
	 * @method pause
	*/
	pause: function() {

		if( this.paused === true ) return this;

		var elapsed = this.elapsed;

		this.pauseTS = Aiga.now();
		this.elapsed = elapsed;
		this.paused = true;
		this.started = false;

		return this;

	},

	/**
	 * @method reset
	*/
	reset: function( pause = false ) {

		this.elapsed = 0;

		return this;

	},

	/**
	 * @method dispose
	*/
	dispose: function() {

		Clock_pool.push( this );

		return undefined;

	}

} );
