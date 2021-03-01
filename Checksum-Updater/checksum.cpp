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
#include <unistd.h>

/* Initialize the Checksum class, by loading the SAVFile. */
Checksum::Checksum(const std::string &File) {
	this->Valid = false;
	this->SavName = File;

	if (access(this->SavName.c_str(), F_OK) == 0) { // Ensure it exist.
		FILE *SAV = fopen(this->SavName.c_str(), "r");

		if (SAV) {
			/* Return SavSize. */
			fseek(SAV, 0, SEEK_END);
			this->SavSize = ftell(SAV);
			fseek(SAV, 0, SEEK_SET);

			/* Read Data and close file. */
			this->SavData = std::make_unique<uint8_t[]>(this->SavSize);
			fread(this->SavData.get(), 1, this->SavSize, SAV);
			fclose(SAV);
			this->DetectType();
		}
	}
}

/* Detecting SAVType. */
void Checksum::DetectType() {
	this->SType = SAVType::None;

	uint8_t Count = 0;
	switch(this->SavSize) {
		case 0x10000:
		case 0x20000: // GBA Checks.
			for (uint8_t i = 0; i < 7; i++) {
				if (this->SavData.get()[i] == this->GBAIdent[i]) Count++;
			}

			if (Count == 7) this->SType = SAVType::GBA; // GBA SAV.
			break;

		case 0x40000:
		case 0x80000: // NDS Checks.
			for (uint8_t Loc = 0; Loc < 5; Loc++) {
				Count = 0; // Reset.

				for (uint8_t i = 0; i < 8; i++) {
					if (this->SavData.get()[(Loc * 0x1000) + i] == this->NDSIdent[i]) Count++;
				}

				if (Count == 8) {
					this->SType = SAVType::NDS; // NDS SAV.
					break; // No need to loop this any longer.
				}
			}
			break;
	}

	this->Valid = this->SType != SAVType::None;
}

/* Check, if a SAVSlot exists. */
bool Checksum::SavSlotExist(uint8_t Slot) {
	/*
		GBA Way: Just check like the first 0x10 bytes, if they are NOT just NULL's or so.
		I could not detect any better way yet, if there is a better way, it will be used instead.
	*/
	if (this->SType == SAVType::GBA) {
		for (uint8_t i = 0; i < 0x10; i++) {
			if (this->SavData.get()[(Slot * 0x1000) + i] != 0x0) return true;
		}

		return false; // All of them are NULLs.. so i assume not valid.

	/*
		NDS Way: Check if the Header is correct.
	*/
	} else if (this->SType == SAVType::NDS) {
		for (uint8_t i = 0; i < 8; i++) {
			if (this->SavData.get()[(Slot * 0x1000) + i] != this->NDSIdent[i]) return false;
		}

		return true;
	}

	return false;
}

/* Performs the Checksum Update action. */
void Checksum::PerformUpdate(uint8_t Slot) {
	if (this->Valid) {
		if (this->SavSlotExist(Slot)) {
			uint8_t Byte1 = 0, Byte2 = 0;

			/* GBA Method. */
			if (this->SType == SAVType::GBA) {
				for (uint16_t i = 0; i < (0xFFE / 2); i++) {
					if (Byte1 + this->SavData.get()[(Slot * 0x1000) + (i * 2)] > 255) Byte2++;

					Byte1 += this->SavData.get()[(Slot * 0x1000) + (i * 2)];
					Byte2 += this->SavData.get()[(Slot * 0x1000) + (i * 2) + 1];
				}

				Byte2++;

				const uint16_t CurrentChks = *reinterpret_cast<uint16_t *>(this->SavData.get() + (Slot * 0x1000) + 0xFFE);
				const uint16_t CalcChks = (256 * (uint8_t)-Byte2) + (uint8_t)-Byte1;

				if (CurrentChks != CalcChks) {
					printf("Slot %i does not contain a valid Checksum. Would you like to fix it?\nPress 1 for yes, 0 for no: ", Slot);

					int res = 0;
					std::cin >> res;

					if (res == 1) {
						*reinterpret_cast<uint16_t *>(this->SavData.get() + (Slot * 0x1000) + 0xFFE) = CalcChks;
						this->UpdatedChecksum = true;
						printf("Checksum fixed.\n\n");

					} else {
						printf("Fix aborted.\n\n");
					}

				} else {
					printf("Slot %i has a valid Checksum and is good.\n\n", Slot);
				}

			/* NDS Method. */
			} else if (this->SType == SAVType::NDS) {
				for (uint16_t i = (0x10 / 2); i < (0x1000 / 2); i++) {
					if (i == (0x12 / 2)) continue;
					if (i == (0x28 / 2)) continue;

					if (Byte1 + this->SavData.get()[(Slot * 0x1000) + (i * 2)] > 255) Byte2++;

					Byte1 += this->SavData.get()[(Slot * 0x1000) + (i * 2)];
					Byte2 += this->SavData.get()[(Slot * 0x1000) + (i * 2) + 1];
				}

				Byte2++;

				const uint16_t CurrentChks = *reinterpret_cast<uint16_t *>(this->SavData.get() + (Slot * 0x1000) + 0x28);
				const uint16_t CalcChks = ((256 * (uint8_t)-Byte2) + (uint8_t)-Byte1);

				if (CurrentChks != CalcChks) {
					printf("Slot %i does not contain a valid Checksum. Would you like to fix it?\nPress 1 for yes, 0 for no: ", Slot + 1);

					int res = 0;
					std::cin >> res;

					if (res == 1) {
						*reinterpret_cast<uint16_t *>(this->SavData.get() + (Slot * 0x1000) + 0x28) = CalcChks;
						this->UpdatedChecksum = true;
						printf("Checksum fixed.\n\n");

					} else {
						printf("Fix aborted.\n\n");
					}

				} else {
					printf("Slot %i has a valid Checksum and is good.\n\n", Slot + 1);
				}
			}

		} else {
			printf("Slot %i does not exist.\n\n", (this->SType == SAVType::NDS ? Slot + 1 : Slot));
		}
	}
}

/* Write back to the SAVFile, if valid and at least one Checksum got fixed / updated. */
void Checksum::WriteBack() {
	if (this->Valid && this->UpdatedChecksum && this->SType != SAVType::None) {
		FILE *SAV = fopen(this->SavName.c_str(), "rb+");

		if (SAV) {
			fwrite(this->SavData.get(), 1, this->SavSize, SAV);
			fclose(SAV);
		}
	}
}