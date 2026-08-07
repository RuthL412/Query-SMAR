db.m_product.aggregate([
    {
        $match: {
            "categoryLv1Id": "plnmp077"
        }
    },
    {
        $lookup: {
            from: "m_product_sku",
            let: {
                sku: "$skuId"
            },
            pipeline: [
						{
                    $match: {
                        $expr: {
                            $and: [{
																	$eq: ["$_id", "$$sku"]
                            }]
                        }
                    }
                },
								{$project:{noSap:"$noSap",skuType:"$skuType"}}
						],
            as: "sku"
        }
    },
//		{$project:{sku:1}}
		
		{$unwind:"$sku"},
		{$unwind:"$supplier"},
		{$project:{
		_id:0,
		"Produk Id":"$_id",
		"Tipe SKU":"$sku.skuType",
		"Nomor Material":{
                $cond: {
                    if : {
                        $ifNull: ["$sku", false]
                    },
                    then: "$sku.noSap",
                    else : "-",
                    
                }
            },
						"Nama Material":"$skuName",
						"Pabrikan":"$supplier.name",
		}}
//    
])