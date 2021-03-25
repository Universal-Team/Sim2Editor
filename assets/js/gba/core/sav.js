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

import { CalculateGBAChecksum, GBAChecksumGood } from "../../common/checksum.js";
import { SAVSlot } from "./savslot.js";
import { SavData } from "./savutils.js";
import { GBASettings } from "./settings.js";

export class SAV {
	constructor() { }; // Nothing there yet.

	/*
		Returns, if the SAVSlot is valid / exist.

		Slot: The Slot to check ( 1 - 4 ).
	*/
	SlotValid(Slot) {
		if (Slot > 0 && Slot < 5) { // Ensure 1 - 4.
			for (let i = 0; i < 0x10; i++) {
				if (SavData.getUint8((Slot * 0x1000) + i) != 0x0) return true; // Ensure it's not only 0x0. TODO: Find a better way?
			}
		}

		return false;
	};

	/*
		Returns the SAVSlot class.

		Slot: The Slot which to get ( 1 - 4 ).
	*/
	GetSlot(Slot) { if (Slot > 0 && Slot < 5 && this.SlotValid(Slot)) return new SAVSlot(Slot, SavData.getUint8((Slot * 0x1000) + 0xD6)); };

	GetSettings() { return new GBASettings(); };

	/* Return the Language from in game. */
	GetLanguage() { return this.GetSettings().GetLanguage(); };

	/* Finish call and update all available SAVSlots. */
	Finish() {
		for (let i = 1; i < 5; i++) {
			if (this.SlotValid(i)) { // Ensure it exist.
				if (!GBAChecksumGood(SavData, i, SavData.getUint16((i * 0x1000) + 0xFFE, true))) {
					SavData.setUint16((i * 0x1000) + 0xFFE, CalculateGBAChecksum(SavData, i), true);
				}
			}
		}

		/* Also do the same for the Settings. */
		this.GetSettings().UpdateChecksum();
	};
};