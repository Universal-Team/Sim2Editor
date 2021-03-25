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

import { CalcGBASettings, GBASettingsValid } from '../../common/checksum.js';
import { SavData } from './savutils.js';

const MusicLevels = [ 0x0, 0x19, 0x32, 0x4B, 0x64, 0x7D, 0x96, 0xAF, 0xC8, 0xE1, 0xFF ];
const SFXLevels   = [ 0x0, 0x0C, 0x18, 0x24, 0x30, 0x3C, 0x48, 0x54, 0x60, 0x6C, 0x80 ];

/*
	Languages and Values.
	00: EN, // English
	01: NL, // Nederlands
	02: FR, // Français
	03: DE, // Deutsch
	04: IT, // Italiano
	05: ES  // Español
*/

export class GBASettings {
	constructor() { };

	UpdateChecksum() {
		if (!GBASettingsValid(SavData, SavData.getUint16(0xE, true))) { // Update if not valid.
			SavData.setUint16(0xE, CalcGBASettings(SavData), true);
		}
	};

	/* Get and Set the Sound Effect Volume. */
	GetSFX() { return SavData.getUint8(0x8); };
	SetSFX(V) {
		if (V > 10) return; // 0 - 10 only valid.
		SavData.setUint8(0x8, SFXLevels[V]);
	};

	/* Get and Set the Music Volume. */
	GetMusic() { return SavData.getUint8(0x9); };
	SetMusic(V) {
		if (V > 10) return; // 0 - 10 only valid.
		SavData.setUint8(0x9, MusicLevels[V]);
	};

	/* Get and Set the Language. */
	GetLanguage() {
		if (SavData.getUint8(0xA) > 5) return 0; // Technically, that would be a "blank" Language in game, but ehh that's not good.
		return SavData.getUint8(0xA);
	};
	SetLanguage(V) { SavData.setUint8(0xA, Math.min(5, V)); };
};