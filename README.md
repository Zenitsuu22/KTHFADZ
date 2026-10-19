# Kenneth Fernandez - Portfolio Website

A static portfolio built with plain HTML, CSS and JavaScript (no frameworks). Icons come from Bootstrap Icons via CDN, so icons need an internet connection.

## Folder structure

```text
kenneth-fernandez-portfolio/
├── index.html                 <- page content (text, sections, projects)
├── css/style.css              <- colors and layout (edit :root variables to re-theme)
├── js/script.js               <- credentials list, filters, form settings
├── assets/
│   ├── images/                <- profile.jpg and project screenshots
│   ├── credentials/           <- your resume, certificates, diplomas
│   └── icons/favicon.svg      <- favicon placeholder
└── README.md
```

All filenames below are examples. Use your real filenames and update the paths to match.

## 1. Add your profile picture

Save a square-ish photo as `assets/images/profile.jpg`. Until it exists, the site shows a "KF" badge in the circle.

## 2. Add project screenshots

Place images in `assets/images/` using these names (or edit the `<img src>` in `index.html`):

- `studentrequesthub.png`
- `student-project-1.png`
- `student-project-2.png`
- `data-validation-demo.png`
- `admin-tools.png`

Missing screenshots show a "Screenshot coming soon" placeholder.

To edit a project, find its `<article class="card project">` block in `index.html`. Change the title, description and tags, and set the status badge: `badge-done` (Completed), `badge-demo` (Demonstration), `badge-wip` (In Progress) or `badge-placeholder` (Placeholder). Only mark a project "Completed" when it is truly finished. To add real links, replace the grey "not yet published" spans with:

```html
<a class="btn btn-sm btn-primary" href="https://your-link" target="_blank" rel="noopener noreferrer">View Project</a>
```

Never publish confidential TESDA records or real trainee information. Use fictional or anonymized sample data only.

## 3. Add your resume and credentials

1. Copy your files into `assets/credentials/`.
2. Open `js/script.js` and edit the `credentials` list at the top. Each entry needs `title`, `category`, `description` and `file`.
3. Category must be one of: `Resume / CV`, `Educational Credentials`, `Training Certificates`, `Technical Certificates`, `Other Supporting Documents`.
4. Delete sample entries for files you do not have.

How files behave:

- PDF: "View Document" opens a new tab, plus a Download button.
- Image (jpg/png/webp): shows a thumbnail, opens full size, and can be downloaded.
- DOCX: download only (browsers cannot display it).
- Missing file (when hosted online): the card says the file has not been added yet.

The resume buttons use `assets/credentials/Kenneth_Fernandez_Resume.pdf`. If your resume has a different name, update the `href` in the three resume links in `index.html` (search for `data-resume-link`) and the `file` entry in `js/script.js`.

Only include documents you approve for public viewing. Consider hiding ID numbers or other private details before uploading.

### Google Drive folder link

The "View Additional Credentials and Resume Files" button points to your Drive folder. Drive folders are private by default. In Google Drive, right-click the folder, choose Share, and set General access to "Anyone with the link" (Viewer) for any files you want employers to open. Check the link in a private/incognito window. Do not share files you want to keep private.

## 4. Fill in contact details

In `index.html`, search for `[Your email address here]`, `[Your phone number here]` and `[Your LinkedIn profile URL here]` and replace them. Delete a line entirely if you prefer not to show it. Your OnlineJobs.ph link is already in place.

## 5. Contact form

GitHub Pages and similar hosts are static, so the form cannot send email by itself. Right now it validates the fields and then tells the visitor that nothing was sent. To make it work:

1. Create a free form endpoint at Formspree, Web3Forms or Getform.
2. Paste the endpoint URL into `FORM_ENDPOINT` near the top of `js/script.js`.
3. Test it by sending yourself a message.

## 6. Edit the graduation year (optional)

The Education section shows "Graduation date: June 13" only. To add the year, edit that line in the `#education` section of `index.html`.

## 7. Preview locally

Easiest: double-click `index.html` to open it in your browser. Note that the missing-file checks for credentials only work when served over http.

Better (matches the live site): in the project folder run

```bash
python -m http.server 8000
```

then open http://localhost:8000. (VS Code's "Live Server" extension also works.)

## 8. Publish on GitHub Pages (free)

1. Create a GitHub account and a new public repository, e.g. `kenneth-fernandez-portfolio`.
2. Upload all files, keeping the folder structure (`index.html` at the top level).
3. Go to Settings > Pages. Under "Build and deployment", choose "Deploy from a branch", select `main` and `/ (root)`, then Save.
4. After a minute your site appears at `https://YOUR-USERNAME.github.io/kenneth-fernandez-portfolio/`.

Remember that everything in a public repository is public, including credential files. Netlify Drop (drag the folder onto app.netlify.com/drop) and Cloudflare Pages are other easy options.

## Checklist: what you still need to provide

- [ ] `assets/images/profile.jpg`
- [ ] Resume PDF (`assets/credentials/Kenneth_Fernandez_Resume.pdf`)
- [ ] Educational credential file(s) you approve for public viewing
- [ ] Training and technical certificates (add entries in `js/script.js`)
- [ ] Email address, phone number and LinkedIn URL (or delete those lines)
- [ ] STUDENTREQUESTHUB screenshot, and live demo/source links if available
- [ ] Confirm the STUDENTREQUESTHUB feature list matches the real project
- [ ] Real titles, descriptions and screenshots for other student projects
- [ ] Anonymized demo files for Data Management and Validation (no real trainee data)
- [ ] Screenshots/descriptions for administrative tools, if you want them shown
- [ ] Graduation year (optional)
- [ ] Google Drive folder sharing permissions
- [ ] Contact form endpoint (`FORM_ENDPOINT`)
- [ ] Replace the favicon (`assets/icons/favicon.svg`) if desired
