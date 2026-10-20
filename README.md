# Our Little World ♡

A cute, responsive relationship scrapbook made with plain HTML, CSS, and JavaScript. No frameworks, build tools, or paid services required.

## Preview it on your computer
1. Unzip the folder.
2. Open `index.html` in your browser.
3. Edit `index.html`, `style.css`, and `script.js` in VS Code or any text editor.
4. Refresh the browser to see changes.

## Make it yours
- **Words and letter:** edit the text in `index.html`.
- **Quiz:** edit `CONFIG.quiz` near the top of `script.js`. The `answer` is the zero-based option number: `0` means the first option.
- **Days together:** set `relationshipStartDate` in `script.js` to `"YYYY-MM-DD"`; leave it empty to show infinity.
- **Photos:** put image files in `assets/`. In `index.html`, replace a placeholder like:
  `<div class="photo-placeholder peach"><span>♡</span><small>add your favorite photo</small></div>`
  with:
  `<img class="real-photo" src="assets/first-date.jpg" alt="Our first date">`
  Then add this to `style.css`:
  `.real-photo { width:100%; aspect-ratio:4/3; object-fit:cover; display:block; }`
  Keep the existing `<figcaption>` under the image.
- **Playlist:** replace the sample links in `index.html` with links to your songs or playlist. A Spotify playlist link is easiest.
- **Memories:** edit the dates, headings, and paragraphs inside each `.memory-card` in `index.html`.
- **Secret message:** change the text in `#surpriseMessage` and `#letterSecretText`.
- **Colors and fonts:** edit the CSS variables at the top of `style.css`.

## Publish it for free with GitHub Pages
1. On GitHub, create a new repository. For a surprise, consider a name like `our-little-world`.
2. Upload **the contents of this folder** (not the zip file): `index.html`, `style.css`, `script.js`, `README.md`, and the `assets` folder if you added photos.
3. In the repository, open **Settings → Pages**.
4. Under the build/deployment section, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/(root)`, then click **Save**.
6. Wait a minute or two and refresh the Pages section. Your site URL will look like `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.
7. Open the URL in a private/incognito window to test it, then send the link to your boyfriend.

## Surprise/privacy tips
- GitHub Pages sites are public to anyone who has the URL (and may be indexed). Don't put private information, passwords, or anything you wouldn't want others to see in the repository.
- If you want the surprise to stay secret, don't share the repository link; share only the published site URL when you're ready.
- This is a static website. It doesn't upload photos or store messages from visitors; images need to be included in `assets/` and committed to the repository.
- The page uses Google Fonts for typography; if those are blocked, it falls back to system fonts.
