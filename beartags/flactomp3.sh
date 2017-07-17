#!/bin/bash
# Supplemental script for Beartags.
# Converts all FLAC files in the given directory into MP3s
# at 320 kbps.

IFS=$'\n';
for f in $(find $PWD -name '*.flac');
do
	echo "Converting $f...";
	flac -cd "$f" -s | lame -b 320 --silent - "${f%.*}".mp3;
done;

exit 0
