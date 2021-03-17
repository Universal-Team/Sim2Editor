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

#include "GBAEpisode.hpp"
#include "../shared/SAVUtils.hpp"

/* Get and Set Episode Ratings. */
uint8_t GBAEpisode::Rating(const uint8_t category) const { return GBASAVUtils::Read<uint8_t>(this->Offs + std::min<uint8_t>(3, category)); };
void GBAEpisode::Rating(const uint8_t category, const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + std::min<uint8_t>(3, category), std::min<uint8_t>(25, v)); };

/* Get and Set the Unlocked State. */
bool GBAEpisode::State() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0x4); };
void GBAEpisode::State(const bool v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0x4, v); };