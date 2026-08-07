db.t_history_new_alokasi_kontrak.aggregate([{
    $match: {
        _created: {
            $gt: ISODate("2025-11-31T17:00:00.000Z")
        },
        "buyerId": {
            $in: ["pln_kw_uiw_sumatera_barat", "pln_kw_uiw_sumatera_utara", "pln_kw_uiw_aceh"]
        },
        "event": "EDIT_ALOKASI",
        
    }
}, {
    $unwind: "$listMaterial"
}, {
    $project: {
        
        "noAlokasi": "$noAlokasi",
        sku: "$listMaterial.skuName",
        kategori: "$listMaterial.categoryLv1Name",
        "supplierId": "$supplierId",
        "supplierName": "$supplierName",
        "buyerId": "$buyerId",
        "categoryName": "$categoryName",
        "buyerName": "$buyerName",
        totalinputalokasi: {
            $subtract: ["$quotaAfter", "$quotaBefore"]
        }
    }
}, {
    $group: {
        _id: {
            _id: "$_id",
            "noAlokasi": "$noAlokasi",
            sku: "$sku",
            kategori: "$kategori",
            "supplierId": "$supplierId",
            "supplierName": "$supplierName",
            "buyerId": "$buyerId",
            "buyerName": "$buyerName",
            
        },
        inputAlokasi: {
            $sum: "$totalinputalokasi"
        }
    }
}, {
    $project: {
        _id: 0,
        "noAlokasi": "$_id.noAlokasi",
        sku: "$_id.sku",
        kategori: "$_id.kategori",
        "supplierId": "$_id.supplierId",
        "supplierName": "$_id.supplierName",
        "buyerId": "$_id.buyerId",
        "buyerName": "$_id.buyerName",
        inputAlokasi: "$inputAlokasi"
    }
}, {
    $lookup: {
        from: "t_purchase_order",
        let: {
            alokasi: "$noAlokasi",
            buyer: "$buyerId",
            supplier: "$supplierId",
            
        },
        pipeline: [
            
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: ["$supplierId", "$$supplier"]
                            },
                            {
                                $eq: ["$buyerId", "$$buyer"]
                            }
                        ]
                    },
                    createdDate: {
                        $gt: ISODate("2025-11-31T17:00:00.000Z")
                    },
                    
                },
                
            },
            {
                $unwind: "$details"
            },
            {
                $group: {
                    _id: {
                        _id: "$_id",
                        "supplierId": "$supplierId",
                        "supplierName": "$supplierName",
                        "buyerId": "$buyerId",
                        "buyerName": "$buyerName",
                        //                sku: "$details.sku",
                        noAlokasi: "$details.noAlokasi",
                        status: "$status",
                        
                    },
                    qty: {
                        $sum: "$details.qty"
                    },
                    
                }
            },
            {
                $project: {
                    _id: "$_id._id",
                    "supplierName": "$_id.supplierName",
                    "supplierId": "$_id.supplierId",
                    "buyerId": "$_id.buyerId",
                    "buyerName": "$_id.buyerName",
                    //            sku: "$_id.sku",
                    status: {
                        $cond: {
                            if : {
                                $eq: ["$_id.status", "APPROVED_SUPPLIER"]
                            },
                            then: "realisasi",
                            else : "reserved"
                        }
                    },
                    noAlokasi: "$_id.noAlokasi",
                    qty: "$qty",
                    
                }
            },
            {
                $group: {
                    _id: {
                        "supplierId": "$supplierId",
                        "supplierName": "$supplierName",
                        "buyerId": "$buyerId",
                        "buyerName": "$buyerName",
                        noAlokasi: "$noAlokasi",
                        status: "$status",
                        
                    },
                    qty: {
                        $sum: "$qty"
                    },
                    
                }
            },
            {
                $project: {
                    _id: 0,
                    "supplierId": "$_id.supplierId",
                    "supplierName": "$_id.supplierName",
                    "buyerId": "$_id.buyerId",
                    "buyerName": "$_id.buyerName",
                    //            sku: "$_id.sku",
                    status: "$_id.status",
                    noAlokasi: "$_id.noAlokasi",
                    qty: "$qty",
                    
                }
            },
            {
                $match: {
                    $expr: {
                        $and: [{
                            $eq: ["$noAlokasi", "$$alokasi"]
                        }]
                    }
                }
            }
        ],
        as: "po"
    }
},
// {
//    $unwind: "$po"
//},
 {
    $project: {
        "No Alokasi": "$noAlokasi",
        sku: "$sku",
        kategori: "$kategori",
//        "supplierId": "$supplierId",
        "supplierName": "$supplierName",
//        "buyerId": "$buyerId",
        "buyerName": "$buyerName",
        "Input Alokasi pada Desember": "$inputAlokasi",
        qtyPO: {
            $cond: [
                
                    {
      $eq: [
        { $size: { $ifNull: ["$po", []] } }, // kalau null ⇒ jadi []
        0                                     // panjang array = 0
      ]
    },
                "-",
                { $arrayElemAt: ["$po.qty", 0] } 
            ]
        }
    }
}])

