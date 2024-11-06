
// bekærfter at scriptet er indlæst
console.log("Script loaded");

// venter på at dom er fuldt indlæst før koden kører
document.addEventListener("DOMContentLoaded", () => {
    
    // henter album data via fetch 
    fetchAlbums();

    // Søgefunktion
    const searchInput = document.getElementById("search-input"); // Søgedatabase 
    
    // lytter efter input i søgefeltet og flitere albums
    searchInput.addEventListener("input", (event) => {
        filterAlbums(event.target.value);
    });
});


// funktion til at hente album data fra json 
function fetchAlbums() {
    const albumList = document.getElementById("album-list");
    
    // viser indlæsningsbesked 
    albumList.innerHTML = '<p>Loading albums...</p>'; 

    fetch("albums.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Internet forbindelse, ikke helt okay");
            }
            return response.json();
        })
        .then(data => displayAlbums(data))
        .catch(error => {
            console.error("Error fetching data:", error); // viser error hvis data ikke hentes
            albumList.innerHTML = '<p>Fejl ved at loade albums, prøv igen</p>'; 
        });
}

//funktion til at vise albums på siden
function displayAlbums(albums) {
    const albumList = document.getElementById("album-list");
    albumList.innerHTML = ""; // fjerner indlæsningsbesked

    // opretter elementer for hver album
    albums.forEach(album => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album");

        // udflyder album information
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

// vise/skjule trackliste
function toggleTrackList(albumId) {
    const tracklist = document.getElementById(`tracklist-${albumId}`);
    tracklist.classList.toggle("visible");
}

// leder efter albums i søgefeltet ved hjælp af javascript
function filterAlbums(searchTerm) {
    const albumDivs = document.querySelectorAll(".album");
    albumDivs.forEach(albumDiv => {
        const albumName = albumDiv.querySelector("h2").textContent.toLowerCase();
       // viser eller skjuler albums baseret på søgeord
        albumDiv.style.display = albumName.includes(searchTerm.toLowerCase()) ? "block" : "none";
    });
}
