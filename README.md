# anilist-anigo-sync

Automatically syncs your anime watch progress from [AniGo.to](https://anigo.to) to your [AniList](https://anilist.co) account using a Tampermonkey userscript.

## Description

This userscript connects AniGo and AniList.
When you watch an episode on AniGo, it automatically updates your AniList anime list with the correct episode progress.
If you finish the final episode, the anime is marked as "Completed" on AniList.

## Features

- Automatically syncs episode progress from AniGo to AniList
- Uses AniList’s official API with OAuth2
- Marks shows as "Current" or "Completed" based on progress
- Runs in the background while you watch

## Installation

1. Install [Tampermonkey](https://tampermonkey.net/) for your browser.
2. Open the Tampermonkey dashboard and click **Create a new script**.
3. Delete the default code and paste the contents of `tampermonkey.js`.
4. Save the script.
5. Go to [https://anigo.to/home](https://anigo.to/home) in your browser.
6. The script will redirect you to AniList for authorization.
7. After granting access, you will be redirected back to AniGo.
8. Start watching any anime on AniGo, and your AniList progress will update automatically.

## Configuration

| Variable | Description | Default |
|-----------|--------------|----------|
| `HOME_URL` | AniGo home page | `https://anigo.to/home` |
| `WATCH_URL` | AniGo watch page | `https://anigo.to/watch` |
| `ANILIST_CLIENT_ID` | AniList OAuth client ID | `31572` |

If you want to use your own AniList OAuth client ID, create one at [https://anilist.co/settings/developer](https://anilist.co/settings/developer).

## Access Token

After authorization, your AniList access token is stored locally under:
anilistTampermonkeyAnigoAccessToken

You can remove it from your browser’s localStorage to reauthenticate if needed.

## Author

**Saadiq**
Version: 2025-10-25
License: MIT
