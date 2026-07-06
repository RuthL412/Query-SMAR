db.t_purchase_order.aggregate([
    {
        $match: {
            _id: {$in:[
"PO202500002677",
"PO202500003087",
"PO202500003090",
"PO202500003091",
"PO202500000454",
						]}
        }
    },
    {
        $unwind: "$details"
    },
    {
        $group: {
            _id: {
                _id: "$_id",
                noOA: "$noOA",
                noPoSAP: "$noPoSAP",
                unitId: "$details.unitId",
                productId: "$details.productId",
                
            }
        }
    },
    {
        $project: {
            _id: "$_id._id",
            noOA: "$_id.noOA",
            noPoSAP: "$_id.noPoSAP",
            unitId: "$_id.unitId",
            productId: "$_id.productId",
            
        }
    },
    {
        $lookup: {
            from: "t_delivery_order",
            let: {
                po: "$_id",
                unit: "$unitId",
                produk: "$productId",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$nopo", "$$po"]
                            }, {
                                $eq: ["$unitId", "$$unit"]
                            }]
                        }
                    }
                },
                {
                    $unwind: "$detail"
                },
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$detail.itemId", "$$produk"]
                            }]
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            do: "$_id",
                            unitName: "$unitName",
                            buyerName: "$buyerName",
                            supplierName: "$supplierName",
                            itemId: "$detail.itemId",
                            status: "$detail.status",
                            
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        do: "$_id.do",
                        unitName: "$_id.unitName",
                        buyerName: "$_id.buyerName",
                        supplierName: "$_id.supplierName",
                        itemId: "$_id.itemId",
                        status: "$_id.status",
                        
                    }
                }
            ],
            as: "nodo",
            
        },
        
    },
    {
        $unwind: "$nodo"
    },
    {
        $group: {
            _id: {
                PO: "$_id",
                DO: "$nodo.do",
                noOA: "$noOA",
                buyerName: "$nodo.buyerName",
                unitName: "$nodo.unitName",
                supplierName: "$nodo.supplierName",
                productId: "$nodo.itemId",
                status: "$nodo.status",
                
            }
        }
    },
    {
        $project: {
            _id: 0,
            PO: "$_id.PO",
            DO: "$_id.DO",
            noOA: "$_id.noOA",
            buyerName: "$_id.buyerName",
            unitName: "$_id.unitName",
            supplierName: "$_id.supplierName",
            productId: "$_id.productId",
            status: "$_id.status",
						 keterangan: {
                $cond: {
                    if : {
                        $eq: ["$_id.status", "RATED"]
                    },
                    then: {$concat:["Sudah ada DO rated, ","$_id.PO", "  TIDAK BISA PEMBARUAN NoPOSAP"]},
                    else : "AMAN"
                }
            }
            
        }
    }
]);

//db.t_purchase_order.find({
//    _id: "PO202200000556"
//})
//
//db.t_delivery_order.find({nopo:"PO202200000556"})