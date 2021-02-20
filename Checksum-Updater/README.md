# Checksum-Updater

![](https://github.com/Universal-Team/Sim2Editor/blob/External-Tools/Checksum-Updater/Screenshot.png)

## What is this for?
This Tool is, to update the Checksum of your The Sims 2 GBA or NDS SAVFile. An incorrect Checksum causes the GBA version to not display your GBA SAVSlot and on the NDS version a message appears which tells you, that the SAVFile is corrupted and modifies the first 3 bytes from `dat` into `***` which makes the SAVSlot disappear. Exactly this Tool fixes that problem by updating the Checksums to properly match.

## Current Restrictions
- There is no way as of yet, to tell if the SAVFile is exactly an `The Sims 2 NDS` SAV or not. However, there is a way for `The Sims 2 GBA` which works properly by checking the first 7 bytes of the SAVFile and check them through a 7 Byte Ident AND for the SAVSize larger THAN 0x5000. It would be very rare, that another Game's SAVFile would contain the same 7 bytes at the start, so i think that check should potential be fine. If you drop another Game's SAVFile onto it, that's not my fault, that's **user error** then.

## Usage
It is easy! You'll have to drop your SAVFile into the executable and follow the things from the command line.

Firstly, it will tell you the path of the argument you passed by drag and drop the SAVFile. Then it will check for the GBA Idents after loading it. For now.. if it doesn't match, it'll be passed as an NDS SAV, until i find a way, to properly detect NDS Saves as well.

After the checks are done, it will then check through all SAVSlots and their Checksums. If the Checksum is good, it just displays, that it is good, if not -> It gives you an option to `fix it` or to `ignore it`. You can try to fix your SAVSlot and it probably will work again.. if not, feel free to let me know and i'll take a look into it when I have the time for it.

After that is done for all Slots (4 on GBA, 5 on NDS), it checks if at least *one* Slot got fixed, then it writes it back into the SAVFile. That's basically it on how to use it.

## Checksum Explained
A proper explanation will follow in the future.. when i find a proper way on how to properly explain it. You're free to checkout the Checksum-Updater's source code for that though.

Also NOTE: The Checksum fix / update / whatever function may NOT be the best one and can potential be cleaned up.. but honestly; as long as it works - it works. _I wrote the Checksum function on how i figured it out on the SAVFile research itself._