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

static const uint8_t SlotIdent[0x8] = { 0x64, 0x61, 0x74, 0x0, 0x20, 0x0, 0x0, 0x0 }; // Slot Identifier.
static std::unique_ptr<uint8_t[]> SavData = nullptr; // SAVData.

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
	Returns the Last Saved Slot. (-1 if not existent).

	const uint8_t SAVSlot: The Slot which to check. ( 0 - 4 )
*/
static int LSSD(const uint8_t SAVSlot) {
	if (!SavData) return -1; // Also return -1 there.

	int LastSavedSlot = -1, IDCount = 0;
	uint32_t SAVCount[5] = { 0x0 }; // Correction: It IS indeed 4 byte, hence uint32_t.
	bool SAVSlotExist[5] = { false };

	/* Looping 5 times. */
	for (uint8_t Slot = 0; Slot < 5; Slot++) {
		IDCount = 0; // First reset here to 0.

		/* Check for Identifier. */
		for (uint8_t ID = 0; ID < 0x8; ID++) {
			if (SavData.get()[(Slot * 0x1000) + ID] == SlotIdent[ID]) IDCount++;
		}

		/* If 8, then it passed the header. */
		if (IDCount == 8) {
			/* Check, if current slot is also the actual SAVSlot. It seems 0xC and 0xD added is the Slot, however 0xD seems never be touched from the game and hence like all the time 0x0? */
			if ((SavData.get()[(Slot * 0x1000) + SLOT_OFFS] + SavData.get()[(Slot * 0x1000) + SLOT_OFFS + 1]) == SAVSlot) {

				/* Now get the SAVCount. */
				SAVCount[Slot] = *reinterpret_cast<uint32_t *>(SavData.get() + (Slot * 0x1000) + SAV_COUNT_OFFS);
				SAVSlotExist[Slot] = true;
			}
		}
	}

	/* Here we check and return the proper last saved Slot. */
	uint32_t HighestCount = 0, LSS = -1;

	for (uint8_t Slot = 0; Slot < 5; Slot++) {
		if (SAVSlotExist[Slot]) { // Ensure the Slot existed before.

			if (SAVCount[Slot] > HighestCount) { // Ensure count is higher.
				HighestCount = SAVCount[Slot];
				LSS = Slot;
			}
		}
	}

	return LSS;
}

int main(int argc, char *argv[]) {
	printf(START_STR);

	if (argc > 1) {
		const char *FName = argv[1];

		printf("Detected the following parameter: %s.\n", FName);

		if (LoadSav(FName)) {
			printf("This is a valid SAV.. Checking for the Last Saved Slots now...\n\n");

			for (uint8_t Slot = 0; Slot < 3; Slot++) {
				const int LSS = LSSD(Slot);

				if (LSS >= 0) {
					printf("Slot %i's last saved location is: %i, which can be found at: 0x%04x.\n\n", Slot + 1, LSS, LSS * 0x1000);

				} else {
					printf("Slot %i don't seem to exist inside the SAVFile.\n\n", Slot + 1);
				}
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