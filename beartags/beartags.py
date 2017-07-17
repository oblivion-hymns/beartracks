# -*- coding: utf-8 -*-
'''
Musicbrainz consumer key: RObBFAVmsALMcfbYpaAa
Musicbrainz consumer secret: IwtRpwfTmkAvVvzuglNBVkmqAxiflFju
Acoustid API Key: aCD6JtaMaI
'''
import os, subprocess, sys;

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

def musicbrainzLookup():
	return;

def main():
    baseDir = os.getcwd();

    flacToMp3(baseDir);

    return;

main();

#
