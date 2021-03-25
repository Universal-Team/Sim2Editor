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
	The GBA Version uses the same method for all Checksums, so just have it like this, so no need for duplicate code.
	The checksum places are the following:
	-    0x0 -   0x18 (Settings Checksum, 0xE - 0xF).
	- 0x1000 - 0x1FFF (SAVSlot 1 Checksum, 0x1FFE - 0x1FFF).
	- 0x2000 - 0x2FFF (SAVSlot 2 Checksum, 0x2FFE - 0x2FFF).
	- 0x3000 - 0x3FFF (SAVSlot 3 Checksum, 0x3FFE - 0x3FFF).
	- 0x4000 - 0x4FFF (SAVSlot 4 Checksum, 0x4FFE - 0x4FFF).
*/
function GBACommonCalc(Buffer, StartIndex, EndIndex, IsSetting) {
	let Byte1 = 0, Byte2 = 0;

	for(let Index = StartIndex; Index < EndIndex; Index++) {
		if (IsSetting) {
			if (Index == 0xE / 2) continue;
		}

		Byte1 = (Byte1 + Buffer.getUint8((Index * 2)));

		if (Byte1 > 255) {
			Byte1 = Byte1 % 256;
			Byte2++;
		}

		Byte2 = (Byte2 + Buffer.getUint8(((Index * 2) + 1))) % 256;
	}

	Byte2++;
	if (Byte2 > 255) Byte2 = 0; // 256 -> 0.

	return (256 * (256 - Byte2)) + (256 - Byte1); // Return it as an uint16_t.
};


/*
	Calculates the GBASlot Checksum (0xFFE - 0xFFF).

	Buffer: The SAVBuffer.
	Slot: The SAVSlot. (1 - 4)
*/
export function CalculateGBAChecksum(Buffer, Slot) {
	if (!Buffer || Slot < 0 || Slot > 4) return -1;
	return GBACommonCalc(Buffer, (Slot * 0x1000) / 2, ((Slot * 0x1000) + 0xFFE) / 2, false);
};

/*
	Return if the Checksum is valid of a GBASlot.

	Buffer: The SAVBuffer.
	Slot: The SAVSlot. (1 - 4)
	Chks: The current Checksum value.
*/
export function GBAChecksumGood(Buffer, Slot, Chks) { return (CalculateGBAChecksum(Buffer, Slot) == Chks); };

/*
	Calculates the GBA Settings Checksum (0xE - 0xF).

	Buffer: The SAVBuffer.
*/
export function CalcGBASettings(Buffer) { return GBACommonCalc(Buffer, 0x0, 0x18 / 2, true); };

/*
	Return if the Checksum is valid of the GBASettings at 0xE - 0xF.

	Buffer: The SAVBuffer.
	Chks: The current Checksum value.
*/
export function GBASettingsValid(Buffer, Chks) { return (CalcGBASettings(Buffer) == Chks); };