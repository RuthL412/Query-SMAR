db.m_shipping_cost_v2.aggregate([
{
$match:{
destinationId:{
$in:[
"3172","3171","3671","3671","3171","3172","3674","3175","3175","3671","3175","3174","3172","3172","3275","3175","3172","3175","1872","1803","1871","1871","1810","1901","1902","1901","1971","1901","1905","1904","1905","1902","1902","1906","1901","6372","6371","6307","6302","6203","6271","6201","1671","1771","1571","1604","1508","1610","1671","1673",
]
}
}
},
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
