/*
	Diese Datei ist Teil von Sim2Editor External Tools.
	Copyright (C) 2020-2021 bei SuperSaiyajinStackZ.

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.

	Additional Terms 7.b and 7.c of GPLv3 apply to this file:
		* Requiring preservation of specified reasonable legal notices or
		  author attributions in that material or in the Appropriate Legal
		  Notices displayed by works containing it.
		* Prohibiting misrepresentation of the origin of that material,
		  or requiring that modified versions of such material be marked in
		  reasonable ways as different from the original version.
*/

#include "common.hpp"

static const uint8_t SlotIdent[0x3] = { 0x64, 0x61, 0x74 }; // Slot Identifier.
static std::unique_ptr<uint8_t[]> SavData = nullptr; // SAVData.
//static bool Valid = false; // Not used for now.

/*
	Load a SAVFile.

	const std::string &Path: The path to the SAVFile.
*/
static bool LoadSav(const std::string &Path) {
	FILE *SAV = fopen(Path.c_str(), "r");

	if (SAV) {
		fseek(SAV, 0, SEEK_END);
		const uint32_t SavSize = ftell(SAV);
		fseek(SAV, 0, SEEK_SET);

		if (SavSize >= 0x5000) {
			SavData = std::make_unique<uint8_t[]>(SavSize); // Create Buffer.
			fread(SavData.get(), 1, SavSize, SAV);
			fclose(SAV);

			return true;

		} else {
			fclose(SAV);
			return false;
		}
	}

	return false;
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
		for (uint8_t ID = 0; ID < 3; ID++) {
			if (SavData.get()[(0x1000 * Slot) + ID] == SlotIdent[ID]) IDCount++;
		}

		/* If 3, then it passed "d a t". */
		if (IDCount == 3) {
			/* Check, if current slot is also the actual SAVSlot. It seems 0xC and 0xD added is the Slot, however 0xD seems never be touched from the game and hence like all the time 0x0? */
			if ((SavData.get()[(0x1000 * Slot) + SLOT_OFFS] + SavData.get()[(0x1000 * Slot) + SLOT_OFFS + 1]) == SAVSlot) {

				/* Now get the SAVCount. */
				SAVCount[Slot] = *reinterpret_cast<uint32_t *>(SavData.get() + (0x1000 * Slot) + SAV_COUNT_OFFS);
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
	std::cout << START_STR;

	if (argc > 1) {
		const std::string FName = argv[1];

		std::cout << "Detected the following parameter: " << FName << ".\n";

		if (LoadSav(FName)) {
			std::cout << "This is a valid SAV.. Checking for the Last Saved Slots now...\n\n";

			for (uint8_t Slot = 0; Slot < 3; Slot++) {
				const int LSS = LSSD(Slot);

				if (LSS >= 0) {
					std::cout << "Slot " << std::to_string(Slot + 1) << "'s last saved location is: " << std::to_string(LSS) << " which can be found at: " << "0x" << std::hex << (0x1000 * LSS) << ".\n\n";

				} else {
					std::cout << "Slot " << std::to_string(Slot + 1) << " don't seem to exist inside the SAVFile.\n\n";
				}
			}

		} else {
			std::cout << "The SAV is not a valid one. Are you sure this is a THE SIMS 2 NDS SAV?\n\n";
		}

	} else {
		std::cout << "You did not provide enough parameters. Please drag and drop your SAVFile into the executable.\n\n";
	}

	std::string END;
	std::cout << "Close the window to exit.";
	std::cin >> END;

	return 0;
}