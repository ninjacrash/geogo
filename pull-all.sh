cd ~/frontend
git pull
cd ~/frontend_org
git pull
cd ~/workspace/src/github.com/ninjacrash/geogo
cp -rf frontend ~/frontend
cp -rf frontend_org ~/frontend_org
git pull
pkill -f geogo
nohup go run geogo.go &
echo $!
