rm -rf spa/build spa/node_modules backend/node_modules
echo "Removed modules"
echo "Installing spa dependencies"
cd spa
npm install -f && npm run build
echo "Installing backend dependencies"
cd ..
cd backend
npm install -f && npm run start