
var MIN_SPIN_VAL = 0;
var MAX_SPIN_VAL = 9;
var SPIN_SPEED = 1;
var SPEED_UP = 4;
var SPEED_UP_SLOT1 = SPEED_UP + 5;
var SPEED_UP_SLOT2 = SPEED_UP + 2;
var SPEED_UP_SLOT3 = SPEED_UP;
var SPIN_STOP = 280;
var speed = 0;

var MANUAL_SPIN = 20;

/* *****************************************************************************
 * Function to set footer position on the site based on window/screen's height */
function setFooter() {
	var win_height = document.documentElement.clientHeight - 489;
	document.getElementById('footer').style.marginTop = win_height + "px";
}

/* *****************************************************************************
 * Function to return a random value between min and max values supplied
 * @param	min - Minimum value from...
 * @param	max - Maximum value to...
 * @return	A random integer value between min and max
 */
function getRandomVal(min, max) {
	return Math.round(min + (Math.random()*(max - min)));
}

/* *****************************************************************************
 * Function to reset background colours of the 3 infobar initially (before spin 
 * starts) which turns red appropriately on similar slot stop or if user wins */
function resetBgColours() {
	document.getElementById('light-slot1').style.backgroundColor = '#CFCFCF';
	document.getElementById('light-slot2').style.backgroundColor = '#CFCFCF';
	document.getElementById('light-slot3').style.backgroundColor = '#CFCFCF';
}

/* *****************************************************************************
 * Function to Start spinning the slot/wheel (slot 1-3) */
function spinWheel() {
	resetBgColours();
	document.frmBoard.spin.disabled = true;							// Disable the spin button until spin stops
	
	var total_times_played = eval(document.getElementById('total_times_played').innerHTML) + 1;
	var total_played_numbers = eval(document.getElementById('total_played_numbers').innerHTML) + 1;
	document.getElementById('total_times_played').innerHTML = total_times_played;
	document.getElementById('total_played_numbers').innerHTML = total_played_numbers;
	
	// Define varaibles to calculate the starting speed (++) of each slot
	var min_timer = 1;												// Minimum speed timer for slot spin
	var max_timer = ((min_timer * 4) + (getRandomVal(0, new Date().getHours()) * 2));		//Calculate naturally by double hour
	var add_timer = getRandomVal(0, new Date().getSeconds());		// Used for slot 2 and 3 for further delay on start spin + spin timer
	var timer_slot1 = getRandomVal(min_timer, max_timer);
	var timer_slot2 = getRandomVal((timer_slot1 + getRandomVal(1, add_timer)), (max_timer + (add_timer - getRandomVal(3, add_timer))));
	var timer_slot3 = getRandomVal((timer_slot2 + getRandomVal(1, add_timer)), (max_timer + (add_timer - getRandomVal(1, add_timer))));
	var val_slot1 = document.getElementById('slot1').innerHTML;		// Get initial values to start spin from there
	var val_slot2 = document.getElementById('slot2').innerHTML;		// Get initial values to start spin from there
	var val_slot3 = document.getElementById('slot3').innerHTML;		// Get initial values to start spin from there
	
	// Call functions to start spin in order 1, 2, 3
	setTimeout("spinSlot1(" + val_slot1 + ", " + timer_slot1 + ", 0, " + SPIN_SPEED + ", " + MANUAL_SPIN + ")", getRandomVal(5, 10));
	setTimeout("spinSlot2(" + val_slot2 + ", " + timer_slot2 + ", 0, " + getRandomVal(1, (SPIN_SPEED - getRandomVal(3,7))) + ", " + MANUAL_SPIN + ")", getRandomVal(105, 110));
	setTimeout("spinSlot3(" + val_slot3 + ", " + timer_slot3 + ", 0, " + getRandomVal(1, (SPIN_SPEED - getRandomVal(1,4))) + ", " + MANUAL_SPIN + ")", getRandomVal(205, 210));
}

/* *****************************************************************************
 * Function to Start slot 1 spin and continue to call itself (recursive) and
 * slowing down the timer (increasing the speed - macroseconds pause for next 
 * function call to itself), and stop at SPIN_STOP
 * @param	new_val - New value to appear on the slot
 * @param	timer - Calculated before the slot starts spin, and stays the same throughout (until this slot stops spinning)
 * @param	speed - Initially set to 0 to get the pick up spped on spin start, then the value contains new increased speed
 * @param	new_speed - Initially set to SPIN_SPEED, then the values contains new increased speed
 * @param	manual_spin - For debugging purpose, spin can be controlled manually (run xx number of times only)
 */
