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

#include "GBASlot.hpp"
#include "../shared/Checksum.hpp"
#include "../shared/SAVUtils.hpp"

/* Get and Set Time. */
uint16_t GBASlot::Time() const { return GBASAVUtils::Read<uint16_t>(this->Offs + 0x2); };
void GBASlot::Time(const uint16_t v) { GBASAVUtils::Write<uint16_t>(this->Offs + 0x2, v); };

/* Get and Set Simoleons. */
uint32_t GBASlot::Simoleons() const { return GBASAVUtils::Read<uint32_t>(this->Offs + 0x5) >> 8; };
void GBASlot::Simoleons(uint32_t v) { GBASAVUtils::Write<uint32_t>(this->Offs + 0x5, (std::min<uint32_t>(999999, v) << 8)); };

/* Get and Set Name. */
std::string GBASlot::Name() const { return SAVUtils::ReadString(GBASAVUtils::SAV->GetData(), this->Offs + 0xD, 0x8); };
void GBASlot::Name(const std::string &v) { SAVUtils::WriteString(GBASAVUtils::SAV->GetData(), this->Offs + 0xD, 0x8, v); };

/* Get and Set Ratings. */
uint16_t GBASlot::Ratings() const { return GBASAVUtils::Read<uint16_t>(this->Offs + 0xA); };
void GBASlot::Ratings(const uint16_t v) { GBASAVUtils::Write<uint16_t>(this->Offs + 0xA, std::min<uint16_t>(9999, v)); };

/* Get and Set Empty Chug-Chug Cola Cans Amount. */
uint8_t GBASlot::Cans() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0xFC); };
void GBASlot::Cans(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0xFC, std::min<uint8_t>(250, v)); };
/* Get and Set Empty Chug-Chug Cola Cans Sell price. */
uint8_t GBASlot::CansPrice() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0x100); };
void GBASlot::CansPrice(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0x100, v); };

/* Get and Set Cowbells Amount. */
uint8_t GBASlot::Cowbells() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0xFD); };
void GBASlot::Cowbells(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0xFD, std::min<uint8_t>(250, v)); };
/* Get and Set the Cowbells Sell price. */
uint8_t GBASlot::CowbellsPrice() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0x101); };
void GBASlot::CowbellsPrice(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0x101, v); };

/* Get and Set Alien Spaceship Parts Amount. */
uint8_t GBASlot::Spaceship() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0xFE); };
void GBASlot::Spaceship(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0xFE, std::min<uint8_t>(250, v)); };
/* Get and Set Alien Spaceship Parts Sell price. */
uint8_t GBASlot::SpaceshipPrice() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0x102); };
void GBASlot::SpaceshipPrice(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0x102, v); };

/* Get and Set Nuclear Fuelrods Amount. */
uint8_t GBASlot::Fuelrods() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0xFF); };
void GBASlot::Fuelrods(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0xFF, std::min<uint8_t>(250, v)); };
/* Get and Set Nuclear Fuelrods Sell price. */
uint8_t GBASlot::FuelrodsPrice() const { return GBASAVUtils::Read<uint8_t>(this->Offs + 0x103); };
void GBASlot::FuelrodsPrice(const uint8_t v) { GBASAVUtils::Write<uint8_t>(this->Offs + 0x103, v); };

/* Get an Episode class. */
std::unique_ptr<GBAEpisode> GBASlot::Episode(const uint8_t v) const { return std::make_unique<GBAEpisode>(this->Slot, v); };

/* Get a Cast class. */
std::unique_ptr<GBACast> GBASlot::Cast(const uint8_t v) const { return std::make_unique<GBACast>(this->Slot, v); };

/* Get a Social Move class. */
std::unique_ptr<GBASocialMove> GBASlot::SocialMove(const uint8_t v) const { return std::make_unique<GBASocialMove>(this->Slot, v); };

/*
	Fix the Checksum of the current Slot, if invalid.

	Returns false if Slot == 0 or already valid, true if got fixed.
*/
bool GBASlot::FixChecksum() {
	if (this->Slot < 1 || this->Slot > 4) return false;

	if (!Checksum::GBASlotChecksumValid(GBASAVUtils::SAV->GetData(), this->Slot, GBASAVUtils::Read<uint16_t>((this->Slot * 0x1000) + 0xFFE))) {
		GBASAVUtils::Write<uint16_t>((this->Slot * 0x1000) + 0xFFE, Checksum::CalcGBASlot(GBASAVUtils::SAV->GetData(), this->Slot));
		return true;
	}

	return false;
};