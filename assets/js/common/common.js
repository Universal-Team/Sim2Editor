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

/* Character Whitelist. */
const CharWhiteList = [
	/* UPPERCASE Characters. */
	'A', 'B', 'C', 'D', 'E', 'F', 'G',
	'H', 'I', 'J', 'K', 'L', 'M',
	'N', 'O', 'P', 'Q', 'R', 'S',
	'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
	/* UPPERCASE Numbers. */
	'0', '1', '2', '3', '4',
	'5', '6', '7', '8', '9',
	/* LOWERCASE Characters. */
	'a', 'b', 'c', 'd', 'e', 'f', 'g',
	'h', 'i', 'j', 'k', 'l', 'm',
	'n', 'o', 'p', 'q', 'r', 's',
	't', 'u', 'v', 'w', 'x', 'y', 'z',
	/* LOWERCASE Special Signs. */
	'!', '+', '#', '$', '%',
	'&', '_', '*', '(', ')'
];

/*
	Read a String from a Buffer.

	Buffer: The SAVBuffer.
	Offs: From which Offset to read from.
	Length: The Length of the String.
*/
export function ReadString(Buffer, Offs, Length) {
	let str = '';

	for (let i = 0; i < Length; i++) {
		if (Buffer.getUint8(Offs + i) == 0x0) break; // Do not continue to read if 0x0.

		str += String.fromCharCode(Buffer.getUint8(Offs + i));
	}

	return str;
};

/*
	Write a String to a Buffer.

	Buffer: The SAVBuffer.
	Offs: To which Offset to write to.
	Length: The Length of the String.
	STR: The String.
*/
export function WriteString(Buffer, Offs, Length, STR) {
	if (STR == undefined) return;
	let Index = 0, filler = false;

	while(Index < Length) {
		Index++;

		let CouldFind = false;
		if (!filler) { // As long as it's not the filler, we're able to do this action, else we fill with ZEROs.
			for (let i = 0; i < 72; i++) {
				if (STR.charAt(Index - 1) == CharWhiteList[i]) { // Only allow characters from the Whitelist.
					Buffer.setUint8(Offs + (Index - 1), STR.charCodeAt(Index - 1));
					CouldFind = true;
					break;
				}
			}
		}

		if (!CouldFind) {
			filler = true;
			Buffer.setUint8(Offs + (Index - 1), 0x0); // Place 0x0, like it would do in game.
		}
	}
};

/*
	This is being used, to download the SAVFile at the end. Might be used to download other stuff as well, no idea.

	Buffer: The SAVBuffer.
	Name: The name of the file to download.
*/
export function DownloadFile(Buffer, Name) {
	let blob = new Blob([Buffer], { type: "application/octet-stream" });
	let a = document.createElement('a');
	let url = window.URL.createObjectURL(blob);

	a.href = url;
	a.download = Name; // Set download name.
	a.click();
};

/* Call this, when you need to clear all childs from an HTML Element, like clearing the select list. */
Object.defineProperty(HTMLElement.prototype, "clear", { value: function clear() {
	while(this.firstChild) this.removeChild(this.firstChild);
  }, enumerable: false })