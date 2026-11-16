// db.m_shipping_cost.aggregate([
//     {
//         $project: {
// 				_id:0,
// 				SKU:"$sku",
// 				"Nama SKU":"$skuName",
// 				"Nama Penyedia":"$supplierName",
// 				"Nama Unit Tujuan":"$unitName",
// 				"Harga":"$harga",
// 				"Max Durasi Pengiriman":"$maxLeadTime",
// 				}
//     }
// ]);
// db.m_shipping_cost_v2.find().limit(100)
db.m_shipping_cost_v2.aggregate([
    {
        $project: {
				_id:0,
				SKU:"$sku",
				"Nama SKU":"$skuName",
				"Kota Asal":"$originName",
				"Kode Kota Asal":"$originId",
				"Kota Tujuan":"$destinationName",
				"Kode Kota Tujuan":"$destinationId",
				"Harga":"$price",
				"Max Durasi Pengiman":"$maxLeadDay",
				}
    },    {
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
