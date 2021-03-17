EXECUTABLE_NAME :=	Test.exe

.PHONY: all clean

# Command, Flag.
# Sources.
# Includes.
# -o and Executable name.
all:
	@g++ -std=gnu++17 -D_WINDOWS \
	*.cpp ../shared/source/*cpp ../core/source/gba/*.cpp ../core/source/nds/*cpp ../core/source/shared/*.cpp \
	-I../shared/include -I../core/include/gba -I../core/include/nds -I../core/include/shared \
	-o $(EXECUTABLE_NAME)

clean:
	@echo clean ...
	@rm -fr $(EXECUTABLE_NAME)