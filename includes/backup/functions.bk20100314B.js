/*
 * ***************************************************************************************
 * Filename		:	functions.js
 * Purpose		:	JavaScript file for slots game, starts/stop spin.
 * 					
 * Author		:	Rajesh Wadhwani
 * Created on	:	13-Mar-2010
 * Modified on	:	13-Mar-2010, 14-Mar-2010
 * Copyright	:	Rajesh Wadhwani, 2010
 * ***************************************************************************************/


var MIN_SPIN_VAL = 0;
var MAX_SPIN_VAL = 9;
var SPIN_SPEED = 1;
var SPEED_UP = 4;
var SPEED_UP_SLOT1 = SPEED_UP + 5;
var SPEED_UP_SLOT2 = SPEED_UP + 2;
var SPEED_UP_SLOT3 = SPEED_UP;
var SPIN_STOP = 220;

var MANUAL_SPIN = 20;

var speed = 0;
var spin_stopped = 0;											// Reset the spin_stopped for new/next game
var spin2_stopped = false;
var spin2_current_speed = 0;
var val_slot1 = 7;
var val_slot2 = 7;
var val_slot3 = 7;

/* *****************************************************************************
 * Function to set footer position on the site based on window/screen's height
 */
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
 * starts) which turns red appropriately on similar slot stop or if user wins
 */
function resetBgColours() {
	document.getElementById('light-slot1').style.backgroundColor = '#CFCFCF';
	document.getElementById('light-slot2').style.backgroundColor = '#CFCFCF';
	document.getElementById('light-slot3').style.backgroundColor = '#CFCFCF';
}

/*
 * Function to reset some spin values before starting a new game (new spin)
 */
function resetValues() {						
	speed = 0;
	spin_stopped = 0;											// Reset the spin_stopped for new/next game
	spin2_stopped = false;
	spin2_current_speed = 0;
	
	document.frmBoard.spin.disabled = true;						// Disable the spin button until spin stops
}

/* *****************************************************************************
 * Function to get Start 'spin' with values
 * It first checks if user has ticked box to start values with user selected value,
 * otherwise it uses the slots' current value to start with
 */
function getStartWithValues() {
	var frmObj = document.frmBoard;
	
	// Check if user has ticked to start spin with user selected number, then initially set the spin values to that number
	if (frmObj.start_with.checked) {
		val_slot1 = frmObj.start_with_value.options[frmObj.start_with_value.selectedIndex].value;
		val_slot2 = frmObj.start_with_value.options[frmObj.start_with_value.selectedIndex].value;
		val_slot3 = frmObj.start_with_value.options[frmObj.start_with_value.selectedIndex].value;
		
		document.getElementById('slot1').innerHTML = val_slot1;		// Get initial values to start spin from there
		document.getElementById('slot2').innerHTML = val_slot2;		// Get initial values to start spin from there
		document.getElementById('slot3').innerHTML = val_slot3;		// Get initial values to start spin from there
	} else {
		val_slot1 = document.getElementById('slot1').innerHTML;		// Get initial values to start spin from there
		val_slot2 = document.getElementById('slot2').innerHTML;		// Get initial values to start spin from there
		val_slot3 = document.getElementById('slot3').innerHTML;		// Get initial values to start spin from there
	}
}

/* *****************************************************************************
 * Function to Start spinning the slot/wheel (slot 1-3)
 */
