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

import { SavData } from './savutils.js';
const EPOffs = [ 0x10A, 0x114, 0x128, 0x123, 0x137, 0x12D, 0x150, 0x146, 0x11E, 0x173, 0x16E ]; // 11 Episodes.

export class Episode {
	constructor(Slot, EP) {
		this.SlotOffs = (Slot * 0x1000); // Neccessary for Mass options.
		this.Offs = this.SlotOffs + EPOffs[EP]; // Base Offset for current Episode.
		this.EP = EP; // Cause why not, useful for display maybe. :P
	};

	/* Episode Rating, they're 4 byte and each of them can be up to 25 (0x19). */
	GetRating() {
		let ret = new Uint8Array(0x4);
		for (let i = 0; i < 4; i++) ret[i] = SavData.getUint8(this.Offs + i);
		return ret;
	};
	SetRating(v) { for (let i = 0; i < 4; i++) SavData.setUint8(this.Offs + i, Math.min(25, v[i])); };

	/* Episode Locked (false) or Unlocked (true). */
	GetState() { return SavData.getUint8(this.Offs + 0x4); };
	SetState(v) { SavData.setUint8(this.Offs + 0x4, Math.min(1, v)); };

	/* Mass State locker / unlocker. */
	MassState(v) { for (let i = 0; i < 11; i++) SavData.setUint8(this.SlotOffs + EPOffs[i] + 0x4, Math.min(1, v)); };

	/* Mass Rating setter. */
	MassRating(v) {
		for (let i = 0; i < 11; i++) {
			for (let i2 = 0; i2 < 4; i2++) SavData.setUint8(this.SlotOffs + EPOffs[i] + i2, Math.min(25, v));
		}
	};
};