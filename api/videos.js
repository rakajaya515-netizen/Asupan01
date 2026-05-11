export default async function handler(req, res) {

try {

const page = req.query.page || 1;

const API_KEY = process.env.VIZEY_API_KEY;

const response = await fetch(
`https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}`,
{
headers:{
"User-Agent":"Mozilla/5.0"
}
}
);

const data = await response.json();

const videos = data.data || [];

res.setHeader(
"Cache-Control",
"s-maxage=120, stale-while-revalidate"
);

res.status(200).json({
videos,
hasMore: data.pagination?.hasNext || false
});

} catch(err){

res.status(500).json({
error: err.toString()
});

}

}
