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

const EPVals = [
	0x0, 0x1, 0x3, 0x7,  // Tutorial + Season 1.
	0x6, 0xA, 0x8, 0xF,  // Season 2.
	0xD, 0x5, 0x16, 0x15 // Season 3.
];

/*
	NOTE: The Cast + Collectables seem to be moved through +0x5, if the tutorial is over.

	TODO: Find a way to detect that properly and add + 0x5 if tutorial is over.
*/
export class SAVSlot {
	constructor(Slot, Move) {
		this.Offs = (Slot * 0x1000); // Base offset which we are working with on this class.
		this.Slot = Slot; // Slot, neccessary for the FixChecksum function and some sub classes.
		this.Move = Move;
	};

	/* The Sims 2 GBA is annoying and their movement crap, so this is necessary. */
	Offset(DefaultOffs, MoveOffs1, MoveOffs2) {
		switch(this.Move) {
			case 1:
				return this.Offs + MoveOffs1;

			case 2:
				return this.Offs + MoveOffs2;
		}

		return this.Offs + DefaultOffs;
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
		const V = SavData.getUint16(this.Offs + 0xFFE, true);
		return '#' + V.toString(16).toUpperCase(); // Hex.
	};

	/* Return if the Checksum is good as a boolean. */
	ChecksumGood() { return (GBAChecksumGood(SavData, this.Slot, SavData.getUint16(this.Offs + 0xFFE, true))); };

	/* I've got no clue why it could be useful, but ehh, there we go. :P */
	EraseSlot() { for (let i = 0; i < 0x1000; i++) SavData.setUint8(this.Offs + i, 0x0); };

	/* The Time in game. 2 byte for the Hour and Minute, Hour being 23 as the max, and Minute being 59 as the max. */
	GetTime() {
		let Ret = new Uint8Array(0x2);
		Ret[0] = SavData.getUint8(this.Offs + 0x2);
		Ret[1] = SavData.getUint8(this.Offs + 0x3);
		return Ret;
	};
	SetTime(V) {
		SavData.setUint8(this.Offs + 0x2, Math.min(23, V[0]));
		SavData.setUint8(this.Offs + 0x3, Math.min(59, V[1]));
	};

	/* Current Simoleons of the Sim. */
	GetSimoleons() { return SavData.getUint32(this.Offs + 0x5, true) >> 8; };
	SetSimoleons(V) { SavData.setUint32(this.Offs + 0x5, (Math.min(999999, V) << 8), true); };

	/* Current Name of the Sim. */
	GetName() { return ReadString(SavData, this.Offs + 0xD, 8); };
	SetName(V) { WriteString(SavData, this.Offs + 0xD, 8, V); };

	/* Current Rating of the Sim. */
	GetRating() { return SavData.getUint16(this.Offs + 0xA, true); };
	SetRating(V) { SavData.setUint16(this.Offs + 0xA, Math.min(9999, V), true); };

	/* Empty Chug-Chug Cola Cans. */
	GetCans() { return SavData.getUint8(this.Offset(0xF6, 0xFC, 0x102)); };
	SetCans(V) { SavData.setUint8(this.Offset(0xF6, 0xFC, 0x102), Math.min(250, V)); };
	/* Get the Sell price of it. */
	GetCansPrice() { return SavData.getUint8(this.Offset(0xFA, 0x100, 0x106)); };
	SetCansPrice(V) { SavData.setUint8(this.Offset(0xFA, 0x100, 0x106), Math.min(255, V)); };

	/* Cowbells. */
	GetCowbells() { return SavData.getUint8(this.Offset(0xF7, 0xFD, 0x103)); };
	SetCowbells(V) { SavData.setUint8(this.Offset(0xF7, 0xFD, 0x103), Math.min(250, V)); };
	/* Get the Sell price of it. */
	GetCowbellsPrice() { return SavData.getUint8(this.Offset(0xFB, 0x101, 0x107)); };
	SetCowbellsPrice(V) { SavData.setUint8(this.Offset(0xFB, 0x101, 0x107), Math.min(255, V)); };

	/* Alien Spaceship Parts. */
	GetSpaceship() { return SavData.getUint8(this.Offset(0xF8, 0xFE, 0x104)); };
	SetSpaceship(V) { SavData.setUint8(this.Offset(0xF8, 0xFE, 0x104), Math.min(250, V)); };
	/* Get the Sell price of it. */
	GetSpaceshipPrice() { return SavData.getUint8(this.Offset(0xFC, 0x102, 0x108)); };
	SetSpaceshipPrice(V) { SavData.setUint8(this.Offset(0xFC, 0x102, 0x108), Math.min(255, V)); };

	/* Nuclear Fuel Rods. */
	GetFuelrods() { return SavData.getUint8(this.Offset(0xF9, 0xFF, 0x105)); };
	SetFuelrods(V) { SavData.setUint8(this.Offset(0xF9, 0xFF, 0x105), Math.min(250, V)); };
	/* Get the Sell price of it. */
	GetFuelrodsPrice() { return SavData.getUint8(this.Offset(0xFD, 0x103, 0x109)); };
	SetFuelrodsPrice(V) { SavData.setUint8(this.Offset(0xFD, 0x103, 0x109), Math.min(255, V)); };

	/* Get the current Episode you are in. */
	GetCurrentEpisode() {
		for (let Idx = 0; Idx < 12; Idx++) {
			if (SavData.getUint8(this.Offset(0x1A3, 0x1A9, 0x1AF)) == EPVals[Idx]) return Idx;
		}

		return 12; // 12 -> "Unofficial Episode". ;P
	};

	/*
		Set the Current Episode.
		V: The Episode.
		ValidCheck: If checking for official Episodes (valid) or not. It is recommended to have this to TRUE.
	*/
	SetCurrentEpisode(V, ValidCheck) {
		if (!ValidCheck) { // In case we're not checking for validateness, Set it without checks.
		SavData.setUint8(this.Offset(0x1A3, 0x1A9, 0x1AF), V);
			SavData.setUint8(this.Offs + 0x9, V); // It's better to set that to 0x9 as well for display.
			return;
		}

		for (let Idx = 0; Idx < 12; Idx++) {
			if (V == EPVals[Idx]) {
				SavData.setUint8(this.Offset(0x1A3, 0x1A9, 0x1AF), V);
				SavData.setUint8(this.Offs + 0x9, V); // It's better to set that to 0x9 as well for display.
				break;
			}
		}
	};

	/* Return an Episode class. ( 0 - 10 ) */
	GetEpisode(EP) { return new Episode(this.Slot, Math.min(10, EP), this.Move); };

	/* Return an Cast class. ( 0 - 25 ) */
	GetCast(V) { return new Cast(this.Offset(0x466, 0x46C, 0x472) + (Math.min(25, V)) * 0xA, V); };

	/* Return a Social Move class ( 0 - 14 ) */
	GetSocialMove(V) { return new SocialMove(this.Offset(0x3EA, 0x3F0, 0x3F6) + (Math.min(14, V)) * 0x8, Math.min(14, V)); };
};