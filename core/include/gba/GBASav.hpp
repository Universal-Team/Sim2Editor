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

#ifndef _SIM2EDITOR_CORE_GBA_SAV_HPP
#define _SIM2EDITOR_CORE_GBA_SAV_HPP

#include "GBASlot.hpp"

class GBASAV {
public:
	GBASAV(const std::string &SAVFile);

	/* Core Returns and Actions. */
	std::unique_ptr<GBASlot> GetSlot(const uint8_t Slot);
	void Finish();
	bool SlotExist(const uint8_t Slot);

	/* Some Returns. */
	uint32_t GetSize() const { return this->SAVSize; };
	uint8_t *GetData() const { return this->SAVData.get(); };
	bool GetValid() const { return this->SAVValid; };
	bool GetChangesMade() const { return this->SAVChangesMade; };
	void SetChangesMade(const bool v) { this->SAVChangesMade = v; };
private:
	std::unique_ptr<uint8_t[]> SAVData = nullptr;
	uint32_t SAVSize = 0;
	bool SAVValid = false, SAVChangesMade = false;
};

#endif