#!/bin/bash

echo "================= MINIBOT GUI ================="
cd static
cd clientgui
npm run webpack
echo "=========== WEBPACK SETUP COMPLETE - CLIENT GUI ============"
cd ..
cd basestationgui
npm run webpack
echo "=========== WEBPACK SETUP COMPLETE - BASESTATION  GUI ============"
cd ..
cd ..
cd basestation
echo "=========== STARTING BASESTATION ==============="
python3 base_station_interface.py
