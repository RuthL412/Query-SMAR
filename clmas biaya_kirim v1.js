db.m_shipping_cost.aggregate([
    {
        $project: {
            _id: 0,
            SKU: "$sku",
            "Nama SKU": "$skuName",
            "Nama Penyedia": "$supplierName",
            "Nama Unit Tujuan": "$unitName",
            "Harga": "$harga",
            "Max Durasi Pengiriman": "$maxLeadTime",
            
        }
    },
    {
        $lookup: {
            from: "m_product_sku",
            let: {
                sku: "$SKU"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$_id", "$$sku"]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        nosap: {
                            $ifNull: ["$noSap", "-"]
                        }
                    }
                }
            ],
            as: "nosap",
            
        }
    },
    // 		{$unwind:"$noSap"},
    {
        $addFields: {
            noMaterial:{$arrayElemAt:["$nosap.nosap",0]}
        }
    },
//     {
//         $limit: 2
//     },
		{
		$project:{
		nosap:0
		}
		}
]);