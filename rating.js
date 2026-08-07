db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
            ratingKHSStatus: {
                $exists: true
            }
        }
    },
    {
        "$project": {
            "_id": 1,
            "originalId": "$_id",
            "supplierId": "$supplierId",
            "supplierName": "$supplierName",
            "noKontrak": "$noKontrak",
            "categoryId": {
                "$arrayElemAt": ["$materials.categoryId", 0]
            },
            "skuId": {
                "$arrayElemAt": ["$materials.skuId", 0]
            },
            "ratingPLNPusat": {
                $cond: {
                    if : {
                        $ifNull: ["$ratingPLNPusat", false]
                    },
                    then: "$ratingPLNPusat.kualitas",
                    else : "-"
                }
            },
            "ratingKHSStatus": "$ratingKHSStatus",
            "first": "$first",
            "latest": "$latest"
        }
    },
    {
        "$group": {
            "_id": {
                "originalId": "$originalId",
                "supplierId": "$supplierId",
                "supplierName": "$supplierName",
                "noKontrak": "$noKontrak",
                "categoryId": "$categoryId",
                "skuId": "$skuId",
                "ratingPLNPusat": "$ratingPLNPusat",
                "ratingKHSStatus": "$ratingKHSStatus",
                "first": "$first",
                "latest": "$latest"
            },
            "count": {
                "$sum": 1
            }
        }
    },
    {
        "$project": {
            "id": "$_id.originalId",
            "supplierId": "$_id.supplierId",
            "supplierName": "$_id.supplierName",
            "noKontrak": "$_id.noKontrak",
            "categoryId": "$_id.categoryId",
            "skuId": "$_id.skuId",
            "ratingPLNPusat": "$_id.ratingPLNPusat",
            "ratingKHSStatus": "$_id.ratingKHSStatus",
            "first": "$_id.first",
            "latest": "$_id.latest",
            "count": 1
        }
    },
    {
        "$lookup": {
            "from": "m_setting_sla_rating",
            "localField": "categoryId",
            "foreignField": "_id",
            "as": "slaInfo"
        }
    },
    {
        "$unwind": "$slaInfo"
    },
    {
        "$lookup": {
            "from": "m_product_sku",
            "localField": "skuId",
            "foreignField": "_id",
            "as": "productSku"
        }
    },
    {
        "$unwind": "$productSku"
    },
    {
        "$project": {
            "id": 1,
            "noKontrak": 1,
            "categoryId": 1,
            "supplierId": 1,
            "supplierName": 1,
            "active": "$slaInfo.active",
            "isUst": "$productSku.isUst",
            "ratingKHSStatus": 1,
            "ratingPLNPusat": 1,
            "latest": 1,
            "first": 1,
            "count": 1
        }
    },
    {
        "$lookup": {
            "from": "m_ust_request",
            "let": {
                "noKontrak": "$noKontrak"
            },
            "pipeline": [
                {
                    "$match": {
                        "$expr": {
                            "$eq": ["$noKontrak", "$$noKontrak"]
                        },
                        "status": "VERIFIED"
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "status": 1
                    }
                }
            ],
            "as": "m_ust_request"
        }
    },
    {
        "$lookup": {
            "from": "m_ust_request_elab",
            "let": {
                "noKontrak": "$noKontrak"
            },
            "pipeline": [
                {
                    "$match": {
                        "$expr": {
                            "$eq": ["$noKontrak", "$$noKontrak"]
                        },
                        "status": "VERIFIED"
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "status": 1
                    }
                }
            ],
            "as": "m_ust_request_elab"
        }
    },
    {
        "$lookup": {
            "from": "m_ust_request_mims",
            "let": {
                "noKontrak": "$noKontrak"
            },
            "pipeline": [
                {
                    "$match": {
                        "$expr": {
                            "$eq": ["$noKontrak", "$$noKontrak"]
                        },
                        "status": "VERIFIED"
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "status": 1
                    }
                }
            ],
            "as": "m_ust_request_mims"
        }
    },
    {
        "$match": {
            "$and": [
                {
                    "$or": [
                        {
                            "m_ust_request.status": "VERIFIED"
                        },
                        {
                            "m_ust_request_mims.status": "VERIFIED"
                        },
                        {
                            "$or": [
                                {
                                    "m_ust_request_elab.status": "VERIFIED"
                                },
                                {
                                    "$and": [
                                        {
                                            "m_ust_request_elab.status": "REJECTED"
                                        },
                                        {
                                            "m_ust_request_elab.statusCancel": 0
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "isUst": false
                        }
                    ]
                },
                {
                    "active": true
                },
                {
                    "first": true
                }
            ]
        }
    },
    {
        "$sort": {
            "ratingKHSStatus": - 1,
            "latest": - 1,
            "noKontrak": 1
        }
    },
    {
        $project: {
            _id: 0,
            id: 1,
            supplierId: 1,
            supplierName: 1,
            noKontrak: 1,
            categoryId: 1,
            "ratingKHSStatus": 1,
            "ratingPLNPusat": 1,
            
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_kontrak",
            let: {
                idKontrak: "$id",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $or: [
                                {
                                    $in: ["$$idKontrak", "$details.idKontrak"]
                                },
                                {
                                    $in: ["$$idKontrak", "$details.idKontrakFirst"]
                                }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        noAlokasi: "$_id"
                    }
                },
                
            ],
            as: "alokasi"
        },
        
    },
    {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak",
            let: {
                idKontrak: "$id",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $or: [
                                {
                                    $in: ["$$idKontrak", "$details.idKontrak"]
                                },
                                {
                                    $in: ["$$idKontrak", "$details.idKontrakFirst"]
                                }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        noAlokasi: "$_id"
                    }
                },
                
            ],
            as: "alokasiBulanan"
        },
        
    },
    {
        $set: {
            items: {
                $concatArrays: ["$alokasi", "$alokasiBulanan"]
            }
        }
    },
    {
        $project: 
        {
            "supplierId": 1,
            "supplierName": 1,
            "noKontrak": 1,
            "categoryId": 1,
            "ratingKHSStatus": 1,
            "ratingPLNPusat": 1,
            alokasi: "$items.noAlokasi"
        },
        
    },
    //	{$unwind:"$items"},
    
    {
        $lookup: {
            from: "t_purchase_order",
            let: {
                noAlokasi: "$alokasi",
                supplier: "$supplierId",
                
            },
            pipeline: [
                {
                    $match: {
                        createdDate: {
                            $gt: ISODate("2024-12-31T17:00:00.000Z")
                        },
                        status: {
                            $nin: [/REJECT/i]
                        },
                        $expr: {
                            $or: [{
                                $eq: ["$supplierId", "$$supplier"]
                            }, {
                                $in: ["$details.noAlokasi", "$$noAlokasi"]
                            }, ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        nopo: "$_id",
                        status: "$status"
                    }
                },
                
            ],
            as: "PO"
        },
        
    },
    {
        $unwind: "$PO"
    },
    {
        $group: {
            _id: {
                
                "supplierId": "$supplierId",
                "supplierName": "$supplierName",
                "noKontrak": "$noKontrak",
                "categoryId": "$categoryId",
                "ratingPLNPusat": "$ratingPLNPusat",
                "ratingKHSStatus": "$ratingKHSStatus",
                PO: "$PO.nopo",
                
            }
        }
    },
    {
        $project: {
				_id:0,
            "supplierId": "$_id.supplierId",
            "supplierName": "$_id.supplierName",
            "noKontrak": "$_id.noKontrak",
            "categoryId": "$_id.categoryId",
            "ratingPLNPusat": "$_id.ratingPLNPusat",
            "ratingKHSStatus": "$_id.ratingKHSStatus",
            PO: "$_id.PO"
        }
    },
//    {
//        $limit: 1
//    }
], {
    allowDiskUse: true
})