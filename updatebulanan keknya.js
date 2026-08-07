db.t_purchase_order.aggregate([
    {
        $match: {
            //            
//            _id: {
//                $in: [
//"PO202500000765","PO202500000744","PO202500000764","PO202500000763","PO202500000757", "PO202500000756","PO202500000755","PO202500000754", "PO202500000753","PO202500000752", "PO202500000751","PO202500000750","PO202500000749","PO202500000747","PO202500000746",
//                    
//                ]
//            }
"details.noAlokasi":/NAB/i,

status:{$not:/reject/i}

        }
    },
    {
        $unwind: "$details"
    },
    {
        $group: {
            _id: {
//                _id: "$_id",
                "supplierId": "$supplierId",
                "supplierName": "$supplierName",
                "buyerId": "$buyerId",
                "buyerName": "$buyerName",
                //                sku: "$details.sku",
                noAlokasi: "$details.noAlokasi",
//                status: "$status",
                
            },
            qty: {
                $sum: "$details.qty"
            },
            
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak_unit",
            let: {
                alokasi: "$_id.noAlokasi",
                supplier: "$_id.supplierId",
                buyer: "$_id.buyerId",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$noAlokasi", "$$alokasi"]
                            }, {
                                $eq: ["$buyerId", "$$buyer"]
                            }, {
                                $eq: ["$supplierId", "$$supplier"]
                            }]
                        }
                    }
                },
//								{$unwind:"$listBreakdown"},
                {
                    $project: {
                        noAlokasi: "$noAlokasi",
                        listBreakdown: { $arrayElemAt: ["$listBreakdown", 0] }
                        
                    }
                }
            ],
            as: "alokasiUnit",
            
        },
        
    },
    {
        $unwind: "$alokasiUnit"
    },
    {
        $project: {
            _id: "$_id._id",
            "supplierName": "$_id.supplierName",
            "buyerName": "$_id.buyerName",
            //            sku: "$_id.sku",
//            status: "$_id.status",
            noAlokasi: "$_id.noAlokasi",
            qty: "$qty",
            avalaibleQuota: "$alokasiUnit.listBreakdown.avalaibleQuota",
            quota: "$alokasiUnit.listBreakdown.quota",
						find:{$concat:[
    "db.m_new_alokasi_bulanan_kontrak_unit.find({supplierName: '","$_id.supplierName","',buyerName: '","$_id.buyerName","', noAlokasi: '","$_id.noAlokasi","'})"
    ]},
						query:{$concat:[
						"db.m_new_alokasi_bulanan_kontrak_unit.updateOne({supplierName: '","$_id.supplierName","',buyerName: '","$_id.buyerName","', noAlokasi: '","$_id.noAlokasi","'}, {$set: { 'listBreakdown.0.reservedQuota': NumberLong('",{$toString:"$qty"},"'), 'listBreakdown.0.availableQuota': NumberLong('",{$toString:{$subtract:["$alokasiUnit.listBreakdown.quota","$qty"]}},"'),}})"
						]},
            keterangan: {
                $cond: {
                    if : {
                        $gte: ["$alokasiUnit.avalaibleQuota", "$qty"]
                    },
                    then: "AMAN",
                    else : {
                        $concat: ["$_id._id", " tidak dapat diaktivasi, stock siap pesan pada Alokasi ", "$_id.noAlokasi", " tidak memenuhi qty PO."]
                    }
                }
            }
        }
    },
    {
        $sort: {
            supplierName: 1,
            noAlokasi: 1
        }
    }
])

