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

const GBAIdent = [ 0x53, 0x54, 0x57, 0x4E, 0x30, 0x32, 0x34 ]; // Neccessary for SAV Validate checks, which we are doin' here.

import { InitEditor } from '../main.js';
import { SAV } from './sav.js'; // SAV Class.
export let Sav, SavName; // SAV class + SAV Name.
export let RawData, SavData, SavSize; // SAV related things such as buffer and size.


/* The SAVSelector Action. */
document.getElementById("SAVLoader").onclick = function() {
	let Input = document.createElement("input");
	Input.type = "file";
	Input.accept = ".sav";
	Input.click();

	Input.onchange = (e) => LoadSAV(e.target.files[0]);
};

/*
	SAVFile Loading and size checks are here.

	SAVFile: The SAVFile.
*/
function LoadSAV(SAVFile) {
	if (!SAVFile) {
		alert(document.getElementById("External-Strings").dataset.msg_no_sav_selected);
		return false;
	}

	SavName = SAVFile.name;
	SavSize = SAVFile.size;

	if (SavSize == 0x10000 || SavSize == 0x20000) { // Those are valid sizes of a GBA SAV.
		let Reader = new FileReader();
		Reader.readAsArrayBuffer(SAVFile);
		Reader.onload = function() { InitSAV(this.result); };

	} else {
		alert(document.getElementById("External-Strings").dataset.msg_no_valid_sav);
	}
};

/*
	SAVFile buffer initializing and GBAIdent checks are here.

	Buffer: The SAVBuffer.
*/
function InitSAV(Buffer) {
	Sav = undefined; // Set to undefined first.
	RawData = new Uint8Array(Buffer);
	SavData = new DataView(RawData.buffer);

	/* We'll check here for Validation. */
	let Count = 0;
	for (let i = 0; i < 7; i++) {
		if (SavData.getUint8(i) == GBAIdent[i]) Count++;
	}

	if (Count == 7) Sav = new SAV();
	if (Sav != undefined) InitEditor(); // Init Editor, if SAV good.
};