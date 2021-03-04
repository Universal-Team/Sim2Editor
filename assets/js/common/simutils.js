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

/*
	Format a value with proper 0's. Example: 001.

	v: The Value.
	Nums: The amount of ZERO's.

	TODO: Get this cleaner done. I'm sure there is a way to handle it with less lines of code, but lazyness is there.
*/
export function SimUtils_NumberFormat(v, Nums) {
	switch(Nums) {
		case 1:
			if (v < 10) return "0" + v;
			else return v;
			break;

		case 2:
			if (v < 10) return "00" + v;
			else if (v > 9 && v < 100) return "0" + v;
			else return v;
			break;

		case 3:
			if (v < 10) return "000" + v;
			else if (v > 9 && v < 100) return "00" + v;
			else if (v > 99 && v < 1000) return "0" + v;
			else return v;
	}

	return v;
};

/*
	Convert the Time into a 'XX:XX' string. Example: 23:59.

	v: The time as an uint16.
*/
export function SimUtils_TimeString(v) {
	const hour = v[0];
	const minute = v[1];

	return SimUtils_NumberFormat(hour, 1) + ":" + SimUtils_NumberFormat(minute, 1);
};

/*
	Convert the Simoleons into an 'XXX.XXX$' string. Example: 999.999$.

	v: The Simoleon amount.
*/
export function SimUtils_SimoleonFormat(v) {
	let Simoleons = v.toString(), Final;

	if (Simoleons.length > 3) { // If larger than 3, we add a period.
		const len = Simoleons.length;

		switch(len) {
			case 4:
				Final = Simoleons.substring(0, 1);
				Final += '.';
				Final += Simoleons.substring(1);
				break;

			case 5:
				Final = Simoleons.substring(0, 2);
				Final += '.';
				Final += Simoleons.substring(2);
				break;

			case 6:
				Final = Simoleons.substring(0, 3);
				Final += '.';
				Final += Simoleons.substring(3);
				break;

			case 7:
			case 8:
			case 9: // Just in case.
				Final = Simoleons;
				break;
		}

	} else {
		Final = Simoleons;
	}

	Final += '$'; // Simoleons sign.
	return Final;
};