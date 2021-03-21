EXECUTABLE_NAME :=	Test.exe

.PHONY: all clean

# Command, Flag.
# Sources.
# Includes.
# -o and Executable name.
all:
	@g++ -std=gnu++17 -D_WINDOWS \
	*.cpp ../shared/source/*cpp ../Sim2Editor-CPPCore/source/gba/*.cpp ../Sim2Editor-CPPCore/source/nds/*cpp ../Sim2Editor-CPPCore/source/shared/*.cpp \
	-I../shared/include -I../Sim2Editor-CPPCore/include/gba -I../Sim2Editor-CPPCore/include/nds -I../Sim2Editor-CPPCore/include/shared \
	-o $(EXECUTABLE_NAME)

clean:
	@echo clean ...
	@rm -fr $(EXECUTABLE_NAME)