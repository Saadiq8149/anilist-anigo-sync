// ==UserScript==
// @name         AniGo sync to Anilist
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Saadiq
// @match        https://anigo.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anigo.to
// @grant        window.onurlchange
// @updateURL    https://github.com/Saadiq8149/anilist-anigo-sync/blob/master/tampermonkey.js
// @downloadURL  https://github.com/Saadiq8149/anilist-anigo-sync/blob/master/tampermonkey.js
// ==/UserScript==

const HOME_URL = "https://anigo.to/home";
const WATCH_URL = "https://anigo.to/watch";
const ANILIST_CLIENT_ID = "31572";

async function performAnilistQuery(query, variables, accessToken) {
  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error performing Anilist query:", error);
    throw error;
  }
}

async function updateAnilist(tabUrl) {
  let accessToken = localStorage.getItem("anilistTampermonkeyAnigoAccessToken");

  if (!accessToken) {
    return;
  }

  let episodeNumber = tabUrl.split("#ep=")[1];
  let animeSlug = tabUrl.split("watch/")[1].split("-").slice(0, -1).join("-");

  let animeTitle = animeSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let searchQuery = `
    query ($search: String!) {
      Page {
        media(search: $search, type: ANIME) {
          id
          episodes
          status
        }
      }
    }
  `;

  const data = await performAnilistQuery(
    searchQuery,
    { search: animeTitle },
    accessToken,
  );

  if (data.errors) {
    return;
  }

  let media = data.data.Page.media[0];
  if (!media) {
    return;
  }

  let mediaId = media.id;

  let updateMutation = `
    mutation ($mediaId: Int, $progress: Int, $status: MediaListStatus) {
      SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status) {
        id
        progress
        status
      }
    }
  `;

  var updatedStatus = "CURRENT";

  if (media.status == "FINISHED" || media.status == "CANCELLED") {
    if (episodeNumber >= media.episodes) {
      updatedStatus = "COMPLETED";
    }
  }

  const updateData = await performAnilistQuery(
    updateMutation,
    {
      mediaId: mediaId,
      progress: parseInt(episodeNumber),
      status: updatedStatus,
    },
    accessToken,
  );

  if (updateData.errors) {
    return;
  }
}

(function () {
  "use strict";
  let tabUrl = window.location;

  if (window.onurlchange === null) {
    window.addEventListener("urlchange", function (event) {
      const newUrl = window.location.href;
      if (newUrl.startsWith(WATCH_URL)) {
        updateAnilist(newUrl);
      }
    });
  }

  if (tabUrl.startsWith(HOME_URL)) {
    // on home page
    if (tabUrl == HOME_URL) {
      let accessToken = localStorage.getItem(
        "anilistTampermonkeyAnigoAccessToken",
      );
      if (!accessToken) {
        let anilistAuthUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${ANILIST_CLIENT_ID}&response_type=token`;
        window.location.href = anilistAuthUrl;
      }
    } else {
      // has access token
      let accessToken = tabUrl.href.split("#access_token=")[1].split("&")[0];
      localStorage.setItem("anilistTampermonkeyAnigoAccessToken", accessToken);
      window.location.href = HOME_URL;
    }
  }
})();
