const Aiga = ( function() {

	this.sessionTS = Date.now();

	return this;

} )();

Aiga.HighResolution = true;

Aiga.now = function() {

	var dateNow = Date.now();

	if( Aiga.HighResolution === false ) return dateNow;

	var perfNow = performance.now();

	return dateNow + perfNow - Math.floor( perfNow );

};

Aiga.sessionNow = function() {

	return Aiga.now() - Aiga.sessionTS;

};

Aiga.Clock = Clock;
Aiga.Delay = Delay;
Aiga.Loop = Loop;
