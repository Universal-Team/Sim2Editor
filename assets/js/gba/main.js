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

import { DownloadFile } from '../common/common.js';
export let CurrentMenu = "";

/* Import all menus here. */
import { MainEditorInit, MainEditorHide } from './menu/main-editor-menu.js';
import { SlotMenuInit, SlotMenuHide } from './menu/slot-menu.js';
import { CastMenuInit, CastMenuHide } from './menu/cast-menu.js';
import { EpisodeMenuInit, EpisodeMenuHide } from './menu/episode-menu.js';
import { SocialMoveMenuInit, SocialMoveMenuHide } from './menu/social-move-menu.js';

import { Casts, Collectables, Episodes, Moves, LoadStrings } from './string-handler.js';
import { Sav, SavName, RawData } from './core/savutils.js';

/* Initialize the List Selections. */
export function InitStrings() {
	/* Clear all first. */
	document.getElementById("CastSelection").clear();
	document.getElementById("EpisodeSelection").clear();
	document.getElementById("SlotSelector").clear();

	LoadStrings(Sav.GetLanguage()); // Load Strings.

	/* Init Cast List. */
	for (let i = 0; i < 26; i++) {
		let e = document.createElement("option");
		e.innerText = Casts[i];
		e.value = i;
		document.getElementById("CastSelection").appendChild(e);
	}

	/* Init Episode List. */
	for (let i = 0; i < 11; i++) {
		let e = document.createElement("option");
		e.innerText = Episodes[i + 1]; // Skip the first episode for now, because it isn't actually one, it's more like a tutorial.
		e.value = i;
		document.getElementById("EpisodeSelection").appendChild(e);
	}

	/* Init Social Moves List. */
	for (let i = 0; i < 15; i++) {
		let e = document.createElement("option");
		e.innerText = Moves[i];
		e.value = i;
		document.getElementById("MoveSelection").appendChild(e);
	}

	/* Init SAVSlot Selector. */
	for (let i = 1; i < 5; i++) {
		let e = document.createElement("option");
		e.innerText = document.getElementById("External-Strings").dataset.slot + ' ' + i.toString(); // Skip the first episode for now, because it isn't actually one, it's more like a tutorial.
		e.value = i;
		document.getElementById("SlotSelector").appendChild(e);
	}

	/* Init Collectable names. */
	document.getElementById("collectables-chug-chug-cola-cans").innerText = Collectables[0];
	document.getElementById("collectables-cowbells").innerText = Collectables[1];
	document.getElementById("collectables-alien-spaceship-parts").innerText = Collectables[2];
	document.getElementById("collectables-nuclear-fuel-rods").innerText = Collectables[3];

	/* Init Episode Rating names. */
	document.getElementById("Episode_Ratings").innerText = Episodes[12];
	document.getElementById("Episode_Plot_Points_Completed").innerText = Episodes[13];
	document.getElementById("Episode_Aspiration_Conversation").innerText = Episodes[14]
	document.getElementById("Episode_Hidden_Want_Completed").innerText = Episodes[15];
	document.getElementById("Episode_Errand_Completed").innerText = Episodes[16];
};


/* Init the SAVEditor. */
export function InitEditor() {
	InitStrings(); // Load initial Strings.

	document.getElementById("Loader").classList.add("showNone"); // Hide Loader.
	document.getElementById("SavEditor").classList.remove("showNone"); // Show SAVEditor.
	document.getElementById("Menus").classList.remove("showNone"); // Show SAVEditor.
	document.getElementById("Loaded_Slot").innerText = document.getElementById("External-Strings").dataset.none;

	MenuHandle("Slot-Selector-Menu"); // Go to the Slot Menu.
};

/*
	Handles the menus.

	NewMenu: The New Menu which to switch to.
*/
export function MenuHandle(NewMenu) {
	if (CurrentMenu == NewMenu) return; // No need to switch in that case.

	/* Hide old menu first. */
	switch(CurrentMenu) {
		case "Slot-Selector-Menu":
			document.getElementById("Slot-Selector-Menu").classList.replace("SelectedMenu", "UnselectedMenu");
			SlotMenuHide();
			break;

		case "Main-Editor-Menu":
			document.getElementById("Main-Editor-Menu").classList.replace("SelectedMenu", "UnselectedMenu");
			MainEditorHide();
			break;

		case "Cast-Menu":
			document.getElementById("Cast-Menu").classList.replace("SelectedMenu", "UnselectedMenu");
			CastMenuHide();
			break;

		case "Episode-Menu":
			document.getElementById("Episode-Menu").classList.replace("SelectedMenu", "UnselectedMenu");
			EpisodeMenuHide();
			break;

		case "Social-Moves-Menu":
			document.getElementById("Social-Moves-Menu").classList.replace("SelectedMenu", "UnselectedMenu");
			SocialMoveMenuHide();
			break;
	}

	/* Show and init new menu. */
	switch(NewMenu) {
		case "Slot-Selector-Menu":
			document.getElementById("Slot-Selector-Menu").classList.replace("UnselectedMenu", "SelectedMenu");
			SlotMenuInit();
			break;

		case "Main-Editor-Menu":
			document.getElementById("Main-Editor-Menu").classList.replace("UnselectedMenu", "SelectedMenu");
			MainEditorInit();
			break;

		case "Cast-Menu":
			document.getElementById("Cast-Menu").classList.replace("UnselectedMenu", "SelectedMenu");
			CastMenuInit();
			break;

		case "Episode-Menu":
			document.getElementById("Episode-Menu").classList.replace("UnselectedMenu", "SelectedMenu");
			EpisodeMenuInit();
			break;

		case "Social-Moves-Menu":
			document.getElementById("Social-Moves-Menu").classList.replace("UnselectedMenu", "SelectedMenu");
			SocialMoveMenuInit();
			break;
	}

	CurrentMenu = NewMenu; // Set to Current Menu.
};

/* Menu switches. */
document.getElementById("Slot-Selector-Menu").onclick = () => MenuHandle("Slot-Selector-Menu");
document.getElementById("Main-Editor-Menu").onclick = () => MenuHandle("Main-Editor-Menu");
document.getElementById("Cast-Menu").onclick = () => MenuHandle("Cast-Menu");
document.getElementById("Episode-Menu").onclick = () => MenuHandle("Episode-Menu");
document.getElementById("Social-Moves-Menu").onclick = () => MenuHandle("Social-Moves-Menu");

/* Finish call handling here. */
document.getElementById("Finish-Menu").onclick = function() {
	Sav.Finish(); // Finish call.
	DownloadFile(RawData, SavName);
};