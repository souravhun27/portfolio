# Sourav · Portfolio

Plain HTML, CSS and vanilla JavaScript. No build step.

```
index.html
css/style.css
js/main.js
assets/
  resume.pdf
  images/   (favicon, og-image, project-*.svg (banner placeholders))
```

## Run locally
1. Open the folder in VS Code and install the **Live Server** extension.
2. Right-click `index.html` → **Open with Live Server**.
(Or run `python3 -m http.server` in this folder and open http://localhost:8000.)

## Things you must replace
- **Photo:** your portrait is `assets/images/profile.jpg` (square, black & white, dark background). To change it, replace that file and keep the same name.
- **Project links:** the four "View Project" buttons point to your GitHub repos. After you deploy projects, add their live URLs next to them.
- **Project images:** swap `assets/images/project-*.svg (banner placeholders)` for real screenshots (16:9 works best) and update the `src`/`alt`.
- **Social preview:** after deploying, change `og:image` / `twitter:image` in `<head>` to an absolute URL, e.g. `https://USERNAME.github.io/REPO/assets/images/og-image.png`.

## Push to GitHub
```bash
git init
git add .
git commit -m "Add portfolio"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

## Enable GitHub Pages
Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
Your site appears at `https://USERNAME.github.io/REPO/` after a minute. All paths are relative, so it works under a sub-path.
(Naming the repo `USERNAME.github.io` serves it at the root domain.)