function spinWheel() {
	resetBgColours();
	resetValues();
	getStartWithValues();
	
	updateScore('total_times_played');								// Update 'Total times played'
	updateScore('total_played_numbers');							// Update 'Total times played with numbers'
	
	// Define varaibles to calculate the starting speed (++) of each slot
	var min_timer = 1;												// Minimum speed timer for slot spin
	var max_timer = ((min_timer * 4) + (getRandomVal(0, new Date().getHours()) * 2));		// Calculate naturally by double hour
	var add_timer = 3 + (getRandomVal(0, new Date().getSeconds()));	// Used for slot 2 and 3 for further delay on start spin + spin timer
	var timer_slot1 = getRandomVal(min_timer, max_timer);
	var timer_slot2 = getRandomVal((timer_slot1 + getRandomVal(1, add_timer)), (max_timer + (add_timer - getRandomVal(1, add_timer))));
	var timer_slot3 = getRandomVal((timer_slot1 + getRandomVal(1, add_timer)), (max_timer + (add_timer - getRandomVal(3, add_timer))));
	
	// Call functions to start spin in order 1, 2, 3
	setTimeout("spinSlot1(" + val_slot1 + ", " + timer_slot1 + ", 0, " + SPIN_SPEED + ", " + MANUAL_SPIN + ")", getRandomVal(20, 20));
	setTimeout("spinSlot2(" + val_slot2 + ", " + timer_slot2 + ", 0, " + getRandomVal(1, (SPIN_SPEED - getRandomVal(3,7))) + ", " + MANUAL_SPIN + ")", getRandomVal(125, 130));
	setTimeout("spinSlot3(" + val_slot3 + ", " + timer_slot3 + ", 0, " + getRandomVal(1, (SPIN_SPEED - getRandomVal(1,4))) + ", " + MANUAL_SPIN + ")", getRandomVal(245, 250));
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
	if (speed < 1) { var speed = timer * (new_speed + SPEED_UP); }		// Initial speed of spin
	else { var speed = new_speed + SPEED_UP_SLOT1; }					// Increase speed on every call (slow down spin)
	if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }					// Get current value on slot (check max/min value)
	else { val = eval(new_val) + 1; }
	document.getElementById('slot1').innerHTML = val;
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) {
		window.setTimeout("spinSlot1(" + val + ", " + timer + ", " + speed + ", " + speed + ", " + manual_stop + ")", speed);
	} else {
		spin_stopped++;
		playAgain('spin1');
	}
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
	if (speed < 1) { var speed = timer * (new_speed + SPEED_UP); }		// Initial speed of spin
	else { var speed = new_speed + SPEED_UP_SLOT2; }					// Increase speed on every call (slow down spin)
	if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }					// Get current value on slot (check max/min value)
	else { val = eval(new_val) + 1; }
	document.getElementById('slot2').innerHTML = val;
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) {
		// Added this to slow down spin3's speed so it doesn't stop before spin 2 (happens in very rare cases)
		spin2_current_speed = speed;
		window.setTimeout("spinSlot2(" + val + ", " + timer + ", " + speed + ", " + speed + ", " + manual_stop + ")", speed);
	} else {
		spin2_stopped = true;
		spin_stopped++;
		if (document.getElementById('slot2').innerHTML == document.getElementById('slot1').innerHTML) {
			document.getElementById('light-slot1').style.backgroundColor = '#8E4835';
			document.getElementById('light-slot2').style.backgroundColor = '#8E4835';
		}
		
		playAgain('spin2');
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
	if (speed < 1) { var speed = timer * (new_speed + SPEED_UP); }		// Initial speed of spin
	else {
		// Check if spin 2 has not stopped and is about to stop, then slow down spin 3 speed
		// This condition will not be true if spin 2 failed to run as spin2_current_speed will have no value
		// Until spin 2 goes slow, spin 3 will spin fast
		if ((spin2_stopped == false) && (spin2_current_speed > ((SPIN_STOP / 2) + 90))) {
			var speed = new_speed + 1;									// Increase little speed on every call
		} else {
			var speed = new_speed + SPEED_UP_SLOT3;						// Increase speed on every call (slow down spin)
		}
	}
	if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }					// Get current value on slot (check max/min value)
	else { val = eval(new_val) + 1; }
	document.getElementById('slot3').innerHTML = val;
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) {
		window.setTimeout("spinSlot3(" + val + ", " + timer + ", " + speed + ", " + speed + ", " + manual_stop + ")", speed);
	} else {
		if ((document.getElementById('slot3').innerHTML == document.getElementById('slot2').innerHTML) && (document.getElementById('slot3').innerHTML == document.getElementById('slot1').innerHTML)) {
			// WON THE GAME
			updateScore('won');
			
			document.getElementById('light-slot1').style.backgroundColor = '#8E4835';
			document.getElementById('light-slot2').style.backgroundColor = '#8E4835';
			document.getElementById('light-slot3').style.backgroundColor = '#8E4835';
		} else {
			if (document.getElementById('slot3').innerHTML == document.getElementById('slot1').innerHTML) {
				document.getElementById('light-slot1').style.backgroundColor = '#8E4835';
				document.getElementById('light-slot3').style.backgroundColor = '#8E4835';
			} else if (document.getElementById('slot3').innerHTML == document.getElementById('slot2').innerHTML) {
				document.getElementById('light-slot2').style.backgroundColor = '#8E4835';
				document.getElementById('light-slot3').style.backgroundColor = '#8E4835';
			}
			spin_stopped++;
			if (spin_stopped >= 2) {					// Used >= Just in case one of the spin fails to run (JavaScript issue may be)
				// LOST THE GAME
				updateScore('lost');
			}
		}
		
		playAgain('spin3');
	}
}

/* *****************************************************************************
 * Function to enable the SPIN button for new game (next play), called by all 3
 * spin functions when they stop spinning
 */
function playAgain(called_by) {
	if ((called_by == 'spin3') && (spin_stopped < 3)) { spin_stopped++; }
	if (spin_stopped > 2) {
		document.frmBoard.spin.disabled = false;					// Enable the spin button now
		document.frmBoard.spin.value = "SPIN AGAIN";
	}
}

/* *****************************************************************************
 * Function to update the requested score on the game board and Congratulate the player if they won
 * @param	scoreID - The element ID of the score to update by 1
 */
function updateScore(scoreID) {
	var score = eval(document.getElementById(scoreID).innerHTML) + 1;
	document.getElementById(scoreID).innerHTML = score;
	if (scoreID == 'won') {
		pname = document.frmBoard.pname.value;						// Get player's name if provided
		if (pname != "") { pname = " " + pname; }
		alert("Congratulations" + pname + "!! You won...");
	}
}