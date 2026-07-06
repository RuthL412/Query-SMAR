db.t_delivery_order.aggregate([
    {
        $match: {
            _id: {
                $in: [
                    "DO202400010911",
                    "DO202400010912",
                    "DO202400010913",
                    "DO202400010914",
                    "DO202400010915",
                    "DO202400010916",
                    "DO202400010917",
                    "DO202400010918",
                    "DO202400010919",
                    "DO202400010920",
                    "DO202400010921",
                    "DO202400010922",
                    "DO202400010923",
                    "DO202400010924",
                    "DO202400010991",
                    "DO202400010992",
                    "DO202400010993",
                    
                ]
            }
        }
    },
    {
        $unwind: "$detail"
    },
    //    {
    //        $group: {
    //            {
    //                _id: {
    //                    qtyDikirim: "$detail.qty",
    //                    sku: "$detail.sku",
    //                    buyerName: "$unitName",
    //                    status: "$detail.status"
    //                }
    //            }
    //        },
    {
        $project: {
            qtyDikirim: "$detail.qty",
            sku: "$detail.sku",
            buyerName: "$unitName",
            status: "$detail.status"
        }
    },
    {
        $sort: {
            sku: 1,
            buyerName: 1
        }
    }
]);