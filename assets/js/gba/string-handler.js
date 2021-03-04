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

/* English. */
import Casts_EN from './strings/en/casts.js';
import Collectables_EN from './strings/en/collectables.js';
import Episodes_EN from './strings/en/episodes.js';

/* German. */
import Casts_DE from './strings/de/casts.js';
import Collectables_DE from './strings/de/collectables.js';
import Episodes_DE from './strings/de/episodes.js';

export let Casts, Collectables, Episodes;

/*
	Load Strings.

	v: The 0xA byte from the SAVFile.
*/
export function LoadStrings(v) {
	switch(v) {
		case 0: // English.
			Casts = Casts_EN;
			Collectables = Collectables_EN;
			Episodes = Episodes_EN;
			break;

		case 3: // German.
			Casts = Casts_DE;
			Collectables = Collectables_DE;
			Episodes = Episodes_DE;
			break;

		default: // Default to English.
			Casts = Casts_EN;
			Collectables = Collectables_EN;
			Episodes = Episodes_EN;
			break;
	}
}