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

#ifndef _SIM2EDITOR_EXTERNAL_TOOLS_CHECKSUM_HPP
#define _SIM2EDITOR_EXTERNAL_TOOLS_CHECKSUM_HPP

#include <memory>
#include <string>

/* Used to Identify the proper SAVType for updating the checksum. */
enum class SAVType {
	None,
	GBA,
	NDS
};

class Checksum {
public:
	Checksum(const std::string &File);
	void DetectType();
	void PerformUpdate(uint8_t Slot);
	void WriteBack();
	bool IsValid() const { return this->Valid; };
	SAVType GetType() const { return this->SType; };
	bool SavSlotExist(uint8_t Slot);
private:
	const uint8_t GBAIdent[0x7] = { 0x53, 0x54, 0x57, 0x4E, 0x30, 0x32, 0x34 };
	const uint8_t NDSSlotHeader[0x3] = { 'd', 'a', 't' }; // NOTE: This seems to be always the Slot header. It'll be '* * *' if the Checksum got invalid and SAV tries to remove it.
	std::unique_ptr<uint8_t[]> SavData = nullptr;
	uint32_t SavSize = 0;
	SAVType SType = SAVType::None;
	std::string SavName = "";
	bool Valid = false, UpdatedChecksum = false;
};

#endif