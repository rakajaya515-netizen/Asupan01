export default async function handler(req, res) {

try {

const API_KEY = process.env.VIZEY_API_KEY;

if (!API_KEY) {
return res.status(500).json({
error: "VIZEY_API_KEY belum ada"
});
}

let allVideos = [];
let currentPage = 1;
let hasNext = true;

while (hasNext && currentPage <= 20) {

const response = await fetch(
`https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${currentPage}`,
{
headers: {
"User-Agent": "Mozilla/5.0"
}
}
);

const json = await response.json();

const videos = json.data || [];

allVideos.push(...videos);

hasNext = json.pagination?.hasNext || false;

currentPage++;

}

res.setHeader(
"Cache-Control",
"s-maxage=300, stale-while-revalidate=600"
);

return res.status(200).json({
success: true,
videos: allVideos
});

} catch (err) {

return res.status(500).json({
error: err.toString()
});

}

}
