# Safe Swallow Kitchen

Indian recipes mapped to IDDSI levels 0–6, with the test to do before every serving, a flow-test helper, Indian high-risk foods and a printable diet sheet.

Part of the ASLP App Kit series (phase 1.1) by Hemaraja Nayaka S, Department of Audiology & Speech-Language Pathology, Yenepoya Medical College Hospital, Mangaluru.

- **For:** Families and clinicians
- **Languages:** English, Kannada, Telugu, Hindi (recipe steps in English)
- **Data:** stays in the browser on the device where it is entered. Nothing is sent to a server. Use the CSV or backup download regularly.
- **Works offline** after the first visit, and can be added to a phone's home screen.

## Files

| File | What it does |
|---|---|
| `index.html` | The app |
| `sw.js` | Keeps a copy on the device so the app works offline |
| `manifest.webmanifest`, `icon.svg` | Name and icon when installed on a phone |
| `vercel.json` | Stops Vercel caching the offline file, so updates reach users |

## Publish on Vercel (no terminal needed)

1. Push this folder to its own GitHub repository.
2. In Vercel, choose **Add New → Project**, pick the repository and press **Deploy**. No build settings are needed.
3. Every change committed to GitHub goes live within a minute. After changing the app, raise the version in `sw.js` (for example `-v1` to `-v2`) so phones fetch the new copy.

## Status

Version 0.1.0: a working draft for clinical review. Clinical content, word lists and translations should be checked by a qualified professional and native speakers before use with patients.

## Licence note

IDDSI levels, colours and testing descriptions are from the IDDSI Framework (© The International Dysphagia Diet Standardisation Initiative 2016, https://iddsi.org/framework), licensed under CC BY-SA 4.0. Material here derived from it is shared under the same licence. This app is not made or endorsed by IDDSI.
