# NDSSlotFixer

![](https://github.com/Universal-Team/Sim2Editor/blob/External-Tools/NDSSlotFixer/Screenshot.png)

## What is this for?
This Tool is, to fix from the game corrupted SAVSlots. If the game notices an invalid Checksum, it writes the following bytes at the begin of the SAVSlot (Header): `2A 2A 2A 00 00 00 00 00 E0 20 7E 02 D8 8F 00 00 00 00 00 00`.

This Tool will check for the first 3 `2A`'s and then try to fix your Slot, so you can use that Slot again.

## Usage
It is easy! You'll have to drop your SAVFile into the executable and follow the things from the command line.

Firstly, it will tell you the path of the argument you passed by drag and drop the SAVFile. Then it checks all 5 possible SAVSlot Locations: `0x0, 0x1000, 0x2000, 0x3000, 0x4000`. It then checks the first 3 byte, if those contain `2A, 2A, 2A`.

If that's the case, it will then calculate the `0x14 - 0xFFF` bytes range, which then gets written at offset `0x10 & 0x11` (Which is the `shared Checksum`?) for the SAVSlot & Header.

After that, it will set the semi-valid header `64, 61, 74, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0` at the start. Then it will fetch the SAVCount from offset `0x14 - 0x17` and writes it to the SAVCount Location from the Header (`0x8 - 0xB`).

After that, it will fetch the Slot Position from offset `0x22 + 0x23` and writes it to the Slot Position Location from the Header (`0xC - 0xD`).

Then it actually calculates `0x0 - 0x13`, but skipping `0xE - 0xF` & `0x13`, because `0xE - 0xF` is the Header checksum, and `0x13` contains some kind of flag, which it requires now. If `0x13` is `00`, then it adds a `+1` to the second byte variable. After it, it writes the calculated result to `0xE - 0xF` and the Slot should be fixed.

ALL you really have to do is just drag and drop the SAVFile into the executable, really. It does everything else on it's own for you.