db.t_purchase_order.aggregate([
    {
        $match: {
            supplierName: "PT MULYA UTAMA MANDIRI SENTOSA",
            "details.noAlokasi": "NA20230707-215027",
            status: {
                $in: ["REQUESTED", "APPROVED_SUPPLIER", "PROCESSED_BABG", "PROCESSED_SUPPLIER", "RECEIVED", "FINISHED"]
            }
        }
    },
    {
        $lookup: 
        {
            from: "t_delivery_order",
            pipeline: [
                {
                    $match: {
                        "detail.sku": "1582014819815",
                        "detail.status": {
                            $in: ["RECEIVED", "RATED"]
                        }
                    }
                },
                {
                    $unwind: "$detail"
                },
                {
                    $group: {
                        _id: {
                            _id: "$_id",
                            sku: "$detail.sku",
                            
                        },
                        qty: {
                            $sum: "$detail.qty"
                        }
                    }
                },
                {
                    $project: {
                        _id: "$_id._id",
                        sku: "$_id.sku",
                        qty: "$qty",
                        
                    }
                }
            ],
            as: "DO"
        }
    },
    {
        $project: {
            _id: 0,
            DO: "$DO"
        }
    },
//    {
//        $replaceRoot: {
//            newRoot: "$DO"
//        }
//    }
])