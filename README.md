# Simple collaborative todos

Open the page and start creating to-dos, and your to-dos with others.

The goal of this project is to create a simple website where you can keep your own todos and share them with others too.

**No authentication/log-in required!**

Nothing will be stored on the server, everything will be stored in the shared link.

Feel free to create PR's if you have a nice idea, but please keep this project simple.

I don't want changes/improvements for this project to be hidden away from the public, so please keep your fork public too if you create any.

# How to run as a Docker container

- Install Docker.
- Run `docker compose -f docker-compose.dev.yml up --build` (or `npm run docker:dev` if you have Node installed).
- Go to http://localhost:3000.

# How to develop

- Install Node and SQLite3.
- Run `npm install`.
- Run `npm start`.

# Future improvements in no particular order

- ~Ability to edit to-dos~
- ~Ability to remove to-dos~
- Touch controls
- Create server-less static "mode" to host this in Github pages, but that still works with shared links
- ~Keep to-dos in local storage and add ability to go through archive~
- ~Create an archive button to "throw away" all to-dos currently in view and to start with a clean slate~
- Create import and export button
- Add live collaboration and database persistence (+ change readme to reflect this)
