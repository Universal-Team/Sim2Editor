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

#include "SAVUtils.hpp"
#include <ctime>
#include <unistd.h> // for access().

/* Common Related things. */
static constexpr uint8_t GBAIdent[7] = { 0x53, 0x54, 0x57, 0x4E, 0x30, 0x32, 0x34 };
static constexpr uint8_t NDSIdent[8] = { 0x64, 0x61, 0x74, 0x0, 0x20, 0x0, 0x0, 0x0 };
SAVType SAVUtils::SAV = SAVType::NONE;
std::string SAVUtils::SAVName = "";

/* GBA Related things. */
std::unique_ptr<GBASAV> GBASAVUtils::SAV = nullptr;

/* NDS Related things. */
std::unique_ptr<NDSSAV> NDSSAVUtils::SAV = nullptr;


/*
	Detect the SAVType of a SAVFile.

	const std::string &File: Path to the file which to check.
*/
SAVType SAVUtils::DetectType(const std::string &File) {
	SAVType ST = SAVType::NONE;

	if (access(File.c_str(), F_OK) != 0) return ST;
	FILE *in = fopen(File.c_str(), "r");

	if (in) {
		fseek(in, 0, SEEK_END);
		const uint32_t SIZE = ftell(in);
		fseek(in, 0, SEEK_SET);

		std::unique_ptr<uint8_t[]> Data = nullptr;
		uint8_t Count = 0;

		switch(SIZE) {
			case 0x10000:
			case 0x20000: // 64, 128 KB is a GBA Size.
				Data = std::make_unique<uint8_t[]>(0x7);
				fread(Data.get(), 1, 0x7, in); // Read the first 0x7 byte (Header).

				for (uint8_t ID = 0; ID < 7; ID++) { if (Data.get()[ID] == GBAIdent[ID]) Count++; }; // Identifier Check.

				if (Count == 7) ST = SAVType::GBA; // If Count matches 7, we're good.
				break;

			case 0x40000:
			case 0x80000: // 256, 512 KB is a NDS Size.
				Data = std::make_unique<uint8_t[]>(SIZE);
				fread(Data.get(), 1, SIZE, in);

				for (uint8_t Slot = 0; Slot < 5; Slot++) { // Check for all 5 possible Slots.
					Count = 0; // Reset Count here.

					for (uint8_t ID = 0; ID < 8; ID++) { if (Data.get()[(Slot * 0x1000) + ID] == NDSIdent[ID]) Count++; };

					if (Count == 8) {
						ST = SAVType::_NDS; // It's a NDS SAV.
						break;
					}
				}

				break;
		}

		fclose(in);
	}

	return ST;
};


/*
	Load a SAVFile.

	const std::string &File: Path to the SAVFile.
	const bool DoBackup: If creating a backup or not after loading the SAVFile.

	Returns True if SAV Valid and False if Invalid.
*/
bool SAVUtils::LoadSAV(const std::string &File, const bool DoBackup) {
	const SAVType ST = SAVUtils::DetectType(File);

	if (ST != SAVType::NONE) {
		SAVUtils::SAV = ST; // Set SAVType.
		SAVUtils::SAVName = File; // Set Path.

		/* Load Proper SAV. */
		if (SAVUtils::SAV == SAVType::GBA) GBASAVUtils::SAV = std::make_unique<GBASAV>(SAVUtils::SAVName);
		else NDSSAVUtils::SAV = std::make_unique<NDSSAV>(SAVUtils::SAVName);

		if (DoBackup) SAVUtils::CreateBackup(); // Create Backup, if true.
		return true;
	}

	return false;
};


