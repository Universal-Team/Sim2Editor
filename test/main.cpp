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

#include "../Sim2Editor-CPPCore/include/shared/SAVUtils.hpp"
#include <iostream> // For std::cin.
#include <stdio.h> // printf.

/*
	Return the SAVType as a String.

	const SAVType SAV: The SAVType.
*/
const std::string GetSAV(const SAVType SAV) {
	switch(SAV) {
		case SAVType::GBA:
			return "SAVType: GBA.\n\n";

		case SAVType::_NDS:
			return "SAVType: NDS.\n\n";

		case SAVType::NONE:
			return "SAVType: Invalid.\n\n";
	}

	return "SAVType: Invalid.\n\n";
};

static void Test(const std::string &file) {
	printf(GetSAV(SAVUtils::DetectType(file)).c_str());
	SAVUtils::LoadSAV(file);

	if (SAVUtils::SAV == SAVType::GBA && GBASAVUtils::SAV->SlotExist(1)) {
		printf("Sim Name: %s.\nSimoleons: %d.\nRatings: %d.\n\n",
			GBASAVUtils::SAV->GetSlot(1)->Name().c_str(),
			GBASAVUtils::SAV->GetSlot(1)->Simoleons(),
			GBASAVUtils::SAV->GetSlot(1)->Ratings()
		);
	}
};


int main(int argc, char *argv[]) {
	if (argc > 1) {
		const std::string file = argv[1];
	}

	std::string END;
	std::cin >> END;
	return 0;
};