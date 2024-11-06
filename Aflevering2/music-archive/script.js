console.log("Script loaded");

document.addEventListener("DOMContentLoaded", () => {
    fetchAlbums();

    // Search functionality
    const searchInput = document.getElementById("search-input"); // Søgedatabase 
    searchInput.addEventListener("input", (event) => {
        filterAlbums(event.target.value);
    });
});

function fetchAlbums() {
    const albumList = document.getElementById("album-list");
    albumList.innerHTML = '<p>Loading albums...</p>'; // Show loading message

    fetch("albums.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Internet forbindelse, ikke helt okay");
            }
            return response.json();
        })
        .then(data => displayAlbums(data))
        .catch(error => {
            console.error("Error fetching data:", error);
            albumList.innerHTML = '<p>Fejl ved at loade albums, prøv igen</p>'; // Show error message
        });
}

function displayAlbums(albums) {
    const albumList = document.getElementById("album-list");
    albumList.innerHTML = ""; // Clear loading message

    albums.forEach(album => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album");

        albumDiv.innerHTML = `
            <h2>${album.albumName}</h2>
            <p>Artist: <a href="${album.artistWebsite}" target="_blank">${album.artistName}</a></p>
            <p>Year: ${album.productionYear}</p>
            <p>Track Count: ${album.trackList.length}</p> 
            <p>Genre: ${album.genre}</p>
            <button onclick="toggleTrackList(${album.id})"> Show - Hide Tracklist</button>
            <ul id="tracklist-${album.id}" class="tracklist">
                ${album.trackList.map(track => `
                    <li>${track.trackTitle} - ${track.trackTimeInSeconds} seconds</li>
                `).join("")}
            </ul>
        `;

        albumList.appendChild(albumDiv);
    });
}

function toggleTrackList(albumId) {
    const tracklist = document.getElementById(`tracklist-${albumId}`);
    tracklist.classList.toggle("visible");
}

// Filter albums based on search input
function filterAlbums(searchTerm) {
    const albumDivs = document.querySelectorAll(".album");
    albumDivs.forEach(albumDiv => {
        const albumName = albumDiv.querySelector("h2").textContent.toLowerCase();
        albumDiv.style.display = albumName.includes(searchTerm.toLowerCase()) ? "block" : "none";
    });
}
