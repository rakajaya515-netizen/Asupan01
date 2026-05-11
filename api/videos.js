export default async function handler(req, res) {

try {

const page = req.query.page || 1;

const response = await fetch(
`https://vizey.net/api/videos?page=${page}`,
{
headers: {
"User-Agent": "Mozilla/5.0"
}
}
);

const text = await response.text();

let data = {};

try {
data = JSON.parse(text);
} catch {
return res.status(500).json({
error: "Response bukan JSON",
raw: text
});
}

const videos =
data.videos ||
data.result ||
data.data ||
[];

res.setHeader(
"Cache-Control",
"s-maxage=60, stale-while-revalidate"
);

return res.status(200).json({
videos,
hasMore: videos.length > 0
});

} catch (err) {

return res.status(500).json({
error: err.toString()
});

}

}
