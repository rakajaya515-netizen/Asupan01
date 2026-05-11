export default async function handler(req, res) {

try {

const page = Number(req.query.page || 1);

const API_KEY = process.env.VIZEY_API_KEY;

const url =
`https://vizey.net/api/v1/list?apikey=${API_KEY}&page=${page}&_=${Date.now()}`;

const response = await fetch(url,{
headers:{
"User-Agent":"Mozilla/5.0",
"Cache-Control":"no-cache"
}
});

const data = await response.json();

console.log("PAGE:", page);

console.log("API:", data.pagination);

res.setHeader(
"Cache-Control",
"no-store, max-age=0"
);

return res.status(200).json({
success:true,
page,

videos:data.data || [],

pagination:data.pagination || {}

});

}catch(err){

return res.status(500).json({
success:false,
error:err.toString()
});

}

}
