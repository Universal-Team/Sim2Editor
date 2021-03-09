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

/* Social Moves class. */
export class SocialMove {
	constructor(Offs, Action) {
		this.Action = Action; // The current Action.
		this.Offs = Offs + 0x3F0 + (this.Action * 0x8); // The Base Offset we are working with from. Also does it really start at 0x400?
	};

	/* Move Flag State. (0: Locked, 1: Unlocked, 2: Blocked) */
	GetFlag() { return SavData.getUint8(this.Offs + 0x4); };
	SetFlag(v) { SavData.setUint8(this.Offs + 0x4, Math.min(2, v)); };

	/* Move Level. (0: 1, 1: 2, 2: 3, 3: None??) */
	GetLevel() { return SavData.getUint8(this.Offs + 0x8); };
	SetLevel(v) { SavData.setUint8(this.Offs + 0x8, Math.min(3, v)); };
};