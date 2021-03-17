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

#ifndef _SIM2EDITOR_CORE_CHECKSUM_HPP
#define _SIM2EDITOR_CORE_CHECKSUM_HPP

#include "CoreCommon.hpp"

namespace Checksum {
	/* GBA Checksum. */
	uint16_t CalcGBASlot(const uint8_t *Buffer, const uint8_t Slot);
	bool GBASlotChecksumValid(const uint8_t *Buffer, const uint8_t Slot, const uint16_t CHKS);

	/* NDS Checksum. The NDS version has multiple ones though. */
	uint16_t CalcNDSSlot(const uint8_t *Buffer, const uint8_t Slot);
	bool NDSSlotChecksumValid(const uint8_t *Buffer, const uint8_t Slot, const uint16_t CHKS);

	uint16_t CalcNDSSlotHeader(const uint8_t *Buffer, const uint8_t Slot);
	bool NDSSlotChecksumHeaderValid(const uint8_t *Buffer, const uint8_t Slot, const uint16_t CHKS);

	uint16_t CalcNDSSlotShared(const uint8_t *Buffer, const uint8_t Slot);
	bool NDSSlotChecksumSharedValid(const uint8_t *Buffer, const uint8_t Slot, const uint16_t CHKS);
};

#endif