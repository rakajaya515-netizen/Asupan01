export default async function handler(req, res) {

  const page = req.query.page || 1;

  try {

    const response = await fetch(
      `https://vizey.net/api/v1/list?apikey=${process.env.VIZEY_API_KEY}&page=${page}`
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({
        success: false,
        message: "Vizey API Error",
        error: data
      });
    }

    return res.status(200).json({
      success: true,

      videos: data.data || [],

      pagination: {
        currentPage: data.pagination?.currentPage || 1,
        totalPages: data.pagination?.totalPages || 1,
        totalItems: data.pagination?.totalItems || 0,
        hasNext: data.pagination?.hasNext || false
      }
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

}
