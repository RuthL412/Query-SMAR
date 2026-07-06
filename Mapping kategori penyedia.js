db.m_product.aggregate([
    {
        $match: {
            status: "ACTIVE"
        }
    },
    {
        $group: {
            _id: {
                skuName: "$skuName",
                category: "$categoryLv1Name",
                vendor: "$supplier.name"
            }
        }
    },
    {
        $project: {
            _id: 0,
						
            Penyedia: "$_id.vendor",
            Product: "$_id.skuName",
            Kategori: "$_id.category",
            
        }
    },
    {
        $sort: {
            Penyedia: 1,
						Kategori:1
        }
    }
])