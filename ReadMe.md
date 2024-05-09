git clone https://github.com/itsnotatul/Blog-Site.git
 1251  cd Blog-Site
 1254  npm init
 1258  npm install express
 1262  mongo
 1263  brew tap mongodb/brew\nbrew install mongodb-community\n
 1264  echo 'export PATH="/usr/local/opt/mongodb-community/bin:$PATH"' >> ~/.zshrc\nsource ~/.zshrc\n
 1265  mongo
 1266  echo 'export PATH="/usr/local/opt/mongodb-community/bin:$PATH"' >> ~/.zshrc
 1267  source ~/.zshrc\n\n
 1268  source ~/.zshrc
 1269  brew services start mongodb/brew/mongodb-community\n
 1270  mongo
 1271  node app.js

Now, the site is live on local host.
Send curl/postman requests to see the API response or testing.

