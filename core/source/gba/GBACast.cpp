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

#include "GBACast.hpp"
#include "../shared/SAVUtils.hpp"

/* Get and Set Friendly Conversation level. */
uint8_t GBACast::Friendly() const { return GBASAVUtils::Read<uint8_t>(this->Offs); };
void GBACast::Friendly(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs, std::min<uint8_t>(3, v)); };

/* Get and Set Romance Conversation level. */
uint8_t GBACast::Romance() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0x1); };
void GBACast::Romance(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0x1, std::min<uint8_t>(3, v)); };

/* Get and Set Intimidate Conversation level. */
uint8_t GBACast::Intimidate() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0x2); };
void GBACast::Intimidate(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0x2, std::min<uint8_t>(3, v)); };

/* Get and Set Alternative Picture Unlock state. */
bool GBACast::Alternativepic() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0x3); };
void GBACast::Alternativepic(const bool v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0x3, v); };

/* Get and Set Mystery Unlock state. */
bool GBACast::Mystery() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0x8); };
void GBACast::Mystery(const bool v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0x8, v); };