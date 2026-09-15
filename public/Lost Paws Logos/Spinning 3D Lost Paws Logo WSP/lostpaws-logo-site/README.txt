LOST PAWS 3D LOGO — how to add it to your website
===================================================

WHAT'S IN THIS FOLDER
  LostPaws 3D Logo - Embed.html   the animated logo page
  three-d-stage.js                the 3D engine helper it needs
  uploads/LostPaws Logo - Green - HERO LOGO.png   your artwork
  embed-snippet.txt               the one line of code to paste into your site

STEP 1 — UPLOAD
  Upload this whole folder (keep the file names and the "uploads" subfolder
  exactly as they are) to your website's hosting, e.g. into a folder called
  /logo/. Use your host's File Manager, FTP, or your site builder's
  "upload files / assets" area.

  Result: the page should open in a browser at
    https://YOUR-DOMAIN.com/logo/LostPaws%203D%20Logo%20-%20Embed.html
  Visit that address first — you should see the logo spinning.

STEP 2 — PASTE THE EMBED
  Open embed-snippet.txt and paste its <iframe> code where you want the
  logo to appear. Change src="..." to the full address from Step 1.

  WordPress:  add a "Custom HTML" block, paste the code.
  Squarespace / Wix / Webflow: add an "Embed" / "Code" / "HTML" element, paste.
  Shopify:    Online Store > Themes > Edit code, or a "Custom Liquid" section.
  Plain HTML site: paste into the page's HTML where the logo should sit.

STEP 3 — SIZE IT
  In the snippet, max-width:720px controls how wide the logo is. Change it
  to taste. The height follows automatically (aspect-ratio 3/2).

NOTES
  - The background is transparent, so it sits on any page colour.
  - Everything must be served over https (same as your site) or the 3D
    engine will not load.
  - Spin is a full turn one way, then rewinds, on a loop. To change the
    speed, open the Embed .html and edit "SPIN_SECONDS = 6".
