#cd ~/frontend
#git pull
#cd ~/frontend_org
#git pull
cd ~/workspace/src/github.com/ninjacrash/geogo
git pull
cp -rf frontend ~
cp -rf frontend_org ~
pkill -f geogo
nohup go run geogo.go &
echo $!
