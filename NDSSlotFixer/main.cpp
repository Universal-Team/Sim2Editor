/*
*   This file is part of Sim2Editor - External Tools
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

#include "common.hpp"

static std::unique_ptr<uint8_t[]> SavData = nullptr; // SAVData.
static uint32_t SavSize = 0;
static const uint8_t SlotIdent[0x8] = { 0x64, 0x61, 0x74, 0x0, 0x20, 0x0, 0x0, 0x0 }; // Slot Identifier.

/*
	Load a SAVFile.

	const std::string &Path: The path to the SAVFile.
*/
static bool LoadSav(const std::string &Path) {
	bool res = false; // What we return.
	FILE *SAV = fopen(Path.c_str(), "r");

	if (SAV) {
		fseek(SAV, 0, SEEK_END);
		const uint32_t SavSize = ftell(SAV);
		fseek(SAV, 0, SEEK_SET);

		if (SavSize == 0x40000 || SavSize == 0x80000) {
			SavData = std::make_unique<uint8_t[]>(SavSize); // Create Buffer.
			fread(SavData.get(), 1, SavSize, SAV);

			uint8_t Count = 0;
			for (uint8_t Loc = 0; Loc < 5; Loc++) {
				Count = 0; // Reset.

				for (uint8_t i = 0; i < 8; i++) {
					if (SavData.get()[(Loc * 0x1000) + i] == SlotIdent[i]) Count++;
				}

				if (Count == 8) {
					res = true;
					break;
				}
			}
		}

		fclose(SAV);
	}

	return res;
}

/*
	Calculates the Slot.

	const uint8_t Slot: The Slot which to calculate.
*/
static uint16_t CalcSlot(const uint8_t Slot) {
	std::cout << "Calculating Slot " << std::to_string(Slot) << "...\n";

	uint8_t Byte1 = 0, Byte2 = 0;

	for (uint16_t i = (0x14 / 2); i < (0x1000 / 2); i++) {
		if (Byte1 + SavData.get()[(Slot * 0x1000) + (i * 2)] > 255) Byte2++;

		Byte1 += SavData.get()[(Slot * 0x1000) + (i * 2)];
		Byte2 += SavData.get()[(Slot * 0x1000) + (i * 2) + 1];
	}

	Byte2++;

	return ((256 * (uint8_t)-Byte2) + (uint8_t)-Byte1); // Return as uint16_t.
}

/*
	Fixes the header.

	const uint8_t Slot: The Slot which to fix the header.
*/
static void HeaderFix(const uint8_t Slot) {
	printf("Setting the initial Header for Slot %i...\n", Slot);

	/* Set initial header. */
	const uint8_t HDR[14] = { 0x64, 0x61, 0x74, 0x0, 0x20, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0 };
	for (uint8_t i = 0; i < 14; i++) SavData.get()[(Slot * 0x1000) + i] = HDR[i];

	printf("Restoring SAVCount for the Header for Slot %i...\n", Slot);
	/* Restore SAVCount. */
	const uint32_t SAVCount = *reinterpret_cast<uint32_t *>(SavData.get() + (Slot * 0x1000) + 0x14); // 0x14 seems to be the SAVCount there?
	*reinterpret_cast<uint32_t *>(SavData.get() + (Slot * 0x1000) + 0x8) = SAVCount;

	printf("Restoring Slot Position for the Header for Slot %i...\n", Slot);
	/* Restore SAVSlot Position. */
	const uint16_t SlotPosition = *reinterpret_cast<uint16_t *>(SavData.get() + (Slot * 0x1000) + 0x22); // 0x22 seems to be the Slot Position there?
	*reinterpret_cast<uint16_t *>(SavData.get() + (Slot * 0x1000) + 0xC) = SlotPosition;


	printf("Fixing Header for Slot %i...\n", Slot);
	uint8_t Byte1 = 0, Byte2 = 0;

	for (uint16_t i = 0x0; i < (0x13 / 2); i++) {
		if (i == (0xE / 2)) continue;

		if (Byte1 + (SavData.get()[(Slot * 0x1000) + (i * 2)]) > 255) Byte2++;

		Byte1 += SavData.get()[(Slot * 0x1000) + (i * 2)];
		Byte2 += SavData.get()[(Slot * 0x1000) + (i * 2) + 1];
	}

	if (SavData.get()[(Slot * 0x1000) + 0x13] == 0x0) Byte2++; // If 0x13 is 0, then it just got created and hence, add +1 to Byte2.

	*reinterpret_cast<uint16_t *>(SavData.get() + (Slot * 0x1000) + 0xE) = ((256 * (uint8_t)-Byte2) + (uint8_t)-Byte1);
	printf("Fixed!\n\n");
}

int main(int argc, char *argv[]) {
	printf(START_STR);

	if (argc > 1) {
		const char *FName = argv[1];
		printf("Detected the following parameter: %s.\n", FName);

		if (LoadSav(FName)) {
			bool SlotFixed = false;

			printf("This is a valid SAV.. Checking for corrupted Headers now...\n\n");

			for (uint8_t Slot = 0; Slot < 5; Slot++) {
				uint16_t CHK = 0; // Checksum value for 0x10 - 0x11.
				bool needsFix = true;

				for (uint8_t i = 0; i < 3; i++) {
					/* NOTE: 0x2A on the first 3 bytes means, the header got corrupted from game. */
					if (SavData.get()[(Slot * 0x1000) + i] != 0x2A) {
						needsFix = false;
						printf("Slot %i is not corrupted.\n\n", Slot);
						break;
					}
				}

				if (needsFix) {
					printf("Fixes are neccessary for Slot %i.. Fix in progress.\n\n", Slot);
					CHK = CalcSlot(Slot);
					*reinterpret_cast<uint16_t *>(SavData.get() + (Slot * 0x1000) + 0x10) = CHK; // Set 0x10 checksum.
					HeaderFix(Slot);
					SlotFixed = true;
				}
			}

			if (SlotFixed) {
				/* Because at least one Slot got fixed, we write back to file. */
				FILE *SAV = fopen(FName, "rb+");
				fwrite(SavData.get(), 1, SavSize, SAV);
				fclose(SAV);
			}

		} else {
			printf("The SAV is not a valid one. Are you sure this is a THE SIMS 2 NDS SAV?\n\n");
		}

	} else {
		printf("You did not provide enough parameters. Please drag and drop your SAVFile into the executable.\n\n");
	}

	std::string END;
	printf("Close the window to exit.");
	std::cin >> END;
	return 0;
}