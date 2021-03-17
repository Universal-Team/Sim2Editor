/*
*   This file is part of Sim2Editor-Core
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

#include "Checksum.hpp"

/*
	Calculates the GBASlot Checksum (0xFFE - 0xFFF).

	const uint8_t *Buffer: The SAVBuffer.
	const uint8_t Slot: The SAVSlot ( 1 - 4 ).
*/
uint16_t Checksum::CalcGBASlot(const uint8_t *Buffer, const uint8_t Slot) {
	if (Slot > 4 || Slot < 1) return 0; // Return 0, because invalid Slot.

	uint8_t Byte1 = 0, Byte2 = 0;
	for (uint16_t Idx = 0; Idx < (0xFFE / 2); Idx++) {
		if (Buffer[(Slot * 0x1000) + (Idx * 2)] + Byte1 > 255) Byte2++;

		Byte1 += Buffer[(Slot * 0x1000) + (Idx * 2)];
		Byte2 += Buffer[(Slot * 0x1000) + (Idx * 2) + 1];
	}

	Byte2++;
	return (256 * (uint8_t)-Byte2) + (uint8_t)-Byte1;
};
/*
	Return if the Checksum is valid of a GBASlot.

	const uint8_t *Buffer: The SAVBuffer.
	const uint8_t Slot: The SAVSlot ( 1 - 4 ).
	const uint16_t CHKS: The current Checksum.
*/
bool Checksum::GBASlotChecksumValid(const uint8_t *Buffer, const uint8_t Slot, const uint16_t CHKS) { return Checksum::CalcGBASlot(Buffer, Slot) == CHKS; };


/*
	Calculates the NDS Main Slot Checksum (0x28 - 0x29).

	const uint8_t *Buffer: The SAVBuffer.
	const uint8_t Slot: The SAVSlot ( 0 - 4 ).
*/
uint16_t Checksum::CalcNDSSlot(const uint8_t *Buffer, const uint8_t Slot) {
	if (Slot > 4) return 0; // Return 0, because invalid Slot.

	uint8_t Byte1 = 0, Byte2 = 0;
	for (uint16_t Idx = (0x10 / 2); Idx < (0x1000 / 2); Idx++) {
		if (Idx == (0x12 / 2)) continue; // Counts to header, which should not be calculated for the main slot.
		if (Idx == (0x28 / 2)) continue; // Main Slot Checksum.

		if (Byte1 + Buffer[(Slot * 0x1000) + (Idx * 2)] > 255) Byte2++;

		Byte1 += Buffer[(Slot * 0x1000) + (Idx * 2)];
		Byte2 += Buffer[(Slot * 0x1000) + (Idx * 2) + 1];
	}

	Byte2++;
	return ((256 * (uint8_t)-Byte2) + (uint8_t)-Byte1);
};
/*
	Return if the Checksum is valid of a NDSSlot.

	const uint8_t *Buffer: The SAVBuffer.
	const uint8_t Slot: The SAVSlot ( 0 - 4 ).
	const uint16_t CHKS: The current Checksum.
*/
bool Checksum::NDSSlotChecksumValid(const uint8_t *Buffer, const uint8_t Slot, const uint16_t CHKS) { return Checksum::CalcNDSSlot(Buffer, Slot) == CHKS; };


/*
	Calculates the NDS Header Slot Checksum (0xE - 0xF).

	const uint8_t *Buffer: The SAVBuffer.
	const uint8_t Slot: The SAVSlot ( 0 - 4 ).
*/
uint16_t Checksum::CalcNDSSlotHeader(const uint8_t *Buffer, const uint8_t Slot) {
	if (Slot > 4) return 0; // Return 0, because invalid Slot.

	uint8_t Byte1 = 0, Byte2 = 0;
	for (uint16_t Idx = 0x0; Idx < (0x13 / 2); Idx++) {
		if (Idx == (0xE / 2)) continue; // Main SlotHeader Checksum.

		if (Byte1 + Buffer[(Slot * 0x1000) + (Idx * 2)] > 255) Byte2++;

		Byte1 += Buffer[(Slot * 0x1000) + (Idx * 2)];
		Byte2 += Buffer[(Slot * 0x1000) + (Idx * 2) + 1];
	}

	Byte2++;
	return ((256 * (uint8_t)-Byte2) + (uint8_t)-Byte1);
};
/*
	Return if the Checksum is valid of a NDSSlot Header.

	const uint8_t *Buffer: The SAVBuffer.
	const uint8_t Slot: The SAVSlot ( 0 - 4 ).
	const uint16_t CHKS: The current Checksum.
*/
bool Checksum::NDSSlotChecksumHeaderValid(const uint8_t *Buffer, const uint8_t Slot, const uint16_t CHKS) { return Checksum::CalcNDSSlotHeader(Buffer, Slot) == CHKS; };


/*
	Calculates the NDS Shared Slot Checksum (0x10 - 0x11).

	const uint8_t *Buffer: The SAVBuffer.
	const uint8_t Slot: The SAVSlot ( 0 - 4 ).
*/
uint16_t Checksum::CalcNDSSlotShared(const uint8_t *Buffer, const uint8_t Slot) {
	if (Slot > 4) return 0; // Return 0, because invalid Slot.

	uint8_t Byte1 = 0, Byte2 = 0;
	for (uint16_t Idx = (0x14 / 2); Idx < (0x1000 / 2); Idx++) {
		if (Byte1 + Buffer[(Slot * 0x1000) + (Idx * 2)] > 255) Byte2++;

		Byte1 += Buffer[(Slot * 0x1000) + (Idx * 2)];
		Byte2 += Buffer[(Slot * 0x1000) + (Idx * 2) + 1];
	}

	Byte2++;
	return ((256 * (uint8_t)-Byte2) + (uint8_t)-Byte1);
};
/*
	Return if the Checksum is valid of a NDSSlot's Shared Checksum.

	const uint8_t *Buffer: The SAVBuffer.
	const uint8_t Slot: The SAVSlot ( 0 - 4 ).
	const uint16_t CHKS: The current Checksum.
*/
bool Checksum::NDSSlotChecksumSharedValid(const uint8_t *Buffer, const uint8_t Slot, const uint16_t CHKS) { return Checksum::CalcNDSSlotShared(Buffer, Slot) == CHKS; };