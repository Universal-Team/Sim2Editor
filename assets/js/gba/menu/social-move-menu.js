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
let ActiveMove;

/*
	Initialize the selected Social Move.

	Action: The Social Move Action.
	Reload: If reloading or not.
*/
function InitSelectedMove(Action, Reload) {
	if (!Reload) ActiveMove = ActiveSlot.GetSocialMove(Action);

	if (ActiveMove) {
		document.getElementById("SocialMovePrev").src = `/assets/images/social-moves/${Action}.png`;
		document.getElementById("SocialMoveEditMenu").classList.remove("showNone");
		document.getElementById("SocialMove_Flag").value = ActiveMove.GetFlag();
		document.getElementById("SocialMove_Level").value = ActiveMove.GetLevel();
	}
};

/* Initialize the Social Move Menu. */
export function SocialMoveMenuInit() {
	if (ActiveSlot) { // Ensure it's not undefined first.
		document.getElementById("SocialMoveMenu").classList.remove("showNone");
		InitSelectedMove(document.getElementById("MoveSelection").value, false);
	}
};

/* Hide the Social Move Menu. */
export function SocialMoveMenuHide() {
	document.getElementById("SocialMoveEditMenu").classList.add("showNone");
	document.getElementById("SocialMoveMenu").classList.add("showNone");
};

/* Social Move Selection. */
document.getElementById("MoveSelection").onchange = () => InitSelectedMove(document.getElementById("MoveSelection").value, false);

/* Social Move Flag. */
document.getElementById("SocialMove_Flag").onchange = () => ActiveMove.SetFlag(document.getElementById("SocialMove_Flag").value);

/* Social Move Level. */
document.getElementById("SocialMove_Level").onchange = () => ActiveMove.SetLevel(document.getElementById("SocialMove_Level").value);

/* Unlock all Social Moves. */
document.getElementById("SocialMove_UnlockAll").onclick = function() {
	for (let i = 0; i < 15; i++) {
		let move = ActiveSlot.GetSocialMove(i);
		move.SetFlag(1);
	}

	InitSelectedMove(document.getElementById("MoveSelection").value, true);
};

/* Clear all Social Action Levels. */
document.getElementById("SocialMove_MinAll").onclick = function() {
	for (let i = 0; i < 15; i++) {
		let move = ActiveSlot.GetSocialMove(i);
		move.SetLevel(0);
	}

	InitSelectedMove(document.getElementById("MoveSelection").value, true);
};

/* Max out all Social Action Levels. */
document.getElementById("SocialMove_MaxAll").onclick = function() {
	for (let i = 0; i < 15; i++) {
		let move = ActiveSlot.GetSocialMove(i);
		move.SetLevel(2);
	}

	InitSelectedMove(document.getElementById("MoveSelection").value, true);
};

/* Clicking on the preview opens the Social Move Selection GUI. */
document.getElementById("SocialMovePrev").onclick = function() {
	if (ActiveSlot) {
		/* Hide Social Move Menu and show Social Move Selector. */
		document.getElementById("Menus").classList.add("showNone");
		document.getElementById("SocialMoveEditMenu").classList.add("showNone");
		document.getElementById("SocialMoveMenu").classList.add("showNone");
		document.getElementById("SocialMoveSelectMenu").classList.remove("showNone");
	}
};

/* Social Move GUI Select Menu callback. */
document.getElementById("SocialMoveSelectorGrid").onclick = function() {
	const moves = document.getElementById("SocialMoveSelectorGrid").children;

	let clicked = false;
	for (let i = 0; i < 15; i++) {
		moves[i].onclick = function() { // If it's clicked, we're initing it.
			document.getElementById("MoveSelection").value = i;
			InitSelectedMove(i, false);

			document.getElementById("SocialMoveSelectMenu").classList.add("showNone");
			document.getElementById("SocialMoveEditMenu").classList.remove("showNone");
			document.getElementById("SocialMoveMenu").classList.remove("showNone");
			document.getElementById("Menus").classList.remove("showNone");
			clicked = true;
		}

		if (clicked) break;
	}
};