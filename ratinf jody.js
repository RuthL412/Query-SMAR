db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
            noKontrak: {
                $in: [
                    RegExp("0172.PJ/DAN.01.03/F01020000/2024", "i"),
                    RegExp("0059.PJ/DAN.01.03/F01020000/2026", "i"),
                    RegExp("0168.PJ/DAN.01.03/F01020000/2024", "i"),
                    RegExp("0056.PJ/DAN.01.03/F01020000/2026", "i")
                ]
            },
            supplierName: {
                $in: [
                    /BAKRIE PIPE/i,
                    /RAJA BESI/i
                ]
            },
            first: true
        }
    },
    {
        $project: {
            _id: 1,
            "originalId": "$_id",
            "supplierId": "$supplierId",
            "supplierName": "$supplierName",
            "noKontrak": "$noKontrak",
            "categoryId": {
                $arrayElemAt: ["$materials.categoryId", 0]
            },
            "categoryName": {
                $arrayElemAt: ["$materials.categoryName", 0]
            },
            "ratingPLNPusat": "$ratingPLNPusat",
            "ratingKHSStatus": "$ratingKHSStatus",
            "first": "$first",
            "latest": "$latest",
            "amandement": "$amandement",
            "startDateKontrak": "$startDateKontrak",
            "endDateKontrak": "$endDateKontrak",
            "createdDate": "$createdDate",
            "status": "$status",
            "skuId": {
                $arrayElemAt: ["$materials.skuId", 0]
            }
        }
    },
    {
        $group: {
            "_id": {
                "originalId": "$originalId",
                "supplierId": "$supplierId",
                "supplierName": "$supplierName",
                "noKontrak": "$noKontrak",
                "categoryId": "$categoryId",
                "categoryName": "$categoryName",
                "skuId": "$skuId",
                "ratingPLNPusat": "$ratingPLNPusat",
                "ratingKHSStatus": "$ratingKHSStatus",
                "first": "$first",
                "latest": "$latest",
                "amandement": "$amandement",
                "startDateKontrak": "$startDateKontrak",
                "endDateKontrak": "$endDateKontrak",
                "createdDate": "$createdDate",
                "status": "$status"
            },
            "count": {
                "$sum": 1
            }
        }
    },
    {
        $project: {
            "id": "$_id.originalId",
            "supplierId": "$_id.supplierId",
            "supplierName": "$_id.supplierName",
            "noKontrak": "$_id.noKontrak",
            "categoryId": "$_id.categoryId",
            "categoryName": "$_id.categoryName",
            "skuId": "$_id.skuId",
            "ratingPLNPusat": "$_id.ratingPLNPusat",
            "ratingKHSStatus": "$_id.ratingKHSStatus",
            "first": "$_id.first",
            "latest": "$_id.latest",
            "count": 1,
            "amandement": "$_id.amandement",
            "startDateKontrak": "$_id.startDateKontrak",
            "endDateKontrak": "$_id.endDateKontrak",
            "createdDate": "$_id.createdDate",
            "status": "$_id.status"
        }
    },
    {
        $lookup: {
            from: "m_setting_sla_rating",
            let: {
                "categoryId": "$categoryId"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$_id", "$$categoryId"]
                                }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        active: 1
                    }
                }
            ],
            as: "slaInfo"
        }
    },
    {
        $lookup: {
            from: "m_product_sku",
            let: {
                "skuId": "$skuId"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$_id", "$$skuId"]
                                }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        isUst: 1
                    }
                },
                
            ],
            as: "productSku"
        }
    },
    {
        $unwind: "$slaInfo"
    },
    {
        $unwind: "$productSku"
    },
    {
        "$project": {
            "id": 1,
            "noKontrak": 1,
            "categoryId": 1,
            "categoryName": 1,
            "supplierId": 1,
            "supplierName": 1,
            "active": "$slaInfo.active",
            "isUst": "$productSku.isUst",
            "ratingKHSStatus": 1,
            "ratingPLNPusat": 1,
            "latest": 1,
            "first": 1,
            "count": 1,
            "amandement": 1,
            "startDateKontrak": 1,
            "endDateKontrak": 1,
            "createdDate": 1,
            "status": 1
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
            categoryName: 1,
            "ratingKHSStatus": 1,
            "ratingPLNPusat": 1,
            "amandement": 1,
            "startDateKontrak": 1,
            "endDateKontrak": 1,
            "createdDate": 1,
            "status": 1
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_kontrak",
            let: {
                "noKontrak": "$noKontrak",
                
            },
            pipeline: [
                {
                    $unwind: "$details"
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$details.noKontrak", "$$noKontrak"]
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
                "noKontrak": "$noKontrak"
            },
            pipeline: [
                {
                    $unwind: "$details"
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$details.noKontrak", "$$noKontrak"]
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
            "categoryName": 1,
            "ratingKHSStatus": 1,
            "ratingPLNPusat": 1,
            alokasi: "$items.noAlokasi",
            "amandement": 1,
            "startDateKontrak": 1,
            "endDateKontrak": 1,
            "createdDate": 1,
            "status": 1
        }
    },
    {
        $lookup: {
            from: "t_purchase_order",
            let: {
                "supplierId": "$supplierId",
                "alokasi": "$alokasi"
            },
            pipeline: [
                {
                    $match: {
                        status: {
                            $nin: [/reject/i]
                        },
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$slaRating", true]
                                },
                                {
                                    $eq: ["$supplierId", "$$supplierId"]
                                },
                                {
                                    $gt: [
                                        {
                                            $size: {
                                                $setIntersection: [
                                                    "$details.noAlokasi",
                                                    "$$alokasi"
                                                ]
                                            }
                                        },
                                        0
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        "ratingPO": {
                            "ratingPurchaseOrder": "$ratingPurchaseOrder.qualityAndQuantity",
                            "deliveryTime": "$ratingPurchaseOrder.deliveryTime",
                            "sangksi": "$ratingPurchaseOrder.sangksi",
                            "layanan": "$ratingPurchaseOrder.layanan"
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        status: 1,
                        ratingStatus: "$ratingStatus",
                        nopoAms: 1,
                        noPoSAP: 1,
                        "ratingPO": "$ratingPO",
                        details: 1
                    }
                }
            ],
            as: "po"
        }
    },
    {
        $unwind: {
            path: "$po",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: "$po.details",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: "$ratingPLNPusat",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: "t_delivery_order",
            let: {
                "nopo": "$po._id",
                "unitId": "$po.details.unitId",
                "itemId": ["$po.details.productId"]
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$nopo", "$$nopo"]
                                },
                                {
                                    $eq: ["$unitId", "$$unitId"]
                                },
                                {
                                    $gt: [
                                        {
                                            $size: {
                                                $setIntersection: [
                                                    "$detail.itemId",
                                                    "$$itemId"
                                                ]
                                            }
                                        },
                                        0
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        "ratingDO": {
                            "deliveryTotal": "$rating.deliveryTotal",
                            "responsivenessTotal": "$rating.responsivenessTotal",
                            "qualityTotal": "$rating.qualityTotal",
                            "summaryTotal": "$rating.summaryTotal",
                            "deliveryAverage": "$rating.deliveryAverage",
                            "responsivenessAverage": "$rating.responsivenessAverage",
                            "qualityAverage": "$rating.qualityAverage",
                            "summaryAverage": "$rating.summaryAverage"
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "ratingDO": "$ratingDO"
                    }
                }
            ],
            as: "do"
        }
    },
    {
        $unwind: "$do"
    },
    {
        $project: {
            _id: 0,
            "PENYEDIA": "$supplierName",
            "NO_KONTRAK": "$noKontrak",
            "NO_PO_AMS": "$po.nopoAms",
            "NO_PO_SAP": {
                $ifNull: ["$po.noPoSAP", "n/a"]
            },
            "NO_PO_SMAR": {
                $ifNull: ["$po._id", "n/a"]
            },
            "NO_DO_SMAR": {
                $ifNull: ["$do._id", "n/a"]
            },
            "KATEGORI_LEVEL_1": {
                $ifNull: ["$categoryName", "n/a"],
                
            },
            "KATEGORI_LEVEL_4": {
                $ifNull: ["$po.details.categoryName", "n/a"]
            },
            "RATING_PO": {
                $ifNull: ["$po.ratingPO", "n/a"]
            },
            "RATING_DO": {
                $ifNull: ["$do.ratingDO", "n/a"]
            }
        }
    }
])