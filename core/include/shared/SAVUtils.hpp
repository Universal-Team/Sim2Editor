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

#ifndef _SIM2EDITOR_CORE_SAV_UTILS_HPP
#define _SIM2EDITOR_CORE_SAV_UTILS_HPP

#include "../gba/GBASav.hpp" // Include proper paths, so we can also compile properly on Windows.
#include "../nds/NDSSav.hpp"

/*
	SAVUtils for common things.

	Used for SAVType Detection and various other common things.
*/
namespace SAVUtils {
	extern SAVType SAV; // Active SAVType.
	extern std::string SAVName;

	SAVType DetectType(const std::string &File);
	bool LoadSAV(const std::string &File, const bool DoBackup = false);
	bool CreateBackup();
	void Finish();
	bool ChangesMade();

	const std::string ReadString(const uint8_t *Buffer, const uint32_t Offset, const uint32_t Length);
	void WriteString(uint8_t *Buffer, const uint32_t Offset, const uint32_t Length, const std::string &Str);
};


/* SAVUtils for GBA. */
namespace GBASAVUtils {
	extern std::unique_ptr<GBASAV> SAV;

	/*
		Read from the SAVBuffer.

		const uint32_t Offs: The Offset from where to read.
	*/
	template <typename T>
	T Read(const uint32_t Offs) {
		if (!GBASAVUtils::SAV || !GBASAVUtils::SAV->GetValid()) return 0; // Return 0, if nullptr OR invalid.

		return *reinterpret_cast<T *>(GBASAVUtils::SAV->GetData() + Offs);
	};

	/*
		Write to the SAVBuffer.

		const uint32_t Offs: The Offset where to write to.
		const T dt: The data which to write.
	*/
	template <typename T>
	void Write(const uint32_t Offs, const T dt) {
		if (!GBASAVUtils::SAV || !GBASAVUtils::SAV->GetValid()) return;

		*reinterpret_cast<T *>(GBASAVUtils::SAV->GetData() + Offs) = dt;
		if (!GBASAVUtils::SAV->GetChangesMade()) GBASAVUtils::SAV->SetChangesMade(true);
	};
};

/* SAVUtils for NDS. */
namespace NDSSAVUtils {
	extern std::unique_ptr<NDSSAV> SAV;

	/*
		Read from the SAVBuffer.

		const uint32_t Offs: The Offset from where to read.
	*/
	template <typename T>
	T Read(const uint32_t Offs) {
		if (!NDSSAVUtils::SAV || !NDSSAVUtils::SAV->GetValid()) return 0; // Return 0, if nullptr OR invalid.

		return *reinterpret_cast<T *>(NDSSAVUtils::SAV->GetData() + Offs);
	};

	/*
		Write to the SAVBuffer.

		const uint32_t Offs: The Offset where to write to.
		const T dt: The data which to write.
	*/
	template <typename T>
	void Write(const uint32_t Offs, const T dt) {
		if (!NDSSAVUtils::SAV || !NDSSAVUtils::SAV->GetValid()) return;

		*reinterpret_cast<T *>(NDSSAVUtils::SAV->GetData() + Offs) = dt;
		if (!NDSSAVUtils::SAV->GetChangesMade()) NDSSAVUtils::SAV->SetChangesMade(true);
	};
};

#endif