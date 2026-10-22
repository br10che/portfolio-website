# violasanyan.com

My personal portfolio: **[violasanyan.com](https://violasanyan.com)**

A single-page site written by hand in plain HTML, CSS and JavaScript, with no frameworks or build step.

- **Portrait in the hero:** a small canvas script draws my portrait out of 0s and 1s. It follows the mouse and scatters on click (`js/script.js`, image data in `js/portrait-data.js`).
- **Light and dark theme:** follows the system setting and remembers your choice.
- **Responsive:** works from phone to desktop.

## Hosting

The site runs on my own Linux VPS (Ubuntu) with Nginx and HTTPS from Let's Encrypt. The server uses SSH keys only, a firewall (ufw), fail2ban, automatic security updates, and strict security headers, including a Content Security Policy.

`deploy.sh` uploads the site to the server with `rsync`.

## Structure

```
index.html          the whole site
css/style.css       all styles
js/script.js        theme, typewriter, portrait, navigation, small interactions
js/portrait-data.js portrait image data for the canvas
assets/             images and my CV (PDF)
deploy.sh           upload to the server
```
