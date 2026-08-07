db.t_purchase_order.aggregate([
    {
        $match: {
            "buyerId": {
                $in: ["pln_kw_uiw_sumatera_barat", "pln_kw_uiw_sumatera_utara", "pln_kw_uiw_aceh"]
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
                "categoryName": "$categoryName",
                "buyerName": "$buyerName",
                //                sku: "$details.sku",
                noAlokasi: "$details.noAlokasi",
                sku: "$details.skuName",
                status: "$status",
                
            },
            qty: {
                $sum: "$details.qty"
            },
            
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_kontrak_unit",
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
                {
                    $project: {
                        noAlokasi: "$noAlokasi",
                        stockSiapPesan: "$availableQuota",
                        quota: "$quota",
                        
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
            "supplierId": "$_id.supplierId",
            "sku": "$_id.sku",
            "categoryName": "$_id.categoryName",
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
                "categoryName": "$categoryName",
                "sku": "$sku",
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
            sku: "$_id.sku",
            categoryName: "$_id.categoryName",
            status: "$_id.status",
            noAlokasi: "$_id.noAlokasi",
            qty: "$qty",
            
        }
    },
    {
        $lookup: {
            from: "t_history_new_alokasi_kontrak",
            let: {
                alokasi: "$noAlokasi",
                buyer: "$buyerId",
                supplier: "$supplierId",
                
            },
            pipeline: [{
                $match: {
                    $expr: {
                        $and: [{
                            $eq: ["$noAlokasi", "$$alokasi"]
                        }, {
                            $eq: ["$buyerId", "$$buyer"]
                        }, {
                            $eq: ["$supplierId", "$$supplier"]
                        }]
                    },
                    _created: {
                        $gt: ISODate("2025-11-31T17:00:00.000Z")
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
            }],
            as: "alokasi"
        }
    },
    {
        $project: {
            "No Alokasi": "$noAlokasi",
            sku: "$sku",
            "categoryName": "$categoryName",
            kategori: "$kategori",
//            "status": "$status",
            "supplierName": "$supplierName",
            //        "buyerId": "$buyerId",
            "buyerName": "$buyerName",
            inputALokasi: {
                $cond: [
                    
                    {
                        $eq: [
                            {
                                $size: {
                                    $ifNull: ["$alokasi", []]
                                }
                            }, // kalau null ⇒ jadi []
                            0 // panjang array = 0
                        ]
                    },
                    "-",
                    {
                        $arrayElemAt: ["$alokasi.inputAlokasi", 0]
                    }
                ]
            },
						
            "qtyPO": "$qty",
        }
    },
    {
        $match: {
            inputALokasi: "-"
        }
    },
    {
        $sort: {
            "No Alokasi": 1
        }
    }
])
