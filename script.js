const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");

/// api URL ///
const apiURL = "https://api.lyrics.ovh";

/// adding event listener in form

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchValue = search.value.trim();

  if (!searchValue) {
    alert("There is nothing to search");
  } else {
    searchSong(searchValue);
  }
});

//search song
async function searchSong(searchValue) {
  const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
  const data = await searchResult.json();

  // console.log(finaldata)
  showData(data);
}

//display final 10 results
function showData(data) {
  result.innerHTML = `<ul class="song-list">
      ${data.data
        .slice(0, 10)
        .map(
          (song) =>
            `<li id="${song.title} ${song.artist.name}" >
                <div class="single-result row align-items-center my-3 p-3">
                    <div class="col-md-9">
                        <h3 class="lyrics-name">${song.title}</h3>
                        <p class="author lead">
                        Album by 
                        <span>
                            ${song.artist.name}
                        </span>
                        </p>
                    </div>
                    <div class="col-md-3 text-md-right text-center">
                        <button id="result" data-artist="${song.artist.name}" data-songtitle="${song.title}" id-name="${song.title} ${song.artist.name}" class="btn btn-success">Get Lyrics</button>
                    </div>
                </div>
             </li>
            `
        )
        .join("")}
     </ul>`;
}

//event listener in get lyrics button
result.addEventListener("click", (e) => {
  const clickedElement = e.target;

  //checking clicked element is button or not
  if (clickedElement.tagName === "BUTTON") {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-songtitle");
    const idName = clickedElement.getAttribute("id-name");
    getLyrics(artist, songTitle, idName);
  }
});

// Get lyrics for song
async function getLyrics(artist, songTitle, idName) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();
  const line = document.getElementById(idName);
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  line.innerHTML = `<div class="single-lyrics text-center">
        <h2 class="text-success mb-4">${artist} - ${songTitle}</h2>
        <pre class="lyric text-white">${lyrics}</pre>
    </div>`;
}
