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

import { MenuHandle } from '../main.js';
import { Episodes } from '../string-handler.js';
import { SimUtils_NumberFormat, SimUtils_TimeString, SimUtils_SimoleonFormat } from '../../common/simutils.js';
import { SAV } from '../core/sav.js';
import { SAVSlot } from '../core/savslot.js';
import { Sav } from '../core/savutils.js';
export let ActiveSlot;

/*
	Load a Slot and access the main editor.

	Slot: The Slot which to load.
*/
function LoadSlot(Slot) {
	ActiveSlot = Sav.GetSlot(Slot);
	document.getElementById("Loaded_Slot").innerText = Slot.toString();
	MenuHandle("Main-Editor-Menu"); // Switch to Main Editor.
};

/*
	Displays a Slot's information.

	Slot: The Slot which to display.
	Show: If should be shown or not.
*/
function SlotDisplay(Slot) {
	if (Sav.SlotValid(Slot)) {
		document.getElementById("SlotInformation").classList.remove("showNone");
		const S = Sav.GetSlot(Slot);

		/* Slot Information. */
		document.getElementById("Slot_Exist").innerText = document.getElementById("External-Strings").dataset.yes;
		document.getElementById("Slot_Episode").innerText = Episodes[S.GetCurrentEpisode()];
		document.getElementById("Slot_Name").innerText = S.GetName();
		document.getElementById("Slot_Simoleons").innerText = SimUtils_SimoleonFormat(S.GetSimoleons());
		document.getElementById("Slot_Rating").innerText = SimUtils_NumberFormat(S.GetRating(), 3);
		document.getElementById("Slot_Time").innerText = SimUtils_TimeString(S.GetTime());
		/* Checksum. */
		document.getElementById("Slot_Checksum").innerText = S.GetChecksum();
		if (S.ChecksumGood()) document.getElementById("Slot_Checksum_Good").innerText = document.getElementById("External-Strings").dataset.yes;
		else document.getElementById("Slot_Checksum_Good").innerText = document.getElementById("External-Strings").dataset.no;
		document.getElementById("Slot_Checksum_Fix").disabled = S.ChecksumGood();
		/* Checksum Fix Button style. */
		if (document.getElementById("Slot_Checksum_Fix").disabled) document.getElementById("Slot_Checksum_Fix").classList.replace("ClickButton", "NoButton");
		else document.getElementById("Slot_Checksum_Fix").classList.replace("NoButton", "ClickButton");
		/* Enable Slot Loading Button. */
		document.getElementById("Slot_Load").disabled = false;
		document.getElementById("Slot_Load").classList.replace("NoButton", "ClickButton");
		/* Enable Slot Erasing. */
		//document.getElementById("Slot_Erase").disabled = false;
		//document.getElementById("Slot_Erase").classList.replace("NoButton", "ClickButton");
	} else {
		/* Slot Information. */
		document.getElementById("Slot_Exist").innerText = document.getElementById("External-Strings").dataset.no;
		document.getElementById("Slot_Episode").innerText = "";
		document.getElementById("Slot_Name").innerText = "";
		document.getElementById("Slot_Simoleons").innerText = "";
		document.getElementById("Slot_Rating").innerText = "";
		document.getElementById("Slot_Time").innerText = "";
		/* Checksum. */
		document.getElementById("Slot_Checksum").innerText = "";
		document.getElementById("Slot_Checksum_Good").innerText = "";
		document.getElementById("Slot_Checksum_Fix").disabled = true;
		document.getElementById("Slot_Checksum_Fix").classList.replace("ClickButton", "NoButton");
		/* Disable Slot Loading Button. */
		document.getElementById("Slot_Load").disabled = true;
		document.getElementById("Slot_Load").classList.replace("ClickButton", "NoButton");
		/* Disable Slot Erasing. */
		//document.getElementById("Slot_Erase").disabled = true;
		//document.getElementById("Slot_Erase").classList.replace("ClickButton", "NoButton");
	}
};

/* Init the Slot Menu. */
export function SlotMenuInit() {
	document.getElementById("SlotMenu").classList.remove("showNone"); // Remove hide state.
	SlotDisplay(document.getElementById("SlotSelector").value);
};
/* Hide the Slot Menu. */
export function SlotMenuHide() { document.getElementById("SlotMenu").classList.add("showNone"); };

/* Slot Selector handle. */
document.getElementById("SlotSelector").onchange = function() { SlotDisplay(document.getElementById("SlotSelector").value); };

/* Slot Loader Handle. */
document.getElementById("Slot_Load").onclick = function() {
	if (Sav.SlotValid(document.getElementById("SlotSelector").value)) {
		LoadSlot(document.getElementById("SlotSelector").value);

	} else {
		alert(document.getElementById("External-Strings").dataset.msg_load_no_existing_slot);
	}
};

/* Checksum fix. */
document.getElementById("Slot_Checksum_Fix").onclick = function() {
	const S = Sav.GetSlot(document.getElementById("SlotSelector").value);
	S.FixChecksum();
	SlotDisplay(document.getElementById("SlotSelector").value);
};

/* Slot Erase [Disabled for now]. */
document.getElementById("Slot_Erase").onclick = function() {
	Sav.GetSlot(document.getElementById("SlotSelector").value).EraseSlot();

	if (ActiveSlot) {
		if (ActiveSlot.Slot == document.getElementById("SlotSelector").value) {
			ActiveSlot = undefined; // Set Active Slot to undefined.
			document.getElementById("Loaded_Slot").innerText = document.getElementById("External-Strings").dataset.none;
		}
	}

	SlotDisplay(document.getElementById("SlotSelector").value);
};