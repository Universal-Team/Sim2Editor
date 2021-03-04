/*
*   This file is part of Sim2Editor
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

import { ActiveSlot } from './slot-menu.js';
let ActiveEpisode;

/*
	Initialize the selected Episode.

	EP: The Episode.
	Reload: If things should be reloaded without Episode Initialization.
*/
function InitSelectedEpisode(EP, Reload) {
	if (!Reload) ActiveEpisode = ActiveSlot.GetEpisode(EP); // Init if not reload.

	if (ActiveEpisode) {
		document.getElementById("EpisodeEditMenu").classList.remove("showNone");

		/* Ratings. */
		const Ratings = ActiveEpisode.GetRating();
		document.getElementById("Episode_Rating1").value = Ratings[0];
		document.getElementById("Episode_Rating2").value = Ratings[1];
		document.getElementById("Episode_Rating3").value = Ratings[2];
		document.getElementById("Episode_Rating4").value = Ratings[3];

		/* Episode State. */
		document.getElementById("Episode_Unlocked").checked = ActiveEpisode.GetState();
	}
};

/* Initialize the Episode Menu. */
export function EpisodeMenuInit() {
	if (ActiveSlot) { // Ensure it's not undefined first.
		document.getElementById("EpisodeMenu").classList.remove("showNone");
		InitSelectedEpisode(document.getElementById("EpisodeSelection").value);
	}
};
/* Hide the Episode Menu. */
export function EpisodeMenuHide() {
	document.getElementById("EpisodeEditMenu").classList.add("showNone");
	document.getElementById("EpisodeMenu").classList.add("showNone");
};

/* Episode Selection. */
document.getElementById("EpisodeSelection").onchange = () => InitSelectedEpisode(document.getElementById("EpisodeSelection").value, false);

/* Handle the Ratings. */
function RatingHandle() {
	const v = new Uint8Array(0x4);
	for (let i = 0; i < 4; i++) v[i] = document.getElementById("Episode_Rating" + (i + 1).toString()).value;
	ActiveEpisode.SetRating(v);

	/* Refresh. */
	for (let i = 0; i < 4; i++) document.getElementById("Episode_Rating" + (i + 1).toString()).value = ActiveEpisode.GetRating()[i];
};

/* Rating -> Plot Points Completed. */
document.getElementById("Episode_Rating1").onchange = () => RatingHandle();
document.getElementById("Episode_MinRating1").onclick = function() {
	document.getElementById("Episode_Rating1").value = 0;
	RatingHandle();
};
document.getElementById("Episode_MaxRating1").onclick = function() {
	document.getElementById("Episode_Rating1").value = 25;
	RatingHandle();
};

/* Rating -> Aspiration Conversations. */
document.getElementById("Episode_Rating2").onchange = () => RatingHandle();
document.getElementById("Episode_MinRating2").onclick = function() {
	document.getElementById("Episode_Rating2").value = 0;
	RatingHandle();
};
document.getElementById("Episode_MaxRating2").onclick = function() {
	document.getElementById("Episode_Rating2").value = 25;
	RatingHandle();
};

/* Rating -> Hidden Want Completed. */
document.getElementById("Episode_Rating3").onchange = () => RatingHandle();
document.getElementById("Episode_MinRating3").onclick = function() {
	document.getElementById("Episode_Rating3").value = 0;
	RatingHandle();
};
document.getElementById("Episode_MaxRating3").onclick = function() {
	document.getElementById("Episode_Rating3").value = 25;
	RatingHandle();
};

/* Rating -> Errand Completed. */
document.getElementById("Episode_Rating4").onchange = () => RatingHandle();
document.getElementById("Episode_MinRating4").onclick = function() {
	document.getElementById("Episode_Rating4").value = 0;
	RatingHandle();
};
document.getElementById("Episode_MaxRating4").onclick = function() {
	document.getElementById("Episode_Rating4").value = 25;
	RatingHandle();
};

/* Episode Unlock state. */
document.getElementById("Episode_Unlocked").onclick = () => ActiveEpisode.SetState(document.getElementById("Episode_Unlocked").checked);

/* Mass Action -> Set all episodes to min. */
document.getElementById("Episode_Min").onclick = function() {
	for (let i = 0; i < 11; i++) {
		const v = new Uint8Array(0x4);
		for (let i2 = 0; i2 < 4; i2++) v[i2] = 0x0;

		ActiveSlot.GetEpisode(i).SetRating(v);
	}

	InitSelectedEpisode(0, true);
};

/* Mass Action -> Set all episodes to max. */
document.getElementById("Episode_Max").onclick = function() {
	for (let i = 0; i < 11; i++) {
		const v = new Uint8Array(0x4);
		for (let i2 = 0; i2 < 4; i2++) v[i2] = 0x19; // 25.

		ActiveSlot.GetEpisode(i).SetRating(v);
	}

	InitSelectedEpisode(0, true);
};

/* Mass Action -> Unlock all Episodes. */
document.getElementById("Episode_Unlocks").onclick = function() {
	for (let i = 0; i < 11; i++) ActiveSlot.GetEpisode(i).SetState(true);

	InitSelectedEpisode(0, true);
};

/* Mass Action -> Lock all Episodes. */
document.getElementById("Episode_Locks").onclick = function() {
	for (let i = 0; i < 11; i++) ActiveSlot.GetEpisode(i).SetState(false);

	InitSelectedEpisode(0, true);
};