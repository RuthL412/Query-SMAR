db.t_purchase_order.aggregate([
    {
        $match: {
            _id: "PO202400001956"
        }
    },
    {
        $unwind: "$details"
    },
    {
        $project: {
            qtyDikirim: "$details.qtyDikirim",
            sku: "$details.sku",
            buyerName: "$details.unitName",
            status: "$details.detailStatus"
        }
    },
    {
        $sort: {
            _id: 1
        }
    }
]);