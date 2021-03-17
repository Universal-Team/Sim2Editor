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

#ifndef _SIM2EDITOR_CORE_COMMON_HPP
#define _SIM2EDITOR_CORE_COMMON_HPP

#include <math.h> // For std::max and std::min, cause why not.
#include <memory>
#include <string>

/* The main path for NDS, 3DS AND Windows / Linux whatever. */
#ifdef _3DS
	#define _MAIN_PATH "sdmc:/3ds/Sim2Editor"
#elif ARM9
	#define _MAIN_PATH "sd:/_nds/Sim2Editor"
#else
	#define _MAIN_PATH "/Sim2Editor"
#endif

enum class SAVType {
	GBA,
	_NDS, // _NDS, because it seems like somethin' like SAVType::NDS exist on libnds as well or so?
	NONE
};

#endif