function spinSlot1(new_val, timer, speed, new_speed, manual_spin) {
	var manual_stop = manual_spin - 1;
	var val = new_val;
	if ((!speed) || (speed < 1)) { var speed = timer * (new_speed + SPEED_UP); }		// Initial speed of spin
	else { speed = new_speed + SPEED_UP_SLOT1; }										// Increase speed on every call (slow down spin)
	if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }									// Get current value on slot (check max/min value)
	else { val = eval(new_val) + 1; }
	document.getElementById('slot1').innerHTML = val;
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) { window.setTimeout("spinSlot1(" + val + ", " + timer + ", " + speed + ", " + speed + ", " + manual_stop + ")", speed); }
}

/* *****************************************************************************
 * Function to Start slot 2 spin and continue to call itself (recursive) and
 * slowing down the timer (increasing the speed - macroseconds pause for next 
 * function call to itself), and stop at SPIN_STOP
 * @param	new_val - New value to appear on the slot
 * @param	timer - Calculated before the slot starts spin, and stays the same throughout (until this slot stops spinning)
 * @param	speed - Initially set to 0 to get the pick up spped on spin start, then the value contains new increased speed
 * @param	new_speed - Initially set to SPIN_SPEED, then the values contains new increased speed
 * @param	manual_spin - For debugging purpose, spin can be controlled manually (run xx number of times only)
 */
function spinSlot2(new_val, timer, speed, new_speed, manual_spin) {
	var manual_stop = manual_spin - 1;
	var val = new_val;
	if ((!speed) || (speed < 1)) { var speed = timer * (new_speed + SPEED_UP); }		// Initial speed of spin
	else { speed = new_speed + SPEED_UP_SLOT2; }										// Increase speed on every call (slow down spin)
	if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }									// Get current value on slot (check max/min value)
	else { val = eval(new_val) + 1; }
	document.getElementById('slot2').innerHTML = val;
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) { window.setTimeout("spinSlot2(" + val + ", " + timer + ", " + speed + ", " + speed + ", " + manual_stop + ")", speed); }
	else {
		if (document.getElementById('slot2').innerHTML == document.getElementById('slot1').innerHTML) {
			document.getElementById('light-slot1').style.backgroundColor = '#8E4835';
			document.getElementById('light-slot2').style.backgroundColor = '#8E4835';
		}
	}
}

/* *****************************************************************************
 * Function to Start slot 3 spin and continue to call itself (recursive) and
 * slowing down the timer (increasing the speed - macroseconds pause for next 
 * function call to itself), and stop at SPIN_STOP 
 * @param	new_val - New value to appear on the slot
 * @param	timer - Calculated before the slot starts spin, and stays the same throughout (until this slot stops spinning)
 * @param	speed - Initially set to 0 to get the pick up spped on spin start, then the value contains new increased speed
 * @param	new_speed - Initially set to SPIN_SPEED, then the values contains new increased speed
 * @param	manual_spin - For debugging purpose, spin can be controlled manually (run xx number of times only)
 */
function spinSlot3(new_val, timer, speed, new_speed, manual_spin) {
	var manual_stop = manual_spin - 1;
	var val = new_val;
	if ((!speed) || (speed < 1)) { var speed = timer * (new_speed + SPEED_UP); }		// Initial speed of spin
	else { speed = new_speed + SPEED_UP_SLOT3; }										// Increase speed on every call (slow down spin)
	if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }									// Get current value on slot (check max/min value)
	else { val = eval(new_val) + 1; }
	document.getElementById('slot3').innerHTML = val;
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) { window.setTimeout("spinSlot3(" + val + ", " + timer + ", " + speed + ", " + speed + ", " + manual_stop + ")", speed); }
	else {
		document.frmBoard.spin.disabled = false;					// Enable the spin button now
		document.frmBoard.spin.value = "SPIN AGAIN";
		
		if ((document.getElementById('slot3').innerHTML == document.getElementById('slot2').innerHTML) && (document.getElementById('slot3').innerHTML == document.getElementById('slot1').innerHTML)) {
			pname = document.frmBoard.pname.value;
			var won = eval(document.getElementById('won').innerHTML) + 1;
			document.getElementById('won').innerHTML = won;
			alert("Congratulations" + pname + "!! You won...");
			
			document.getElementById('light-slot1').style.backgroundColor = '#8E4835';
			document.getElementById('light-slot2').style.backgroundColor = '#8E4835';
			document.getElementById('light-slot3').style.backgroundColor = '#8E4835';
		} else if (document.getElementById('slot3').innerHTML == document.getElementById('slot1').innerHTML) {
			document.getElementById('light-slot1').style.backgroundColor = '#8E4835';
			document.getElementById('light-slot3').style.backgroundColor = '#8E4835';
		} else if (document.getElementById('slot3').innerHTML == document.getElementById('slot2').innerHTML) {
			document.getElementById('light-slot2').style.backgroundColor = '#8E4835';
			document.getElementById('light-slot3').style.backgroundColor = '#8E4835';
		} else {
			// LOST THE GAME
			var lost = eval(document.getElementById('lost').innerHTML) + 1;
			document.getElementById('lost').innerHTML = lost;
		}
	}
}