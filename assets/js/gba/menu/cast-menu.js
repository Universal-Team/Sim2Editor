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

import { SetInteractionLevel } from '../gfx.js';
import { ActiveSlot } from './slot-menu.js';
let ActiveCast;

/*
	Inits the Selected Cast, so editing is possible.

	Cst: The selected Cast.
*/
function InitSelectedCast(Cst) {
	ActiveCast = ActiveSlot.GetCast(Cst);

	if (ActiveCast) {
		document.getElementById("CastEditMenu").classList.remove("showNone"); // We can edit.

		/* Interaction Levels. */
		for (let i = 0; i < 3; i++) CastInteractionDraw(i);

		/* Flags. */
		document.getElementById("Cast_AlternatePic").checked = ActiveCast.GetAlternatePic();
		document.getElementById("Cast_Mystery").checked = ActiveCast.GetMystery();

		/* Set Picture. */
		if (ActiveCast.GetAlternatePic()) {
			document.getElementById("Cast_Prev").src = `/assets/images/cast_alt/${document.getElementById("CastSelection").value}.png`;

		} else {
			document.getElementById("Cast_Prev").src = `/assets/images/cast/${document.getElementById("CastSelection").value}.png`;
		}
	}
};

/* Initialize the Cast Menu. */
export function CastMenuInit() {
	if (ActiveSlot) { // Ensure it's not undefined first.
		document.getElementById("CastMenu").classList.remove("showNone");
		InitSelectedCast(document.getElementById("CastSelection").value);
	}
};
/* Hide the Cast Menu. */
export function CastMenuHide() {
	document.getElementById("CastEditMenu").classList.add("showNone");
	document.getElementById("CastMenu").classList.add("showNone");
};

/* Cast Selection. */
document.getElementById("CastSelection").onchange = () => InitSelectedCast(document.getElementById("CastSelection").value);


/* Friendly Interaction Level. */
document.getElementById("Cast_Friendly").onclick = function() {
	if (ActiveCast.GetFriendly() < 3) ActiveCast.SetFriendly(ActiveCast.GetFriendly() + 1);
	else ActiveCast.SetFriendly(0);

	document.getElementById("Cast_Friendly").value = ActiveCast.GetFriendly();
	CastInteractionDraw(0);
};
document.getElementById("Cast_MinFriendly").onclick = function() {
	ActiveCast.SetFriendly(0);
	document.getElementById("Cast_Friendly").value = ActiveCast.GetFriendly();
	CastInteractionDraw(0);
};
document.getElementById("Cast_MaxFriendly").onclick = function() {
	ActiveCast.SetFriendly(3);
	document.getElementById("Cast_Friendly").value = ActiveCast.GetFriendly();
	CastInteractionDraw(0);
};

/* Romance Interaction Level. */
document.getElementById("Cast_Romance").onclick = function() {
	if (ActiveCast.GetRomance() < 3) ActiveCast.SetRomance(ActiveCast.GetRomance() + 1);
	else ActiveCast.SetRomance(0);

	document.getElementById("Cast_Romance").value = ActiveCast.GetRomance();
	CastInteractionDraw(1);
};
document.getElementById("Cast_MinRomance").onclick = function() {
	ActiveCast.SetRomance(0);
	document.getElementById("Cast_Romance").value = ActiveCast.GetRomance();
	CastInteractionDraw(1);
};
document.getElementById("Cast_MaxRomance").onclick = function() {
	ActiveCast.SetRomance(3);
	document.getElementById("Cast_Romance").value = ActiveCast.GetRomance();
	CastInteractionDraw(1);
};

/* Intimidate Interaction Level. */
document.getElementById("Cast_Intimidate").onclick = function() {
	if (ActiveCast.GetIntimidate() < 3) ActiveCast.SetIntimidate(ActiveCast.GetIntimidate() + 1);
	else ActiveCast.SetIntimidate(0);

	document.getElementById("Cast_Intimidate").value = ActiveCast.GetIntimidate();
	CastInteractionDraw(2);
};
document.getElementById("Cast_MinIntimidate").onclick = function() {
	ActiveCast.SetIntimidate(0);
	document.getElementById("Cast_Intimidate").value = ActiveCast.GetIntimidate();
	CastInteractionDraw(2);
};
document.getElementById("Cast_MaxIntimidate").onclick = function() {
	ActiveCast.SetIntimidate(3);
	document.getElementById("Cast_Intimidate").value = ActiveCast.GetIntimidate();
	CastInteractionDraw(2);
};

/* Alternative Picture (Smile). */
document.getElementById("Cast_AlternatePic").onclick = function() {
	ActiveCast.SetAlternatePic(document.getElementById("Cast_AlternatePic").checked);

	/* Set Picture. */
	if (ActiveCast.GetAlternatePic()) {
		document.getElementById("Cast_Prev").src = `/assets/images/cast_alt/${document.getElementById("CastSelection").value}.png`;

	} else {
		document.getElementById("Cast_Prev").src = `/assets/images/cast/${document.getElementById("CastSelection").value}.png`;
	}
}

