
var MIN_SPIN_VAL = 0;
var MAX_SPIN_VAL = 9;
var SPIN_SPEED = 1;
var SPEED_UP = 5;
var SPIN_STOP = 300;
var speed = 0;

var MANUAL_SPIN = 20;

/* *****************************************************************************
 * Function to set footer position on the site based on window/screen's height */
function setFooter() {
	var win_height = document.documentElement.clientHeight - 494;
	document.getElementById('footer').style.marginTop = win_height + "px";
}

/* *****************************************************************************
 * Function to return a random value between min and max values supplied
 * @param	min - Minimum value from...
 * @param	max - Maximum value to...
 * @return	A random integer value between min and max
 */
function getRandomVal(min, max) {
	return Math.round(min + (Math.random()*(max-min)));
}

function resetBgColours() {
	document.getElementById('slot1').style.backgroundColor = '#CFCFCF';
	document.getElementById('slot2').style.backgroundColor = '#CFCFCF';
	document.getElementById('slot3').style.backgroundColor = '#CFCFCF';
}

/* *****************************************************************************
 * Function to spin the wheel (slot 1-3) */
function spinWheel() {
	resetBgColours();
	document.frmBoard.spin.disabled = true;					// Disable the spin button until spin stops
	// Define varaibles to calculate the starting speed (++) of each slot spin
	var min_timer = 1;
	var max_timer = ((min_timer * 2) + getRandomVal(0, new Date().getHours()) * 2);
	var add_timer = getRandomVal(0, new Date().getSeconds());
	var timer_slot1 = getRandomVal(min_timer, max_timer);
	var timer_slot2 = getRandomVal((timer_slot1 + getRandomVal(1, add_timer)), (max_timer + (add_timer - getRandomVal(4, add_timer))));
	var timer_slot3 = getRandomVal((timer_slot2 + getRandomVal(1, add_timer)), (max_timer + (add_timer - getRandomVal(2, add_timer))));
	var val_slot1 = document.getElementById('slot1').innerHTML;
	var val_slot2 = document.getElementById('slot2').innerHTML;
	var val_slot3 = document.getElementById('slot3').innerHTML;
	
	setTimeout("spinSlot1(" + val_slot1 + ", " + timer_slot1 + ", " + SPIN_SPEED + ", " + MANUAL_SPIN + ")", getRandomVal(10, 100));
	setTimeout("spinSlot2(" + val_slot2 + ", " + timer_slot2 + ", " + getRandomVal(1, (SPIN_SPEED - getRandomVal(3,7))) + ", " + MANUAL_SPIN + ")", getRandomVal(110, 340));
	setTimeout("spinSlot3(" + val_slot3 + ", " + timer_slot3 + ", " + getRandomVal(1, (SPIN_SPEED - getRandomVal(1,4))) + ", " + MANUAL_SPIN + ")", getRandomVal(350, 530));
}

function spinSlot1(new_val, timer, new_speed, manual_spin) {
	var manual_stop = manual_spin - 1;
	var val = new_val;
	if (speed < 1) { var speed = timer * (new_speed + SPEED_UP); }
	else { speed = new_speed + SPEED_UP + 2; }
	if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }
	else { val = eval(new_val) + 1; }
	document.getElementById('slot1').innerHTML = val;
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) { window.setTimeout("spinSlot1(" + val + ", " + timer + ", " + speed + ", " + manual_stop + ")", speed); }
}

function spinSlot2(new_val, timer, new_speed, manual_spin) {
	var manual_stop = manual_spin - 1;
	var val = new_val;
	if (speed < 1) { var speed = timer * (new_speed + SPEED_UP); }
	else { speed = new_speed + SPEED_UP + 1; }
	if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }
	else { val = eval(new_val) + 1; }
	document.getElementById('slot2').innerHTML = val;
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) { window.setTimeout("spinSlot2(" + val + ", " + timer + ", " + speed + ", " + manual_stop + ")", speed); }
	else {
		if (document.getElementById('slot2').innerHTML == document.getElementById('slot1').innerHTML) {
			document.getElementById('slot1').style.backgroundColor = '#EDEF2C';
			document.getElementById('slot2').style.backgroundColor = '#EDEF2C';
		}
	}
}

function spinSlot3(new_val, timer, new_speed, manual_spin) {
	var manual_stop = manual_spin - 1;
	var val = new_val;
	if (speed < 1) { var speed = timer * (new_speed + SPEED_UP); }
	else { speed = new_speed + SPEED_UP; }
	if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }
	else { val = eval(new_val) + 1; }
	document.getElementById('slot3').innerHTML = val;
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) { window.setTimeout("spinSlot3(" + val + ", " + timer + ", " + speed + ", " + manual_stop + ")", speed); }
	else {
		document.frmBoard.spin.disabled = false;					// Enable the spin button now
		if ((document.getElementById('slot3').innerHTML == document.getElementById('slot2').innerHTML) && (document.getElementById('slot3').innerHTML == document.getElementById('slot1').innerHTML)) {
			alert('Congratulations!! You won...');
			document.getElementById('slot1').style.backgroundColor = '#EDEF2C';
			document.getElementById('slot2').style.backgroundColor = '#EDEF2C';
			document.getElementById('slot3').style.backgroundColor = '#EDEF2C';
		} else if (document.getElementById('slot3').innerHTML == document.getElementById('slot1').innerHTML) {
			document.getElementById('slot1').style.backgroundColor = '#EDEF2C';
			document.getElementById('slot3').style.backgroundColor = '#EDEF2C';
		} else if (document.getElementById('slot3').innerHTML == document.getElementById('slot2').innerHTML) {
			document.getElementById('slot2').style.backgroundColor = '#EDEF2C';
			document.getElementById('slot3').style.backgroundColor = '#EDEF2C';
		} 
	}
}