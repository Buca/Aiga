function Loop( options = {} ) {

	var _ticks,
		_lastTickTS,
		_elapsedSinceTick,
		_rate,
		
		_callback,
		_context,

		_started = false,

		_timerID,
		_timerFn = function() {

			_lastTickTS = Aiga.now();
			_ticks ++;

			if( _callback !== undefined ) _callback();

			if( _started === true ) {

				var duration = Math.floor( _rate - ( Aiga.now() - _lastTickTS ) );

				if( duration < 2 ) _timerFn();
				else _timerID = setTimeout( _timerFn, duration );

			}

		};

	Object.defineProperty( this, 'ticks', {

		set: function( value ) {

			_ticks = Math.max( 0, value );

		},

		get: function() {

			return _ticks;

		}

	} );

	Object.defineProperty( this, 'rate', {

		set: function( value ) {

			var elapsed = Aiga.now() - _lastTickTS;

			_rate = Math.max( value );

			if( _started === true ) {

				_timerID = clearTimeout( _timerID );

				if( elapsed >= _rate ) {

					_timerFn();

				}

				else {

					_timerID = setTimeout( _timerFn, _rate - elapsed );

				}

			}

		},

		get: function() {

			return _rate;

		}

	} );

	Object.defineProperty( this, 'callback', {

		set: function( callback ) {

			_callback = _context !== undefined ? callback.bind( _context ) : callback;

			if( _started === true ) {

				_timerID = clearTimeout( _timerID );
				_timerID = setTimeout( _timerFn, _rate - ( Aiga.now() - _lastTickTS ) );

			}			

		},

		get: function() {

			return _callback;

		}

	} );

	Object.defineProperty( this, 'context', {

		set: function( context ) {

			_context = context;

			if( _callback !== undefined ) _callback = _callback.bind( _context );

			if( _started === true ) {

				_timerID = clearTimeout( _timerID );
				_timerID = setTimeout( _timerFn, _rate - ( Aiga.now() - _lastTickTS ) );

			}

		},

		get: function() {

			return _context;

		}

	} );

	Object.defineProperty( this, 'started', {

		set: function( value ) {

			if( _started === false && value === true ) {

				_started = true;

				if( _rate - 1 < _elapsedSinceTick && _elapsedSinceTick < _rate + 1 ) {

					_timerFn();

				}

				else {

					_timeID = setTimeout( _timerFn, Math.floor( _rate - _elapsedSinceTick ) );

				}

			}

			else if( _started === true && value === false ) {

				_started = false;

				_elapsedSinceTick = Aiga.now() - _lastTickTS;

				_timerID = clearTimeout( _timerID );

			}

		},

		get: function() {

			return _started;

		}

	} );

	Object.defineProperty( this, 'paused', {

		set: function( value ) {

			this.started = !value;

		},

		get: function() {

			return !_started;

		}

	} );

	this.reset( options );

	return this;

};

const Loop_Pool = [];

Loop.create = function( options = {} ) {

	if( Loop_Pool.length !== 0 ) {

		var loop = Loop_Pool.pop();

		loop.reset( options );

		return loop;

	}

	return new Pool( options );

};

Loop.DEFAULTS = {

	ticks: 0,
	rate: 1000,
	callback: undefined,
	context: undefined,
	started: true

};

Object.assign( Loop.prototype, {

	start: function() {

		this.started = true;

		return this;

	},

	pause: function() {

		this.paused = true;

		return this;

	},

	reset: function( options ) {

		this.ticks = options.ticks !== undefined ? options.ticks : 0;
		this.rate = options.rate !== undefined ? options.rate : 1000;
		this.callback = options.callback !== undefined ? options.callback : undefined;
		this.context = options.context !== undefined ? options.context : undefined;
		this.started = options.started !== undefined ? options.started : true;
		this.paused = options.paused !== undefined ? options.paused : !this.started;

		return this;

	},

	dispose: function() {

		Loop_Pool.push( this );

		return undefined;

	}

} );
