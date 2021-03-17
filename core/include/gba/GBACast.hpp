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

#ifndef _SIM2EDITOR_CORE_GBA_CAST_HPP
#define _SIM2EDITOR_CORE_GBA_CAST_HPP

#include "../shared/CoreCommon.hpp"

class GBACast {
public:
	GBACast(const uint8_t Slot, const uint8_t Cast)
		: Cast(Cast), Offs((Slot * 0x1000) + 0x46C + (std::min<uint8_t>(25, Cast)) * 0xA) { };

	uint8_t Index() const { return this->Cast; };

	uint8_t Friendly() const;
	void Friendly(const uint8_t v);

	uint8_t Romance() const;
	void Romance(const uint8_t v);

	uint8_t Intimidate() const;
	void Intimidate(const uint8_t v);

	bool Alternativepic() const;
	void Alternativepic(const bool v);

	bool Mystery() const;
	void Mystery(const bool v);
private:
	uint8_t Cast = 0;
	uint32_t Offs = 0;
};

#endif