/*
 * ***************************************************************************************
 * Filename		:	functions.js
 * Purpose		:	JavaScript file for slots game, starts/stop spin.
 * 					
 * Author		:	Rajesh Wadhwani
 * Created on	:	13-Mar-2010
 * Modified on	:	13-Mar-2010, 14-Mar-2010, 20-Mar-2010
 * Copyright	:	Rajesh Wadhwani, 2010
 * ***************************************************************************************/

var DEFAULT_START_VALUE = 7;
var GAME_TYPE_NUMBERS = "numbers";
var GAME_STARTED = 0;

var MIN_SPIN_VAL = 0;
var MAX_SPIN_VAL = 9;
var SPIN_SPEED = 1;
var SPEED_UP = 4;
var SPEED_UP_SLOT1 = SPEED_UP + 5;
var SPEED_UP_SLOT2 = SPEED_UP + 2;
var SPEED_UP_SLOT3 = SPEED_UP;
var SPIN_STOP = 240;

var MANUAL_SPIN = 20;

var speed = 0;
var spin_stopped = 0;											// Reset the spin_stopped for new/next game
var spin2_stopped = false;
var spin2_current_speed = 0;
var val_slot1 = 7;
var val_slot2 = 7;
var val_slot3 = 7;
var randval_img1 = 1;
var randval_img2 = 2;
var randval_img3 = 3;
	
var array_img_filenames = new Array("img1.jpg", "img2.gif", "img3.jpg", "img4.jpg", "img5.jpg");
var TOTAL_IMAGES = (array_img_filenames.length - 1);
var array_img = new Array();

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
 * starts) which turns red appropriately on similar slot stop or if player wins
 */
function resetBgColours() {
	document.getElementById('light-slot1').style.backgroundColor = '#CFCFCF';
	document.getElementById('light-slot2').style.backgroundColor = '#CFCFCF';
	document.getElementById('light-slot3').style.backgroundColor = '#CFCFCF';
}

/* *****************************************************************************
 * Function to reset some spin values before starting a new game (new spin)
 */
function resetValues() {						
	speed = 0;
	spin_stopped = 0;											// Reset the spin_stopped for new/next game
	spin2_stopped = false;
	spin2_current_speed = 0;
	GAME_STARTED = 0;
	
	document.frmBoard.spin.disabled = true;						// Disable the spin button until spin stops
	dummy_val = getGameType('disable');							// Call function with parameter to disable Game type radio buttons
	document.frmBoard.start_with.disabled = true;				// Disable the user option buttons/radio/checkbox
	document.frmBoard.start_with_value.disabled = true;
}

/* *****************************************************************************
 * Function to initially load images, only if 'Images' game type is selected by
 * the player.
 */
function loadGameType(type) {
	if (type == GAME_TYPE_NUMBERS) {
		// Pass the parameter value so this function skips setting slot's value from itself (if gtype changed from images to numbers)
		getStartWithValues(DEFAULT_START_VALUE);
	} else {
		for (var i=0; i<TOTAL_IMAGES; i++) {
			array_img[i] = new Image().src = "images/" + array_img_filenames[i];			// Pre-load images
		}
		getStartWithValues();
	}
	resetBgColours();
}

/* *****************************************************************************
 * Function to check and return the selected 'Game type' value (numbers/images)
 * But if parameter 'enable/disable' is supplied to this function, then it will
 * enable/disable all Game type radio buttons, as opposed to resetValues()
 */
function getGameType(status) {
	var gtype = GAME_TYPE_NUMBERS;								// Set default selected Game type
	var gtype_boxes = document.frmBoard.gtype;
	
	for (var i=0; i<gtype_boxes.length; i++) {
		if (gtype_boxes[i].checked) {
			gtype = gtype_boxes[i].value;
		}
		
		// Enable/disable Game type radio buttons
		if (status == "disable") { gtype_boxes[i].disabled = true; }
		else if (status == "enable") { gtype_boxes[i].disabled = false; }
	}
	return gtype;
}

/* *****************************************************************************
 * Function to immediately display 'Start with' numbers if user has ticked the
 * checkbox and changed the number from drop-down list.
 */
