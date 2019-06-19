npm run build
cp ./src/assets/fonts/AvenirNextLTPro-Regular.otf ./build/assets/fonts
cp ./src/assets/fonts/sloopscript.ttf ./build/assets/fonts
firebase deploy --only hosting