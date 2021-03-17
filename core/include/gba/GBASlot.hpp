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

#ifndef _SIM2EDITOR_CORE_GBA_SLOT_HPP
#define _SIM2EDITOR_CORE_GBA_SLOT_HPP

#include "CoreCommon.hpp"
#include "GBACast.hpp"
#include "GBAEpisode.hpp"
#include "GBASocialMove.hpp"

class GBASlot {
public:
	GBASlot(const uint8_t Slot) : Slot(Slot), Offs(Slot * 0x1000) { };

	uint16_t Time() const;
	void Time(const uint16_t v);

	uint32_t Simoleons() const;
	void Simoleons(const uint32_t v);

	std::string Name() const;
	void Name(const std::string &v);

	uint16_t Ratings() const;
	void Ratings(const uint16_t v);

	uint8_t Cans() const;
	void Cans(const uint8_t v);
	uint8_t CansPrice() const;
	void CansPrice(const uint8_t v);

    uint8_t Cowbells() const;
    void Cowbells(const uint8_t v);
    uint8_t CowbellsPrice() const;
    void CowbellsPrice(const uint8_t v);

    uint8_t Spaceship() const;
    void Spaceship(const uint8_t v);
    uint8_t SpaceshipPrice() const;
    void SpaceshipPrice(const uint8_t v);

    uint8_t Fuelrods() const;
    void Fuelrods(const uint8_t v);
    uint8_t FuelrodsPrice() const;
    void FuelrodsPrice(const uint8_t v);

	std::unique_ptr<GBAEpisode> Episode(const uint8_t v) const;
	std::unique_ptr<GBACast> Cast(const uint8_t v) const;
	std::unique_ptr<GBASocialMove> SocialMove(const uint8_t v) const;

	bool FixChecksum();
private:
	uint8_t Slot = 0;
	uint32_t Offs = 0;
};

#endif