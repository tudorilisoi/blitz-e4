# e3

## Setup

- fork the repo <https://github.com/tudorilisoi/blitz-e4>
- `git clone` **your fork** on to your machine
- `git add remote origin https://github.com/tudorilisoi/blitz-e4`
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

- X cat icon in post page
- X pixel tracker for post views
- X P00 scroll up FAB
- ✔ push build with rsync
- X P00 discution system with mail notifications
- ✔ P00 delete non-uploaded images, move the publish button and change tabs color
- X P00 show contact info in post
- X P00 add post delete/archive button
- X P00 publish to eradauti.ro instead of mobilecenta.com
- X P0 implement close/archive post as soft delete (solved, expired)
- ✔ check for verified status on login
- ✔ P1 check for existing email on signup
- X cookiescript
- ✔ P0 overlay on forgot password; also copy successNotification from signup
- ✔ publish live (fix images symlink first), make a synctool conf (done)
- ✔ P0 close slideshow on navigate away
- ✔ P0 overlay on e-mail verify
- ✔ implement socketlabs mail
- ✔ import posts
- ✔ install and use tailwind
- ✔ fix upload filename and make it unique on the server
- ✔ responsive images server-side and/or using next/image
- X implement a toast provider of sorts
- ✔ handle useQuery and UseMutation errors in `_app`
- X reset password: keep link/token as to avoid confusion or make it last really long
- ✔ maybe implement meili synonims
- ✔ check SocketLabs for the daily/monthly rate (2000/month as of Oct 27, 2023) "Billing Period 10/15/23 - 11/15/23"

  setup a an emails model {id, mailParams} so we know not to send unless the count from the last 15th is <2000

- ✔ refresh/invalidate post after update
- ✔ auth guard post and image
- ✔ verify/guard post when uploading image
- ✔ Overlay: better contrast on mobile devices
- P implement a search interface; meilisearch is already setup, see also NEXT_PUBLIC_MEILI_SEARCH_KEY in `.env\*` f iles
- ✔ find some way to implement a consistent UI over Tailwind (currently using daisyUI)
- P implement images as a tab in the post edit form; needs sitcky buttons
- X implement collapsible help text for title, body in post form
- X use logger to warn in `_app` about page not having getLayout
- X use consistent logger as configured in blitz
- ✔ fix multiple style jsx in posts nav page
- P implement the home page with categories list
- P va:1 implement view ad page
- X va:2 implement share button on view ad page
- P auth:1 implement login, logout, edit profile (name and phone only)
- P auth:2 implement "my ads" page
- X maybe switch to formik for forms
- X maybe implement DM/chat with tRPC subscriptions;

  Channels: { name(#something), type: (1to1 | public | private) }
  Messages: channel, author, msg, timestamp
  ChannelUsers: {userId, channelID, status: (invited|approved|banned|)}

- X implement expire_status and send mail (only if post fresher than, say, 3 months)
- X create a sitemap page with all the necesarry links for home, login, logout, create post, etc.
- ✔ line-clamp partial post body in PostCell
- X add Google analytics
- ✔ fix WS prod server
