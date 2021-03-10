/*
*   This file is part of Sim2Editor
*   Copyright (C) 2020-2021 Universal-Team
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*   Additional Terms 7.b and 7.c of GPLv3 apply to this file:
*       * Requiring preservation of specified reasonable legal notices or
*         author attributions in that material or in the Appropriate Legal
*         Notices displayed by works containing it.
*       * Prohibiting misrepresentation of the origin of that material,
*         or requiring that modified versions of such material be marked in
*         reasonable ways as different from the original version.
*/

import { ActiveSlot } from './slot-menu.js';

/* Initialize the Main Editor. */
export function MainEditorInit() {
	if (ActiveSlot) { // Ensure it's not undefined first.
		document.getElementById("MainEditorMenu").classList.remove("showNone");

		/* General. */
		document.getElementById("Main_SimName").value = ActiveSlot.GetName();
		document.getElementById("Main_Simoleons").value = ActiveSlot.GetSimoleons();
		document.getElementById("Main_Ratings").value = ActiveSlot.GetRating();
		document.getElementById("Main_Hour").value = ActiveSlot.GetTime()[0];
		document.getElementById("Main_Minute").value = ActiveSlot.GetTime()[1];

		/* Collectables Amount + Sell Price. */
		document.getElementById("Main_Cans_Amount").value = ActiveSlot.GetCans();
		document.getElementById("Main_Cans_Price").value = ActiveSlot.GetCansPrice();

		document.getElementById("Main_Cowbells_Amount").value = ActiveSlot.GetCowbells();
		document.getElementById("Main_Cowbells_Price").value = ActiveSlot.GetCowbellsPrice();

		document.getElementById("Main_SpaceshipParts_Amount").value = ActiveSlot.GetSpaceship();
		document.getElementById("Main_SpaceshipParts_Price").value = ActiveSlot.GetSpaceshipPrice();

		document.getElementById("Main_Fuelrods_Amount").value = ActiveSlot.GetFuelrods();
		document.getElementById("Main_Fuelrods_Price").value = ActiveSlot.GetFuelrodsPrice();
	}
};
/* Hide the Main Editor. */
export function MainEditorHide() { document.getElementById("MainEditorMenu").classList.add("showNone"); };


/* General -> SimName. */
document.getElementById("Main_SimName").onchange = function() {
	ActiveSlot.SetName(document.getElementById("Main_SimName").value);
	document.getElementById("Main_SimName").value = ActiveSlot.GetName();
};

/* General -> Simoleons. */
document.getElementById("Main_Simoleons").onchange = function() {
	ActiveSlot.SetSimoleons(document.getElementById("Main_Simoleons").value);
	document.getElementById("Main_Simoleons").value = ActiveSlot.GetSimoleons();
};
document.getElementById("Main_MinSimoleons").onclick = function() {
	ActiveSlot.SetSimoleons(0);
	document.getElementById("Main_Simoleons").value = ActiveSlot.GetSimoleons();
};
document.getElementById("Main_MaxSimoleons").onclick = function() {
	ActiveSlot.SetSimoleons(999999);
	document.getElementById("Main_Simoleons").value = ActiveSlot.GetSimoleons();
};

/* General -> Ratings. */
document.getElementById("Main_Ratings").onchange = function() {
	ActiveSlot.SetRating(document.getElementById("Main_Ratings").value);
	document.getElementById("Main_Ratings").value = ActiveSlot.GetRating();
};
document.getElementById("Main_MinRatings").onclick = function() {
	ActiveSlot.SetRating(0);
	document.getElementById("Main_Ratings").value = ActiveSlot.GetRating();
};
document.getElementById("Main_MaxRatings").onclick = function() {
	ActiveSlot.SetRating(9999);
	document.getElementById("Main_Ratings").value = ActiveSlot.GetRating();
};

/* General -> Time. */
function TimeSet() {
	let time = new Uint8Array(0x2);
	time[0] = document.getElementById("Main_Hour").value;
	time[1] = document.getElementById("Main_Minute").value;
	ActiveSlot.SetTime(time);

	/* Refresh. */
	document.getElementById("Main_Hour").value = ActiveSlot.GetTime()[0];
	document.getElementById("Main_Minute").value = ActiveSlot.GetTime()[1];
};
document.getElementById("Main_Hour").onchange = () => TimeSet();
document.getElementById("Main_Minute").onchange = () => TimeSet();


/* Collectables -> Empty Chug-Chug Cola Cans Amounts. */
document.getElementById("Main_Cans_Amount").onchange = function() {
	ActiveSlot.SetCans(document.getElementById("Main_Cans_Amount").value);
	document.getElementById("Main_Cans_Amount").value = ActiveSlot.GetCans();
};
document.getElementById("Main_MinCans").onclick = function() {
	ActiveSlot.SetCans(0);
	document.getElementById("Main_Cans_Amount").value = ActiveSlot.GetCans();
};
document.getElementById("Main_MaxCans").onclick = function() {
	ActiveSlot.SetCans(250);
	document.getElementById("Main_Cans_Amount").value = ActiveSlot.GetCans();
};

