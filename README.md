# school-notes (Server)

### Discription

School Notes is a website where anyone can create notes with properties (expiration date, school subject, importance).

### Installation

#### Linux

- Option 1
```sh
$ git clone https://github.com/osourcet/school-notes.git
$ cd school-notes/
$ npm install
$ npm run install-server
$ npm run run-server
$ firefox 127.0.0.1:3000 # tries to see if school-notes server is working
```

- Option 2
```sh
$ git clone https://github.com/osourcet/school-notes.git
$ cd school-notes/
$ chmod +x install.sh
$ ./install.sh
$ firefox 127.0.0.1:3000 # tries to see if school-notes server is working
```