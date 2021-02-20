# Last Saved Slot Detector (LSSD)

![](https://github.com/Universal-Team/Sim2Editor/blob/External-Tools/LSSD/Screenshot.png)

## What is this for?
This Tool is, to detect the Last Saved Slot on the NDS Version. The SAV stores *5* of the 0x1000 Slots.. but only *3* are actually loadable in game. This Tool will return the base Offset for all of the 3 Slots, so you know, which one you have to edit, if you do it manually for example.

## Current TODOs
- What happens when the SAVCount reaches 0xFF? Does it go back to 0x0 and so on? Detect it.

## Usage
It is easy! You'll have to drop your SAVFile into the executable and follow the things from the command line.

Firstly, it will tell you the path of the argument you passed by drag and drop the SAVFile. Then it checks for all of the 3 Slots, by doing:

1.) Check if the Header Identifier `d a t` is correct. (`0x64, 0x61, 0x74`)

2.) Check, if the SAVSlot (`0x0 for 1, 0x1 for 2 and 0x2 for 3`) is correct for the checked Slot. (Can be found at offset `SAVSLOT_OFFS + 0xC` and for some reason also at `0xD` as well).

3.) Check the SAVCount, which can be found at `SAVSLOT_OFFS + 0x8`. NOTE: It is 4 byte long, so `0x8 - 0xB`.

4.) Compare all of the proper Slots for their SAVCount. Return the Slot with the highest Count.