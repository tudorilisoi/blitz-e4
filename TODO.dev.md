# Setup

- fork the repo <https://github.com/tudorilisoi/blitz-e4>
- git clone **your fork** on to your machine
- `git add remote origin https://github.com/tudorilisoi/blitz-e4`
- unpack the tar file from [this link](https://drive.google.com/file/d/16J31FEiM-OQ7v1hbygz84C_2X1EM8T7D/view?usp=sharing>) in the root of your project
- ask me for the .env.local file ;) and paste it in the project root

# Workflow

- checkout a feature branch such as `git checkout issue-3321`
- git commit, git push, then go to github and create a pull request by comparing to origin/master
- run `yarn install` or `npm install`
- run `npx blitz db seed`
- run `yarn run dev` or `npm run dev`

# Random notes

If a route is not (yet) linked in the app itself you can run
`npx blitz routes` and take a look at the GET routes

# Developer TODO

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
- X find some way to implement a consistent UI over Tailwind
- X implement images as a tab in the post edit form
- X implement the home page with categories list
- X implement view ad page
- X implement login, logout, edit profile (name and phone only)
- X implement "my ads" page
- X maybe switch to formik for forms
- X implement expire_status and send mail (only if post fresher than, say, 3 months)
- X create a sitemap page with all the necesarry links for home, login, logout, create post, etc.
