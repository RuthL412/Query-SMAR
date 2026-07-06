db.t_purchase_order.aggregate([
    {
        $match: {
                        _id: {
                $in: [
"PO202500001917",

								]
            }
        }
    },
    {
        $unwind: "$details"
    },
    {
        $group: {
            _id: {
                _id: "$_id",
								noPoSAP:"$noPoSAP",
								nosap:"$details.noSap",
								qty:"$details.qty",
								oaItemNo:"$details.oaItemNo",
                sku: "$details.sku",
                lineItem: "$details.lineItem",
                noOA: "$noOA"
            },
        }
    },
    {
        $project: {
            _id: "$_id._id",
								noPoSAP:"$_id.noPoSAP",
								nosap:"$_id.nosap",
                sku: "$_id.sku",
                lineItem: "$_id.lineItem",
								oaItemNo:"$_id.oaItemNo",
                noOA: "$_id.noOA",
                qty: "$_id.qty"
        }
    },
    //{$project:{_id:"$_id._id",sku:"$_id.sku",buyerName:"$_id.buyerName",qty:"$qty",status:"$_id.status"}},
    {
        $sort: {
            lineItem: 1
        }
    }
]);
