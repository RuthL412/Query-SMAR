db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
            noKontrak: "1973.Pj/DAN.01.01/F01020000/2024",
            latest: true
        }
    },
    {
        $unwind: "$materials"
    },
    {
        $project: {
            _id: 0,
            noKontrak: "$noKontrak",
            supplierId: "$supplierId",
            supplierName: "$supplierName",
            skuKontrak: "$materials.skuId",
            skuName: "$materials.skuName",
            
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_kontrak",
            let: {
                nomorKontrak: "$noKontrak",
                skuId: "$skuKontrak"
            },
            pipeline: [
                {
                    $unwind: "$listSKU"
                },
                {
                    $unwind: "$details"
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$listSKU.noSku", "$$skuId"]
                                },
                                {
                                    $eq: ["$details.noKontrak", "$$nomorKontrak"]
                                },
                                
                            ]
                        }
                    },
                    
                },
                {
                    $project: {
                        _id: 0,
                        supplierId: "$supplierId",
                        supplierName: "$supplierName",
                        noAlokasi: {
                            $cond: {
                                if : {
                                    $ifNull: ["$_id", false]
                                },
                                then: "$_id",
                                else : "kosong",
                                
                            },
                            
                        },
                        
                    },
                    
                },
                
            ],
            as: "bulanan"
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak",
            let: {
                nomorKontrak: "$noKontrak",
                skuId: "$skuKontrak"
            },
            pipeline: [
                {
                    $unwind: "$listSKU"
                },
                {
                    $unwind: "$details"
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$listSKU.noSku", "$$skuId"]
                                },
                                {
                                    $eq: ["$details.noKontrak", "$$nomorKontrak"]
                                },
                                
                            ]
                        }
                    },
                    
                },
                {
                    $project: {
                        _id: 0,
                        noAlokasi: {
                            $cond: {
                                if : {
                                    $ifNull: ["$_id", false]
                                },
                                then: "$_id",
                                else : "kosong",
                                
                            },
                            
                        },
                        
                    },
                    
                },
                
            ],
            as: "in-ex"
        }
    },
    {
        $lookup: {
            from: "m_alokasi_kontrak",
            let: {
                nomorKontrak: "$noKontrak",
                skuId: "$skuKontrak"
            },
            pipeline: [
                {
                    $unwind: "$listSKU"
                },
                {
                    $unwind: "$details"
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$listSKU.noSku", "$$skuId"]
                                },
                                {
                                    $eq: ["$details.noKontrak", "$$nomorKontrak"]
                                },
                                
                            ]
                        }
                    },
                    
                },
                {
                    $project: {
                        _id: 0,
                        noAlokasi: {
                            $cond: {
                                if : {
                                    $ifNull: ["$_id", false]
                                },
                                then: "$_id",
                                else : ["kosong"],
                                
                            },
                            
                        },
                        
                    },
                    
                },
                
            ],
            as: "khs"
        }
    },
    {
        $addFields: {
            allResults: {
                $concatArrays: ["$in-ex", "$bulanan", "$khs"]
            }
        }
    },
    //{$unwind:"$allResults"},
    {
        $project: {
            noKontrak: "$noKontrak",
            skuKontrak: "$skuKontrak",
            skuName: "$skuName",
            supplierId: "$supplierId",
            supplierName: "$supplierName",
            nomorAlokasi: "$allResults"
        }
    },
    {
        $lookup: {
            from: "t_purchase_order",
            let: {
                nomorAlokasi: "$nomorAlokasi",
                supplierIdd: "$supplierId",
                supplierNamee: "$supplierName",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $gt: [
                                        {
                                            $size: {
                                                $filter: {
                                                    input: "$details",
                                                    as: "d",
                                                    cond: {
                                                        $in: [
                                                            "$$d.noAlokasi",
                                                            {
                                                                $map: {
                                                                    input: "$$nomorAlokasi",
                                                                    as: "alok",
                                                                    in: "$$alok.noAlokasi"
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        },
                                        0
                                    ]
                                },
                                {
                                    $eq: ["$supplierId", "$$supplierIdd"]
                                },
                                {
                                    $in: ["$status", [
                                        //                                        "APPROVED_GM",
                                        //                                        "APPROVED_MSB",
                                        //                                        "APPROVED_SRM",
                                        "APPROVED_SUPPLIER",
                                        //                                        "CREATED",
                                        //                                        "DRAFT",
                                        "FINISHED",
                                        "PROCESSED_BABG",
                                        "PROCESSED_SUPPLIER",
                                        "RECEIVED",
                                        "REQUESTED",
                                        //                                        "REQUESTED_DIGISIGN_GM",
                                        "REQUESTED_DIGISIGN_SUPPLIER"
                                    ]]
                                }
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
                //								{
                //                    $match: {
                //                        $expr: {
                //                            $and: [{
                //                                $eq: ["$_id.noAlokasi", "$$nomorAlokasi"]
                //                            }]
                //                        }
                //                    }
                //                },
                {
                    $project: {
                        _id: 0,
                        "supplierId": "$_id.supplierId",
                        "supplierName": "$_id.supplierName",
                        "buyerId": "$_id.buyerId",
                        "buyerName": "$_id.buyerName",
                        noAlokasi: "$_id.noAlokasi",
                        qty: "$qty",
                        
                    }
                },
                {
                    $match: {
                        $expr: {
//                            $and: [{
                                $in: ["$noAlokasi", "$$nomorAlokasi.noAlokasi"]
//                            },]
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            _id: "$supplierName",
                            //								_id:"$noAlokasi",
//                            nomoerAlokasi: "$noAlokasi"
                        },
                        qty: {
                            $sum: "$qty"
                        }
                    }
                },
								{$project:{
								_id:0,
								supplierName:"$_id._id",
								nomorAlokasi:"$_id.nomoerAlokasi",
								cek:"$$nomorAlokasi.noAlokasi",
								qty:"$qty"
								}},
								
            ],
            as: "PO"
        }
    },
    {
        $unwind: "$PO"
    },
    {
        $project: {
            noKontrak: "$noKontrak",
            skuKontrak: "$skuKontrak",
            skuName: "$skuName",
            supplierId: "$supplierId",
            supplierName: "$supplierName",
            nomorAlokasi: "$nomorAlokasi",
            realisasi: "$PO.qty",
//            PO: "$PO",
            
        }
    },
    
])

//db.m_kontrak_pengadaan.find()
//db.m_new_alokasi_kontrak.find()