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

#include "checksum.hpp"
#include <iostream>

int main(int argc, char *argv[]) {
	printf("Sim2Editor External Tools - Checksum-Updater v0.2.0 by SuperSaiyajinStackZ.\n\n");

	if (argc > 1) {
		const char *fName = argv[1];
		printf("Detected the following parameter: %s.\n", fName);

		std::unique_ptr<Checksum> chks = std::make_unique<Checksum>(fName);

		if (chks->IsValid()) {
			printf("This is a valid SAV.. continue with the SAVType check.\n\n");

			if (chks->GetType() != SAVType::None) {
				if (chks->GetType() == SAVType::GBA) { // GBA SAV Detected.
					printf("Detected a GBA SAV! Continue with the Checksum operations...\n\n");
					/* GBA has 4 SAVSlots, hence do a for loop with 4. */
					for (uint8_t i = 0; i < 4; i++) chks->PerformUpdate(i + 1);
					chks->WriteBack();
					printf("Checksum operation done!\n\n");

				} else if (chks->GetType() == SAVType::NDS) {
					printf("Detected a NDS SAV! Continue with the Checksum operations...\n\n");
					/* NDS has 5 SAVSlots in the SAVFile, hence do a for loop with 5. */
					for (uint8_t i = 0; i < 5; i++) chks->PerformUpdate(i);
					chks->WriteBack();
					printf("Checksum operation done!\n\n");
				}

			} else {
				printf("The SAVType which got detected is invalid. Are you sure this is a THE SIMS 2 GBA or NDS SAV?\n\n");
			}

		} else {
			printf("The SAV is not a valid one. Are you sure this is a THE SIMS 2 GBA or NDS SAV?\n\n");
		}

	} else {
		printf("You did not provide enough parameters. Please drag and drop your SAVFile into the executable.\n\n");
	}

	std::string END;
	printf("Close the window to exit.");
	std::cin >> END;

	return 0;
}