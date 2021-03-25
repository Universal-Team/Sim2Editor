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

export class Cast {
	constructor(Offs, Cst) {
		this.Offs = Offs; // The Base Offset we are working with from.
		this.Cst = Cst; // The current Cast, useful for display, maybe.
	};

	/* Friendly Interaction Level. */
	GetFriendly() { return SavData.getUint8(this.Offs); };
	SetFriendly(V) { SavData.setUint8(this.Offs, Math.min(3, V)); };

	/* Romance Interaction Level. */
	GetRomance() { return SavData.getUint8(this.Offs + 0x1); };
	SetRomance(V) { SavData.setUint8(this.Offs + 0x1, Math.min(3, V)); };

	/* Intimidate Interaction Level. */
	GetIntimidate() { return SavData.getUint8(this.Offs + 0x2); };
	SetIntimidate(V) { SavData.setUint8(this.Offs + 0x2, Math.min(3, V)); };

	/* Shows the Alternative (Friendly) picture. */
	GetAlternatePic() { return SavData.getUint8(this.Offs + 0x3); };
	SetAlternatePic(V) { SavData.setUint8(this.Offs + 0x3, Math.min(1, V)); };

	/* The mystery of the cast locked (false) or unlocked (true). */
	GetMystery() { return SavData.getUint8(this.Offs + 0x8); };
	SetMystery(V) { SavData.setUint8(this.Offs + 0x8, Math.min(1, V)); };
};