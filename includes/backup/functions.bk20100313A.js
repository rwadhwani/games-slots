
var MIN_SPIN_VAL = 0;
var MAX_SPIN_VAL = 9;
var SPIN_SPEED = 1;
var SPEED_UP = 10;
var SPIN_STOP = 320;

var MANUAL_SPIN = 20;

function setFooter() {
	var win_height = document.documentElement.clientHeight - 494;
	document.getElementById('footer').style.marginTop = win_height + "px";
}

function getRandomVal(min, max) {
	return Math.round(min + (Math.random()*(max-min)));
}

function spinWheel() {
	var min_timer = 5;
	var max_timer = 20;
	var add_timer = 10;
	var timer_slot1 = getRandomVal(min_timer, max_timer);
	var timer_slot2 = getRandomVal((timer_slot1 + getRandomVal(1, add_timer)), (max_timer + (add_timer - getRandomVal(4, add_timer))));
	var timer_slot3 = getRandomVal((timer_slot2 + getRandomVal(1, add_timer)), (max_timer + (add_timer - getRandomVal(4, add_timer))));
	var val_slot1 = document.getElementById('slot1').innerHTML;
	var val_slot2 = document.getElementById('slot2').innerHTML;
	var val_slot3 = document.getElementById('slot3').innerHTML;
	
	spinSlot1(val_slot1, timer_slot1, SPIN_SPEED);
	//spinSlot2(val_slot2, timer_slot2, SPIN_SPEED);
	//spinSlot3(val_slot3, timer_slot3, SPIN_SPEED);
}

function spinSlot1(new_val, timer, new_speed, manual_spin) {
	var counter = manual_spin - 1;
	var val = new_val;
	if (speed < 1) { var speed = timer * (new_speed + SPEED_UP); }
	else { speed = new_speed + SPEED_UP; }
	if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }
	else { val = eval(new_val) + 1; }
	document.getElementById('slot1').innerHTML = val;
	if (speed < SPIN_STOP) {
		//alert('counter: ' + counter + '\n speed: ' + speed + '\nspeed_up: ' + SPEED_UP + '\nval: ' + val + '\nnew_speed+UP = ' + (new_speed + SPEED_UP));
		window.setTimeout("spinSlot1(" + val + ", " + timer + ", " + speed + ", " + counter + ")", speed);
	}
}