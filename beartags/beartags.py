# -*- coding: utf-8 -*-
'''
Musicbrainz consumer key: RObBFAVmsALMcfbYpaAa
Musicbrainz consumer secret: IwtRpwfTmkAvVvzuglNBVkmqAxiflFju
Acoustid API Key: aCD6JtaMaI
'''
import json;
import os, subprocess, sys;
import acoustid, musicbrainzngs;
import urllib2;

from mutagen.id3 import ID3;
from mutagen.mp3 import MP3;

def printJson(toPrint):
    print json.dumps(toPrint, indent=4, sort_keys=True);
    return;

def flacToMp3(dir):
    '''Converts all flacs within the given directory to mp3s'''
    scriptPath = os.path.dirname(os.path.realpath(__file__));
    scriptPath += '/flactomp3.sh';
    cmd = "cd '{}' && sudo '{}'".format(dir, scriptPath);
    subprocess.call(cmd, shell=True);
    return;

def getMp3Files(dir):
    '''Returns all mp3 files located within the given directory and all subdirectories'''
    os.chdir(dir);
    tracks = [];
    for root, dirs, files in os.walk(dir):
        for file in files:
            if file.endswith(".mp3"):
                tracks.append(os.path.join(root, file));

    return tracks;

def getFingerprint(file):
    '''Returns fingerprint data for the given file'''
    apiKey = 'aCD6JtaMaI';
    matches = acoustid.match(apiKey, file);

    if not matches:
        print('No matches found for track');
        return False;

    recordingId = None;
    for score, recording_id, title, artist in matches:
        recordingId = recording_id;
        break;

    return recordingId;

def musicbrainzLookup(recordingId):
    musicbrainzngs.set_useragent('Beartags', '1.0');
    url = 'http://musicbrainz.org/ws/2/recording/' + recordingId + '?inc=artists&fmt=json';
    return json.loads(urllib2.urlopen(url).read());

def main():
    baseDir = os.getcwd();
    flacToMp3(baseDir);
    tracks = getMp3Files(baseDir);

    if not tracks:
        print('No tracks found');
        return;

    for track in tracks:
        recordingId = getFingerprint(track);
        lookup = musicbrainzLookup(recordingId);

        if 'artist-credit' not in lookup:
            print('Artist not found for track');
            return;

        artistCredit = lookup['artist-credit'];
        if len(artistCredit) == 0:
            print('Artist not found for track');
            return;

        artist = artistCredit[0]['name'];
        print(artist);
        tags = ID3(track);
        print(tags);
        return;

    return;

main();

#
