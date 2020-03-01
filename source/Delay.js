function Delay( duration = 0, callback, context, elapsed = 0, startImmediatly = true ) {

	console.log( duration, callback, context, elapsed, startImmediatly );

	var _duration = 1000,
		_callback = undefined,
		_context = undefined,
		_elapsed = 0;

	this.started = false;
	this.paused = true;

	this.startTS = null;
	this.pauseTS = Aiga.now();

	this._timerID;

	Object.defineProperty( this, 'duration', {

		set: function( value ) {

			var now = Date.now(),
				prevDuration = duration;

			_duration = value;

			if( value === prevDuration ||
				this.started === false ||
				now - this.startedTS >= prevDuration ) return;

			clearTimeout( this._timerID );

			if( Math.floor( _duration - this.elapsed ) <= 0 ) {

				this.callback();

			}

			else if( this.started === true ) {

				this._timerID = setTimeout( _callback, Math.floor( _duration - this.elapsed ) );

			}

		},

		get: function() {

			return _duration;

		}

	} );

	Object.defineProperty( this, 'callback', {

		set: function( fn ) {

			if( _context !== undefined ) fn = fn.bind( _context );

			_callback = fn;

			if( this.started === true ) {

				clearTimeout( this._timerID );

				this._timerID = setTimeout( _callback, Math.floor( this.duration - this.elapsed ) );

			}

		},

		get: function() {

			return _callback;

		}

	} );

	Object.defineProperty( this, 'context', {

		set: function( ctx ) {

			console.log( ctx );

			_context = ctx;
			_callback = _callback.bind( ctx );

			if( this.started === true ) {

				clearTimeout( this._timerID );

				this._timerID = setTimeout( _callback, Math.floor( this.duration - this.elapsed ) );

			}

		},

		get: function() {

			return _context;

		}

	} );

	Object.defineProperty( this, 'elapsed', {

		set: function( value ) {

			value = Math.max( 0, value );

			var oldElapsed = _elapsed;

			if( this.paused === true ) {

				_elapsed = value;

				if( _elapsed >= this.duration && this.duration > oldElapsed ) {

					this.callback();

				}

			}

			else if( this.started === true ) {

				var now = Aiga.now();

				this.startTS = now;
				_elapsed = value;

				if( _elapsed >= this.duration && this.duration > oldElapsed ) {

					this._timerID = clearTimeout( this._timerID );
					this.callback();

				}

				else if( this.duration > _elapsed ) {

					this._timerID = clearTimeout( this._timerID );
					this._timerID = setTimeout( this.callback, Math.floor( this.duration - _elapsed ) );

				}

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

	this.duration = duration;
	if( callback !== undefined ) this.callback = callback;
	if( context !== undefined ) this.context = context;
	this.elapsed = elapsed;

	if( startImmediatly === true ) this.start();

	return this;

};

var Delay_Pool = [];
Delay.create = function() {

	if( Clock_pool.length !== 0 ) {

		var clock = Clock_pool.pop();

		clock.elapsed = elapsed;
		clock.pauseTS = Aiga.now();
		clock.startTS = null;

		if( startImmediately === true ) return clock.start();

		return clock;

	}

	return new Delay( elapsed = 0, startImmediately );

};

Delay.prototype = Object.assign( Object.create( Clock.prototype ), {

	constructor: Delay,

	start: function() {

		if( this.started === true ) return this;

		this._timerID = setTimeout( this.callback, this.duration - this.elapsed );

		this.startTS = Aiga.now();
		this.started = true;
		this.paused = false;

		return this;

	},

	pause: function() {

		if( this.paused === true ) return this;

		this.paused = true;
		this.started = false;

		clearTimeout( this._timerID );

		var elapsed = this.elapsed;
		this.pauseTS = Aiga.now();
		this.elapsed = elapsed;

		return this;

	},

	dispose: function() {

		Delay_Pool.push( this );

		return undefined;

	}

} );