function updateStartWithValues() {
	var gtype = getGameType();
	if (gtype == GAME_TYPE_NUMBERS) {
		getStartWithValues();
	}
}

/* *****************************************************************************
 * Function to get Start 'spin' with values
 * It first checks if player has ticked box to start values with player selected
 *  value, otherwise it uses the slots' current value to start with
 */
function getStartWithValues(default_val_slot) {
	var frmObj = document.frmBoard;
	var gtype = getGameType();
		
	if (gtype == GAME_TYPE_NUMBERS) {
		// Check if player has ticked to start spin with player selected number, then initially set the spin values to that number
		if (frmObj.start_with.checked) {
			val_slot1 = frmObj.start_with_value.options[frmObj.start_with_value.selectedIndex].value;
			val_slot2 = frmObj.start_with_value.options[frmObj.start_with_value.selectedIndex].value;
			val_slot3 = frmObj.start_with_value.options[frmObj.start_with_value.selectedIndex].value;
		} else if (!default_val_slot) {
			val_slot1 = document.getElementById('slot1').innerHTML;		// Get initial values to start spin from there
			val_slot2 = document.getElementById('slot2').innerHTML;		// Get initial values to start spin from there
			val_slot3 = document.getElementById('slot3').innerHTML;		// Get initial values to start spin from there
		}
		
		document.getElementById('slot1').innerHTML = val_slot1;		// Get initial values to start spin from there
		document.getElementById('slot2').innerHTML = val_slot2;		// Get initial values to start spin from there
		document.getElementById('slot3').innerHTML = val_slot3;		// Get initial values to start spin from there
	} else {
		document.getElementById('slot1').innerHTML = "<img src=\"images/" + array_img_filenames[0] + "\" />";
		document.getElementById('slot2').innerHTML = "<img src=\"images/" + array_img_filenames[0] + "\" />";
		document.getElementById('slot3').innerHTML = "<img src=\"images/" + array_img_filenames[0] + "\" />";
	}
}

/* *****************************************************************************
 * Function to Start spinning the slot/wheel (slot 1-3)
 */
