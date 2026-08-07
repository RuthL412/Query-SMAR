db.t_operasional.aggregate([
    {
        $match: {
            "tipeOperasional": "REVISI_STOK_PENYEDIA",
            
        }
    },
    {
        $unwind: "$listData"
    },
    {
        $group: {
            _id: {
                _id: "$listData.sku",
                skuName: "$listData.skuName"
            },
            stokRevisi: {
                $sum: "$listData.stokRevisi"
            }
        }
    },
    {
        $project: {
            _id: 0,
            sku: "$_id._id",
            skuName: "$_id.skuName",
            stokRevisi: "$stokRevisi"
        }
    },
    {
        $lookup: {
            from: "m_product_sku",
            let: {
                skuId: "$sku"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$skuId"]
                            }]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        categoryLv1Name: "$categoryLv1Name"
                    }
                }
            ],
            as: "SKUUU"
        }
    },
    {
        $unwind: "$SKUUU"
    },
    {
        $project: {
            _id: "$SKUUU",
            sku: "$sku",
            skuName: "$skuName",
            stokRevisi: "$stokRevisi",
            
        }
    },
    
])


//db.m_product_sku.find({})