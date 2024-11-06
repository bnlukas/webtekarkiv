document.addEventListener("DOMContentLoaded", () => {
    fetch("albums.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => createChart(data))
        .catch(error => console.error("Error fetching data:", error));
});

function createChart(albums) {
    const svg = d3.select("#chart");
    const width = 900;
    const height = 700;
    const margin = { top: 100, right: 80, bottom: 140, left: 70 };

    svg.attr("width", width).attr("height", height);

    // Set up the scales
    const xScale = d3.scaleBand()
        .domain(albums.map(album => album.albumName))
        .range([margin.left, width - margin.right])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(albums, album => album.trackList.length)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Create the bars
    svg.selectAll(".bar")
        .data(albums)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", album => xScale(album.albumName))
        .attr("y", album => yScale(album.trackList.length))
        .attr("width", xScale.bandwidth())
        .attr("height", album => height - margin.bottom - yScale(album.trackList.length))
        .attr("fill", "#2980b9")
        .on("mouseover", function(event, album) {
            d3.select(this).attr("fill", "#3498db");
            const tooltip = d3.select("#tooltip");
            tooltip.style("display", "block")
                .style("left", event.pageX + "px")
                .style("top", event.pageY - 28 + "px")
                .html(`
                    <strong>${album.albumName}</strong><br>
                    Tracks: ${album.trackList.length}<br>
                    Year: ${album.productionYear}
                `);
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "#2980b9");
            d3.select("#tooltip").style("display", "none");
        });

    // Add X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add Y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    // Add labels
    svg.append("text")
        .attr("class", "x label")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .style("text-anchor", "middle")
        .text("Album");

    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", 20)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Number of Tracks");

    // Tooltip
    d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("display", "none")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "#fff")
        .style("padding", "8px")
        .style("border-radius", "5px")
        .style("pointer-events", "none");
}