/* Collectables -> Empty Chug-Chug Cola Cans Price. */
document.getElementById("Main_Cans_Price").onchange = function() {
	ActiveSlot.SetCansPrice(document.getElementById("Main_Cans_Price").value);
	document.getElementById("Main_Cans_Price").value = ActiveSlot.GetCansPrice();
};
document.getElementById("Main_MinCansPrice").onclick = function() {
	ActiveSlot.SetCansPrice(0);
	document.getElementById("Main_Cans_Price").value = ActiveSlot.GetCansPrice();
};
document.getElementById("Main_MaxCansPrice").onclick = function() {
	ActiveSlot.SetCansPrice(255);
	document.getElementById("Main_Cans_Price").value = ActiveSlot.GetCansPrice();
};

/* Collectables -> Cowbells Amount. */
document.getElementById("Main_Cowbells_Amount").onchange = function() {
	ActiveSlot.SetCowbells(document.getElementById("Main_Cowbells_Amount").value);
	document.getElementById("Main_Cowbells_Amount").value = ActiveSlot.GetCowbells();
};
document.getElementById("Main_MinCowbells").onclick = function() {
	ActiveSlot.SetCowbells(0);
	document.getElementById("Main_Cowbells_Amount").value = ActiveSlot.GetCowbells();
};
document.getElementById("Main_MaxCowbells").onclick = function() {
	ActiveSlot.SetCowbells(250);
	document.getElementById("Main_Cowbells_Amount").value = ActiveSlot.GetCowbells();
};

/* Collectables -> Cowbells Price. */
document.getElementById("Main_Cowbells_Price").onchange = function() {
	ActiveSlot.SetCowbellsPrice(document.getElementById("Main_Cowbells_Price").value);
	document.getElementById("Main_Cowbells_Price").value = ActiveSlot.GetCowbellsPrice();
};
document.getElementById("Main_MinCowbellsPrice").onclick = function() {
	ActiveSlot.SetCowbellsPrice(0);
	document.getElementById("Main_Cowbells_Price").value = ActiveSlot.GetCowbellsPrice();
};
document.getElementById("Main_MaxCowbellsPrice").onclick = function() {
	ActiveSlot.SetCowbellsPrice(255);
	document.getElementById("Main_Cowbells_Price").value = ActiveSlot.GetCowbellsPrice();
};

/* Collectables -> Alien Spaceship Parts Amount. */
document.getElementById("Main_SpaceshipParts_Amount").onchange = function() {
	ActiveSlot.SetSpaceship(document.getElementById("Main_SpaceshipParts_Amount").value);
	document.getElementById("Main_SpaceshipParts_Amount").value = ActiveSlot.GetSpaceship();
};
document.getElementById("Main_MinSpaceshipParts").onclick = function() {
	ActiveSlot.SetSpaceship(0);
	document.getElementById("Main_SpaceshipParts_Amount").value = ActiveSlot.GetSpaceship();
};
document.getElementById("Main_MaxSpaceshipParts").onclick = function() {
	ActiveSlot.SetSpaceship(250);
	document.getElementById("Main_SpaceshipParts_Amount").value = ActiveSlot.GetSpaceship();
};

/* Collectables -> Alien Spaceship Parts Price. */
document.getElementById("Main_SpaceshipParts_Price").onchange = function() {
	ActiveSlot.SetSpaceshipPrice(document.getElementById("Main_SpaceshipParts_Price").value);
	document.getElementById("Main_SpaceshipParts_Price").value = ActiveSlot.GetSpaceshipPrice();
};
document.getElementById("Main_MinSpaceshipPartsPrice").onclick = function() {
	ActiveSlot.SetSpaceshipPrice(0);
	document.getElementById("Main_SpaceshipParts_Price").value = ActiveSlot.GetSpaceshipPrice();
};
document.getElementById("Main_MaxSpaceshipPartsPrice").onclick = function() {
	ActiveSlot.SetSpaceshipPrice(255);
	document.getElementById("Main_SpaceshipParts_Price").value = ActiveSlot.GetSpaceshipPrice();
};

/* Collectables -> Nuclear Fuel Rods Amount. */
document.getElementById("Main_Fuelrods_Amount").onchange = function() {
	ActiveSlot.SetFuelrods(document.getElementById("Main_Fuelrods_Amount").value);
	document.getElementById("Main_Fuelrods_Amount").value = ActiveSlot.GetFuelrods();
};
document.getElementById("Main_MinFuelrods").onclick = function() {
	ActiveSlot.SetFuelrods(0);
	document.getElementById("Main_Fuelrods_Amount").value = ActiveSlot.GetFuelrods();
};
document.getElementById("Main_MaxFuelrods").onclick = function() {
	ActiveSlot.SetFuelrods(250);
	document.getElementById("Main_Fuelrods_Amount").value = ActiveSlot.GetFuelrods();
};

/* Collectables -> Nuclear Fuel Rods Price. */
document.getElementById("Main_Fuelrods_Price").onchange = function() {
	ActiveSlot.SetFuelrodsPrice(document.getElementById("Main_Fuelrods_Price").value);
	document.getElementById("Main_Fuelrods_Price").value = ActiveSlot.GetFuelrodsPrice();
};
document.getElementById("Main_MinFuelrodsPrice").onclick = function() {
	ActiveSlot.SetFuelrodsPrice(0);
	document.getElementById("Main_Fuelrods_Price").value = ActiveSlot.GetFuelrodsPrice();
};
document.getElementById("Main_MaxFuelrodsPrice").onclick = function() {
	ActiveSlot.SetFuelrodsPrice(255);
	document.getElementById("Main_Fuelrods_Price").value = ActiveSlot.GetFuelrodsPrice();
};