/*
	Create a Backup of the current loaded SAV.

	Backup Format would be: 'Sims2-Year.Month.Day-Hour.Minute.Second.sav'
*/
bool SAVUtils::CreateBackup() {
	std::string BackupPath = _MAIN_PATH "/Backups/"; // Base path.
	bool CreateIt = false;

	/* Fetch Time there. */
	time_t Rawtime;
	struct tm *TimeInfo;
	char TimeBuffer[80];
	time(&Rawtime);
	TimeInfo = localtime(&Rawtime);
	strftime(TimeBuffer, sizeof(TimeBuffer),"%Y.%m.%d-%H.%M.%S", TimeInfo); // Get the Time as String.

	switch(SAVUtils::SAV) {
		case SAVType::GBA:
			if (GBASAVUtils::SAV && GBASAVUtils::SAV->GetValid()) {
				BackupPath += "GBA/Sims2-" + std::string(TimeBuffer) + ".sav";
				CreateIt = true;
			}
			break;

		case SAVType::_NDS:
			if (NDSSAVUtils::SAV && NDSSAVUtils::SAV->GetValid()) {
				BackupPath += "NDS/Sims2-" + std::string(TimeBuffer) + ".sav";
				CreateIt = true;
			}
			break;

		case SAVType::NONE:
			break;
	}

	if (CreateIt) {
		FILE *out = fopen(BackupPath.c_str(), "w");
		fwrite((SAVUtils::SAV == SAVType::GBA ? GBASAVUtils::SAV->GetData() : NDSSAVUtils::SAV->GetData()), 1, (SAVUtils::SAV == SAVType::GBA ? GBASAVUtils::SAV->GetSize() : NDSSAVUtils::SAV->GetSize()), out);
		fclose(out);
	}

	return CreateIt;
};


/*
	Finish SAV Editing and unload everything.
*/
void SAVUtils::Finish() {
	const bool SAVLoaded = (SAVUtils::SAV != SAVType::NONE); // Ensure it's not NONE.

	if (SAVLoaded) {
		/* Ensure first, that we made changes, otherwise writing is useless. */
		if ((SAVUtils::SAV == SAVType::GBA ? GBASAVUtils::SAV->GetChangesMade() : NDSSAVUtils::SAV->GetChangesMade())) {
			(SAVUtils::SAV == SAVType::GBA ? GBASAVUtils::SAV->Finish() : NDSSAVUtils::SAV->Finish()); // The Finish action.

			FILE *out = fopen(SAVUtils::SAVName.c_str(), "rb+");
			fwrite((SAVUtils::SAV == SAVType::GBA ? GBASAVUtils::SAV->GetData() : NDSSAVUtils::SAV->GetData()), 1, (SAVUtils::SAV == SAVType::GBA ? GBASAVUtils::SAV->GetSize() : NDSSAVUtils::SAV->GetSize()), out);
			fclose(out);
		}
	}

	/* Now at this point, reset the SAVType + unique_ptr of the SAV. */
	SAVUtils::SAVName = "";
	if (SAVUtils::SAV == SAVType::GBA) GBASAVUtils::SAV = nullptr;
	if (SAVUtils::SAV == SAVType::_NDS) NDSSAVUtils::SAV = nullptr;
	SAVUtils::SAV = SAVType::NONE;
};

/*
	Return, if changes are made.
*/
bool SAVUtils::ChangesMade() {
	switch(SAVUtils::SAV) {
		case SAVType::GBA:
			if (GBASAVUtils::SAV) return GBASAVUtils::SAV->GetChangesMade();
			break;

		case SAVType::_NDS:
			if (NDSSAVUtils::SAV) return NDSSAVUtils::SAV->GetChangesMade();
			break;

		case SAVType::NONE:
			return false;
	}

	return false;
}

/*
	Read a string from a SAVBuffer.

	const uint8_t *Buffer: The SAVBuffer.
	const uint32_t Offset: The Offset from where to read from.
	const uint32_t Length: The Length to read.
*/
const std::string SAVUtils::ReadString(const uint8_t *Buffer, const uint32_t Offset, const uint32_t Length) {
	if (!Buffer) return "";

	std::string str;
	for (int Idx = 0; Idx < (int)Length; Idx++) {
		if (Buffer[Offset + Idx] == 0x0) break; // 0x0 -> End.

		str += Buffer[Offset + Idx];
	}

	return str;
};


/*
	Write a string to a SAVBuffer.

	uint8_t *Buffer: The SAVBuffer.
	const uint32_t Offset: The offset from where to write to.
	const uint32_t Length: The length to write.
	const std::string &str: The string to write.
*/
void SAVUtils::WriteString(uint8_t *Buffer, const uint32_t Offset, const uint32_t Length, const std::string &Str) {
	if (!Buffer) return;

	for (int Idx = 0; Idx < (int)Length; Idx++) {
		if (Idx < (int)Str.size()) Buffer[Offset + Idx] = Str[Idx]; // The index is inside the string length, so write that.
		else Buffer[Offset + Idx] = 0; // Index outside the string length.. so write 0.
	}
};