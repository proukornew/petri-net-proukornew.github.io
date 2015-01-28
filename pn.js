var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 800,
    height: 800,
    gridSize: 10,
    perpendicularLinks: true,
    model: graph
});

var pn = joint.shapes.pn;

//var p1 = new pn.Place({ position: { x: 150, y: 50 }, tokens: 1 });
var p1 = new pn.Place({ position: { x: 150, y: 50 }, tokens: 1 });
var p2 = new pn.Place({ position: { x: 550, y: 50 }, tokens: 1 });
var p3 = new pn.Place({ position: { x: 150, y: 250 }, tokens: 0 });
var p4 = new pn.Place({ position: { x: 350, y: 250 }, tokens: 1 });
var p5 = new pn.Place({ position: { x: 550, y: 250 }, tokens: 0 });
var p6 = new pn.Place({ position: { x: 150, y: 450 }, tokens: 0 });
var p7 = new pn.Place({ position: { x: 550, y: 450 }, tokens: 0 });

var t1 = new pn.Transition({ position: { x: 170, y: 150 } }).rotate(90);
var t2 = new pn.Transition({ position: { x: 570, y: 150 } }).rotate(90);
var t3 = new pn.Transition({ position: { x: 170, y: 350 } }).rotate(90);
var t4 = new pn.Transition({ position: { x: 570, y: 350 } }).rotate(90);
var t5 = new pn.Transition({ position: { x: 370, y: 550 } }).rotate(90);


function link(a, b) {

    return new pn.Link({
        source: { id: a.id, selector: '.root' },
        target: { id: b.id, selector: '.root' },
    });
}

graph.addCell([ p1, p2, p3, p4, p5, p6, p7, t1, t2, t3, t4, t5 ]);

graph.addCell([
    link(p1, t1),
    link(p4, t1),
    link(t1, p3),
    link(p3, t3),
    link(t3, p6),
    link(t3, p4),
    link(p6, t5),
    link(t5, p1),
    link(t5, p2),
    link(p2, t2),
    link(t2, p5),
    link(p5, t4),
    link(t4, p4),
    link(t4, p7),
    link(p7, t5),
    link(p4, t2),
]);


function fireTransition(t, sec) {
	var inbound = graph.getConnectedLinks(t, { inbound: true });
	var outbound = graph.getConnectedLinks(t, { outbound: true });
	
	var placesBefore = _.map(inbound, function(link) { return graph.getCell(link.get('source').id); });
	var placesAfter = _.map(outbound, function(link) { return graph.getCell(link.get('target').id); });
	_.each(placesBefore, function(p) {
	// Let the execution finish before adjusting the value of tokens. So that we can loop over all transitions
	// and call fireTransition() on the original number of tokens.
	p.set('tokens', p.get('tokens') - 1);
	var link = _.find(inbound, function(l) { return l.get('source').id === p.id; });
		paper.findViewByModel(link).sendToken(V('circle', { r: 5, fill: 'red' }).node, sec * 1000);
	});

	_.each(placesAfter, function(p) {
		var link = _.find(outbound, function(l) { return l.get('target').id === p.id; });
		paper.findViewByModel(link).sendToken(V('circle', { r: 5, fill: 'red' }).node, sec * 1000, function() {
			p.set('tokens', p.get('tokens') + 1);
		});
	});
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function simulate() {
	var transitions = [t1, t2, t3, t4, t5];
	var rTransitions = [];
    
	_.each(transitions, function(t) {
	var inbound = graph.getConnectedLinks(t, { inbound: true });
   	var outbound = graph.getConnectedLinks(t, { outbound: true });

	var placesBefore = _.map(inbound, function(link) { return graph.getCell(link.get('source').id); });
    	var placesAfter = _.map(outbound, function(link) { return graph.getCell(link.get('target').id); });

	var isFirable = true;
	_.each(placesBefore, function(p) { if (p.get('tokens') == 0) isFirable = false; });
		if(isFirable) rTransitions.push(t);
		isFirable = true;
	});
	//console.info(JSON.stringify(rTransitions));
	console.log(rTransitions.length);
	fireTransition(rTransitions[getRandomInt(0, rTransitions.length -1 )], 1);
	setTimeout(simulate, 2000);
}

function stopSimulation(simulationId) {
	clearInterval(simulationId);
}

var simulationId = simulate();




