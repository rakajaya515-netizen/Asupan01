export default async function handler(req, res) {

try {

const API_KEY = process.env.VIZEY_API_KEY;
const page = req.query.page || 1;

const response = await fetch(
`https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}`,
{
headers:{
"User-Agent":"Mozilla/5.0"
}
}
);

const text = await response.text();

res.status(200).send(text);

} catch(err){

res.status(500).json({
error: err.toString()
});

}

}