function spinWheel() {
	GAME_STARTED = 1;												// Game started
	
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
	var timer_slot2 = getRandomVal((timer_slot1 + getRandomVal(1, add_timer)), (max_timer + (add_timer - getRandomVal(3, add_timer))));
	var timer_slot3 = getRandomVal((timer_slot1 + getRandomVal(1, add_timer)), (max_timer + (add_timer - getRandomVal(1, add_timer))));
	
	//alert(timer_slot1 + " : " + timer_slot2 + " : " + timer_slot3);
	var gtype = getGameType();
	
	// Call functions to start spin in order 1, 2, 3
	setTimeout("spinSlot1(" + val_slot1 + ", " + timer_slot1 + ", 0, " + SPIN_SPEED + ", " + MANUAL_SPIN + ", '" + gtype + "')", getRandomVal(20, 20));
	setTimeout("spinSlot2(" + val_slot2 + ", " + timer_slot2 + ", 0, " + getRandomVal(1, (SPIN_SPEED - getRandomVal(3,7))) + ", " + MANUAL_SPIN + ", '" + gtype + "')", getRandomVal(125, 130));
	setTimeout("spinSlot3(" + val_slot3 + ", " + timer_slot3 + ", 0, " + getRandomVal(1, (SPIN_SPEED - getRandomVal(1,4))) + ", " + MANUAL_SPIN + ", '" + gtype + "')", getRandomVal(245, 250));
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
 * @param	gtype - Use this Game type for the whole of 1 round (spin) - Won't make sense to change numbers to images if user changes Game type while the wheel is spinning
 */
function spinSlot1(new_val, timer, speed, new_speed, manual_spin, gtype) {
	var manual_stop = manual_spin - 1;
	var val = new_val;
	if (speed < 1) { var speed = timer * (new_speed + SPEED_UP); }		// Initial speed of spin
	else { var speed = new_speed + SPEED_UP_SLOT1; }					// Increase speed on every call (slow down spin)
	
	if ((gtype == GAME_TYPE_NUMBERS) || (!gtype)) {
		if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }				// Get current value on slot (check max/min value)
		else { val = eval(new_val) + 1; }
		document.getElementById('slot1').innerHTML = val;
	} else {
		randval_img1 = getRandomVal(0,TOTAL_IMAGES);
		document.getElementById('slot1').innerHTML = "<img src=\"images/" + array_img_filenames[randval_img1] + "\" />";
	}
	
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) {
		window.setTimeout("spinSlot1(" + val + ", " + timer + ", " + speed + ", " + speed + ", " + manual_stop + ", '" + gtype + "')", speed);
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
 * @param	gtype - Use this Game type for the whole of 1 round (spin) - Won't make sense to change numbers to images if user changes Game type while the wheel is spinning
 */
function spinSlot2(new_val, timer, speed, new_speed, manual_spin, gtype) {
	var manual_stop = manual_spin - 1;
	var val = new_val;
	if (speed < 1) { var speed = timer * (new_speed + SPEED_UP); }		// Initial speed of spin
	else { var speed = new_speed + SPEED_UP_SLOT2; }					// Increase speed on every call (slow down spin)
	
	if ((gtype == GAME_TYPE_NUMBERS) || (!gtype)) {
		if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }				// Get current value on slot (check max/min value)
		else { val = eval(new_val) + 1; }
		document.getElementById('slot2').innerHTML = val;
	} else {
		randval_img2 = getRandomVal(0,TOTAL_IMAGES);
		document.getElementById('slot2').innerHTML = "<img src=\"images/" + array_img_filenames[randval_img2] + "\" />";
	}
	
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) {
		// Added this to slow down spin3's speed so it doesn't stop before spin 2 (happens in very rare cases)
		spin2_current_speed = speed;
		window.setTimeout("spinSlot2(" + val + ", " + timer + ", " + speed + ", " + speed + ", " + manual_stop + ", '" + gtype + "')", speed);
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
 * @param	gtype - Use this Game type for the whole of 1 round (spin) - Won't make sense to change numbers to images if user changes Game type while the wheel is spinning
 */
function spinSlot3(new_val, timer, speed, new_speed, manual_spin, gtype) {
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
	
	if ((gtype == GAME_TYPE_NUMBERS) || (!gtype)) {
		if (val >= MAX_SPIN_VAL) { val = MIN_SPIN_VAL; }				// Get current value on slot (check max/min value)
		else { val = eval(new_val) + 1; }
		document.getElementById('slot3').innerHTML = val;
	} else {
		randval_img3 = getRandomVal(0,TOTAL_IMAGES);
		document.getElementById('slot3').innerHTML = "<img src=\"images/" + array_img_filenames[randval_img3] + "\" />";
	}
	
	//if (manual_stop > 1)
	if (speed < SPIN_STOP) {
		window.setTimeout("spinSlot3(" + val + ", " + timer + ", " + speed + ", " + speed + ", " + manual_stop + ", '" + gtype + "')", speed);
	} else {
		var gtype = getGameType;
		
		if ( ((gtype == GAME_TYPE_NUMBERS) && ((document.getElementById('slot3').innerHTML == document.getElementById('slot2').innerHTML) && (document.getElementById('slot3').innerHTML == document.getElementById('slot1').innerHTML))) || ((randval_img3 == randval_img2) && (randval_img3 == randval_img1)) ) {			
			document.getElementById('light-slot1').style.backgroundColor = '#8E4835';
			document.getElementById('light-slot2').style.backgroundColor = '#8E4835';
			document.getElementById('light-slot3').style.backgroundColor = '#8E4835';
			// WON THE GAME
			updateScore('won');
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
		spin_stopped = 0;
		document.frmBoard.spin.disabled = false;					// Enable the spin button now
		document.frmBoard.spin.value = "SPIN AGAIN";
		dummy_val = getGameType('enable');							// Call function with parameter to enable Game type radio buttons
		document.frmBoard.start_with.disabled = false;				// Disable the user option buttons/radio/checkbox
		document.frmBoard.start_with_value.disabled = false;
	}
	GAME_STARTED = 0;												// Game no longer in running state - wheel spin stopped
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
		window.setTimeout('alert("Congratulations" + pname + "!! You won...");', 500);
	}
}