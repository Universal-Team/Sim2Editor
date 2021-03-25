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
	constructor(Slot, EP, Move) {
		this.Slot = Slot;
		this.Episode = EP;
		this.Move = Move;
		this.Offs = this.SetOffset(this.Episode); // Base Offset for current Episode.
	};

	/* Sets the base offset for the Episodes. */
	SetOffset(EP) {
		switch(this.Move) {
			case 1:
				return (this.Slot * 0x1000) + EPOffs[EP];

			case 2:
				return (this.Slot * 0x1000) + EPOffs[EP] + 0x6;
		}

		return (this.Slot * 0x1000) + EPOffs[EP] - 0x6;
	};

	/* Episode Rating, they're 4 byte and each of them can be up to 25 (0x19). */
	GetRating() {
		let Ret = new Uint8Array(0x4);
		for (let Idx = 0; Idx < 4; Idx++) Ret[Idx] = SavData.getUint8(this.Offs + Idx);
		return Ret;
	};
	SetRating(V) { for (let Idx = 0; Idx < 4; Idx++) SavData.setUint8(this.Offs + Idx, Math.min(25, V[Idx])); };

	/* Episode Locked (false) or Unlocked (true). */
	GetState() { return SavData.getUint8(this.Offs + 0x4); };
	SetState(V) { SavData.setUint8(this.Offs + 0x4, Math.min(1, V)); };

	/* Mass State locker / unlocker. */
	MassState(V) { for (let Idx = 0; Idx < 11; Idx++) SavData.setUint8(this.SetOffset(Idx) + 0x4, Math.min(1, V)); };

	/* Mass Rating setter. */
	MassRating(V) {
		for (let Idx = 0; Idx < 11; Idx++) {
			for (let Idx2 = 0; Idx2 < 4; Idx2++) SavData.setUint8(this.SetOffset(Idx) + Idx2, Math.min(25, V));
		}
	};
};