# e3

## Setup

- fork the repo <https://github.com/tudorilisoi/blitz-e4>
- `git clone` **your fork** on to your machine
- `git add remote origin https://github.com/tudorilisoi/blitz-e4`
- unpack the tar file from [this link](https://drive.google.com/file/d/16J31FEiM-OQ7v1hbygz84C_2X1EM8T7D/view?usp=sharing>) in the root of your project
- ask me for the .env.local file ;) and paste it in the project root
- install postgres with docker following [these steps](https://www.commandprompt.com/education/how-to-install-and-set-up-docker-postgresql-environment)
- install DBeaver from [here](https://dbeaver.io/download/)
- open a terminal in your project folder
- adjust your `DATABASE_URL` in `.env.local`
- install node **v18.18.0**, then run `npm i -g yarn`
- run `yarn install`
- run `npx blitz prisma migrate dev` to create the database
- run `npx blitz db seed` to populate records

## Workflow

- checkout a feature branch such as `git checkout issue-3321`
- run `yarn run dev` or `npm run dev`
- do stuff
- need to add packages? use `yarn add <package>`
- `git pull origin/master`, `git commit`, `git push`, then go to `github.com/sergiu-D/*your-fork*` and create a pull request by comparing to origin/master

## Random notes

If a route is not (yet) linked in the app itself you can run
`npx blitz routes` and take a look at the GET routes. You can then just append the url to `http://localhost:3000` to view it in the browser

## Developer TODO

X = not implemented, P = partially implemented

Note: Maybe later on these will be converted to GH issues

- ✔ implement socketlabs mail
- ✔ import posts
- ✔ install and use tailwind
- ✔ fix upload filename and make it unique on the server
- ✔ responsive images server-side and/or using next/image
- X handle useQuery and UseMutation errors
- ✔ refresh/invalidate post after update
- ✔ auth guard post and image
- ✔ verify/guard post when uploading image
- ✔ Overlay: better contrast on mobile devices
- P implement a search interface; meilisearch is already setup
- P find some way to implement a consistent UI over Tailwind (currently using daisyUI)
- X implement images as a tab in the post edit form
- P implement the home page with categories list
- X implement view ad page
- X implement share button on view ad page
- X implement login, logout, edit profile (name and phone only)
- X implement "my ads" page
- X maybe switch to formik for forms
- X maybe implement DM with tRPC subscriptions
- X implement expire_status and send mail (only if post fresher than, say, 3 months)
- X create a sitemap page with all the necesarry links for home, login, logout, create post, etc.
- ✔ line-clamp partial post body in PostCell
- X add Google analytics
- X fix WS prod server
- X maybe implement chat
