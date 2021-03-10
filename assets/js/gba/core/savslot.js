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

import { ReadString, WriteString } from '../../common/common.js';
import { CalculateGBAChecksum, GBAChecksumGood } from '../../common/checksum.js';
import { SavData } from './savutils.js';
/* Import Cast and Episode classes. */
import { Cast } from './cast.js';
import { Episode } from './episode.js';
import { SocialMove } from './social-move.js';

/*
	NOTE: The Cast + Collectables seem to be moved through +0x5, if the tutorial is over.

	TODO: Find a way to detect that properly and add + 0x5 if tutorial is over.
*/
export class SAVSlot {
	constructor(Slot) {
		this.Offs = (Slot * 0x1000); // Base offset which we are working with on this class.
		this.Slot = Slot; // Slot, neccessary for the FixChecksum function and some sub classes.
	};

	/* Update checksum, if needed. Also known as finish call for the slot. ;P */
	FixChecksum() {
		if (!GBAChecksumGood(SavData, this.Slot, SavData.getUint16(this.Offs + 0xFFE, true))) {
			SavData.setUint16(this.Offs + 0xFFE, CalculateGBAChecksum(SavData, this.Slot), true);
			return true; // Fixed.
		}

		return false; // Already good.
	};

	/* Return the Checksum as a Hex String. */
	GetChecksum() {
		const v = SavData.getUint16(this.Offs + 0xFFE, true);
		return '#' + v.toString(16).toUpperCase(); // Hex.
	};

	/* Return if the Checksum is good as a boolean. */
	ChecksumGood() { return (GBAChecksumGood(SavData, this.Slot, SavData.getUint16(this.Offs + 0xFFE, true))); };

	/* I've got no clue why it could be useful, but ehh, there we go. :P */
	EraseSlot() { for (let i = 0; i < 0x1000; i++) SavData.setUint8(this.Offs + i, 0x0); };

	/* The Time in game. 2 byte for the Hour and Minute, Hour being 23 as the max, and Minute being 59 as the max. */
	GetTime() {
		let ret = new Uint8Array(0x2);
		ret[0] = SavData.getUint8(this.Offs + 0x2);
		ret[1] = SavData.getUint8(this.Offs + 0x3);
		return ret;
	};
	SetTime(v) {
		SavData.setUint8(this.Offs + 0x2, Math.min(23, v[0]));
		SavData.setUint8(this.Offs + 0x3, Math.min(59, v[1]));
	};

	/* Current Simoleons of the Sim. */
	GetSimoleons() { return SavData.getUint32(this.Offs + 0x5, true) >> 8; };
	SetSimoleons(v) { SavData.setUint32(this.Offs + 0x5, (Math.min(999999, v) << 8), true); };

	/* Current Name of the Sim. */
	GetName() { return ReadString(SavData, this.Offs + 0xD, 8); };
	SetName(v) { WriteString(SavData, this.Offs + 0xD, 8, v); };

	/* Current Rating of the Sim. */
	GetRating() { return SavData.getUint16(this.Offs + 0xA, true); };
	SetRating(v) { SavData.setUint16(this.Offs + 0xA, Math.min(9999, v), true); };

	/* Empty Chug-Chug Cola Cans. */
	GetCans() { return SavData.getUint8(this.Offs + 0xFC); };
	SetCans(v) { SavData.setUint8(this.Offs + 0xFC, Math.min(250, v)); };
	/* Get the Sell price of it. */
	GetCansPrice() { return SavData.getUint8(this.Offs + 0x100); };
	SetCansPrice(v) { SavData.setUint8(this.Offs + 0x100, Math.min(255, v)); };

	/* Cowbells. */
	GetCowbells() { return SavData.getUint8(this.Offs + 0xFD); };
	SetCowbells(v) { SavData.setUint8(this.Offs + 0xFD, Math.min(250, v)); };
	/* Get the Sell price of it. */
	GetCowbellsPrice() { return SavData.getUint8(this.Offs + 0x101); };
	SetCowbellsPrice(v) { SavData.setUint8(this.Offs + 0x101, Math.min(255, v)); };

	/* Alien Spaceship Parts. */
	GetSpaceship() { return SavData.getUint8(this.Offs + 0xFE); };
	SetSpaceship(v) { SavData.setUint8(this.Offs + 0xFE, Math.min(250, v)); };
	/* Get the Sell price of it. */
	GetSpaceshipPrice() { return SavData.getUint8(this.Offs + 0x102); };
	SetSpaceshipPrice(v) { SavData.setUint8(this.Offs + 0x102, Math.min(255, v)); };

	/* Nuclear Fuel Rods. */
	GetFuelrods() { return SavData.getUint8(this.Offs + 0xFF); };
	SetFuelrods(v) { SavData.setUint8(this.Offs + 0xFF, Math.min(250, v)); };
	/* Get the Sell price of it. */
	GetFuelrodsPrice() { return SavData.getUint8(this.Offs + 0x103); };
	SetFuelrodsPrice(v) { SavData.setUint8(this.Offs + 0x103, Math.min(255, v)); };

	/* Return an Episode class. ( 0 - 10 ) */
	GetEpisode(v) { if (v < 11) return new Episode(this.Slot, v); };

	/* Return an Cast class. ( 0 - 25 ) */
	GetCast(v) { if (v < 26) return new Cast(this.Offs + 0x46C + (v * 0xA), v); };

	/* Return a Social Move class ( 0 - 14 ) */
	GetSocialMove(v) { if (v < 15) return new SocialMove(this.Offs, v); };
};