/* Mystery Unlocked. */
document.getElementById("Cast_Mystery").onclick = () => ActiveCast.SetMystery(document.getElementById("Cast_Mystery").checked);


/* Mass Action -> Max Interactions. */
document.getElementById("Cast_MaxInteraction").onclick = function() {
	for (let i = 0; i < 26; i++) {
		const C = ActiveSlot.GetCast(i);

		C.SetFriendly(3);
		C.SetRomance(3);
		C.SetIntimidate(3);
	}

	document.getElementById("Cast_Friendly").value = ActiveCast.GetFriendly();
	document.getElementById("Cast_Romance").value = ActiveCast.GetRomance();
	document.getElementById("Cast_Intimidate").value = ActiveCast.GetIntimidate();
	for (let i = 0; i < 3; i++) CastInteractionDraw(i);
};

/* Mass Action -> Min Interactions. */
document.getElementById("Cast_MinInteraction").onclick = function() {
	for (let i = 0; i < 26; i++) {
		const C = ActiveSlot.GetCast(i);

		C.SetFriendly(0);
		C.SetRomance(0);
		C.SetIntimidate(0);
	}

	document.getElementById("Cast_Friendly").value = ActiveCast.GetFriendly();
	document.getElementById("Cast_Romance").value = ActiveCast.GetRomance();
	document.getElementById("Cast_Intimidate").value = ActiveCast.GetIntimidate();
	for (let i = 0; i < 3; i++) CastInteractionDraw(i);
};


/* Mass Action -> Unlock all Alternative Pictures. */
document.getElementById("Cast_AlternatePicUnlock").onclick = function() {
	for (let i = 0; i < 26; i++) ActiveSlot.GetCast(i).SetAlternatePic(true);

	document.getElementById("Cast_AlternatePic").checked = ActiveCast.GetAlternatePic();

	/* Set Picture. */
	if (ActiveCast.GetAlternatePic()) {
		document.getElementById("Cast_Prev").src = `/assets/images/cast_alt/${document.getElementById("CastSelection").value}.png`;

	} else {
		document.getElementById("Cast_Prev").src = `/assets/images/cast/${document.getElementById("CastSelection").value}.png`;
	}
};

/* Mass Action -> Unlock all Mysteries. */
document.getElementById("Cast_Mystery_Unlocker").onclick = function() {
	for (let i = 0; i < 26; i++) ActiveSlot.GetCast(i).SetMystery(true);

	document.getElementById("Cast_Mystery").checked = ActiveCast.GetMystery();
};

/*
	Draw the Active Cast's Interaction Levels.

	i: 0: Friendly, 1: Romance, 2: Intimidate.
*/
function CastInteractionDraw(i) {
	if (!ActiveCast) return;

	switch(i) {
		case 0:
			SetInteractionLevel(document.getElementById("Cast_Friendly"), ActiveCast.GetFriendly());
			break;

		case 1:
			SetInteractionLevel(document.getElementById("Cast_Romance"), ActiveCast.GetRomance());
			break;

		case 2:
			SetInteractionLevel(document.getElementById("Cast_Intimidate"), ActiveCast.GetIntimidate());
			break;
	}
};

/* Clicking on the preview opens the Cast Selection GUI. */
document.getElementById("Cast_Prev").onclick = function() {
	if (ActiveSlot) {
		/* Hide Cast Menu and show Cast Selector. */
		document.getElementById("Menus").classList.add("showNone");
		document.getElementById("CastEditMenu").classList.add("showNone");
		document.getElementById("CastMenu").classList.add("showNone");
		document.getElementById("CastSelectMenu").classList.remove("showNone");
	}
};

/* Cast GUI Select Menu callback. */
document.getElementById("CastSelectMenu").onclick = function() {
	const casts = document.getElementById("CastSelectorGrid").children;

	let clicked = false;
	for (let i = 0; i < 26; i++) {
		casts[i].onclick = function() {
			document.getElementById("CastSelection").value = i;
			InitSelectedCast(i);

			/* Set Picture. */
			if (ActiveCast.GetAlternatePic()) {
				document.getElementById("Cast_Prev").src = `/assets/images/cast_alt/${document.getElementById("CastSelection").value}.png`;

			} else {
				document.getElementById("Cast_Prev").src = `/assets/images/cast/${document.getElementById("CastSelection").value}.png`;
			}

			document.getElementById("CastSelectMenu").classList.add("showNone");
			document.getElementById("CastEditMenu").classList.remove("showNone");
			document.getElementById("CastMenu").classList.remove("showNone");
			document.getElementById("Menus").classList.remove("showNone");
			clicked = true;
		}

		if (clicked) break;
	}
};