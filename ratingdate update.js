db.t_delivery_order.aggregate([
    {
        $match: {
            _id: {
                $in: [
                    "DO202500043422"
                ]
            }
        }
    },
    {
        $unwind: {
            path: "$detail",
            includeArrayIndex: "index"
        }
    },
    {
        $addFields: {
            today: {
                $dateToString: {
                    format: "%Y-%m-%d 00:00:00.000",
                    date: "$$NOW"
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            "nodo": "$_id",
            "nopo": "$nopo",
            "noPoSAP": {
                $ifNull: ["$noPoSAP", "n/a"]
            },
            "supplierName": "$supplierName",
            "buyerName": "$buyerName",
            "unitName": "$unitName",
            "qty": "$qty",
            "index": "$index",
            "productId": "$detail.itemId",
            "sku": "$detail.sku",
            "skuName": "$detail.skuName",
            "qtyTerima": "$detail.qtyTerima",
            "tanggalRating": "$detail.ratingDate",
            "noGrSAP": {
                $ifNull: ["$detail.noGrSAP", "n/a"]
            },
            "status": "$status",
            "status (Line Item)": "$detail.status",
            "query FIND": {
                $cond: {
                    if : {
                        $eq: [
                            {
                                $type: "$detail.noGrSAP"
                            },
                            "missing"
                        ]
                    },
                    then: {
                        $concat: [
                            "db.t_delivery_order.find({_id: '",
                            "$_id",
                            "'})"
                        ]
                    },
                    else : "n/a"
                }
            },
            "query UPDATE": {
                $cond: {
                    if : {
                        $eq: [
                            {
                                $type: "$detail.noGrSAP"
                            },
                            "missing"
                        ]
                    },
                    then: {
                        $concat: [
                            "db.t_delivery_order.updateOne({_id: '",
                            "$_id",
                            "'}, {$set: { ",
                            "'detail.",
                            {
                                $toString: "$index"
                            },
                            ".ratingDate': ISODate('",
                            "$today",
                            "'), ",
                            "'detail.",
                            {
                                $toString: "$index"
                            },
                            ".rating.updated': ISODate('",
                            "$today",
                            "')}})"
                        ]
                    },
                    else : "n/a"
                }
            }
        }
    }
])