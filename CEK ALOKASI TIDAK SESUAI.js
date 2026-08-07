db.t_purchase_order.aggregate([
    {
        $match: {
            
            "details.noAlokasi": {
<<<<<<< HEAD
                $in: ["NAB20260119-100127"]
=======
                $in: ["NAB20260119-171604"]
>>>>>>> 89c032333b865a2cb51c4be254c7c9bb754d8298
            },
//             "supplierName": /PT TRIPUTRA ELECTRIC ABADI/i,
            
        }
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
                trxType: "$trxType",
                noAlokasi: "$details.noAlokasi",
                slaVW: "$details.slaVW",
                status: "$status",
                
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
                {
                    $addFields: {
                        bulan_sekarang: {
                            $month: "$$NOW"
                        }
                    }
                },
                {
                    $addFields: {
                        data_dibawah_bulan_sekarang: {
                            $filter: {
                                input: "$listBreakdown",
                                as: "item",
                                cond: {
                                    $lte: ["$$item.bulan", "$bulan_sekarang"]
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        total_qty: {
                            $sum: "$data_dibawah_bulan_sekarang.realisasi"
                        }
                    }
                },
                {
                    $project: {
                        noAlokasi: "$noAlokasi",
                        stockSiapPesan: "$total_qty",
                        quota: "$reservedQuota",
                        
                    }
                }
            ],
            as: "bulanan",
            
        },
        
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
                        stockSiapPesan: "$realisasi",
                        quota: "$reservedQuota",
                        
                    }
                }
            ],
            as: "inEx",
            
        },
        
    },
    {
        $addFields: {
            alokasiUnit: {
                $cond: {
                    if : {
                        $eq: ["$_id.trxType", "BULANAN"]
                    },
                    then: "$bulanan",
                    else : "$inEx"
                }
            }
        }
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
            noAlokasi: "$_id.noAlokasi",
            status: "$_id.status",
            qty: "$qty",
            realisasi: "$alokasiUnit.stockSiapPesan",
            reserved: "$alokasiUnit.quota",
            slaVW: "$_id.slaVW",
            
        }
    },
    {
        $match: {
<<<<<<< HEAD
            noAlokasi: "NAB20260119-100127",
=======
            noAlokasi: "NAB20260119-171604",
>>>>>>> 89c032333b865a2cb51c4be254c7c9bb754d8298
            		slaVW:false,
            status: {
                $nin: [/reject/i]
            }
        }
    },
    {
        $group: {
            _id: {
                noAlokasi: "$noAlokasi",
                supplierName: "$supplierName",
                buyerName: "$buyerName",
                realisasiAlokasi: "$realisasi",
                reservedAlokasi: "$reserved",
                
            },
            supplierName: {
                $first: "$supplierName"
            },
            buyerName: {
                $first: "$buyerName"
            },
            poList: {
                $push: {
                    noPO: "$_id",
                    status: "$status",
                    
                },
                
            },
            realisasi: {
                $sum: {
                    $cond: [
                        {
                            $in: [
                                "$status",
                                [
                                    "APPROVED_SUPPLIER",
                                    "FINISHED",
                                    "PROCESSED_BABG",
                                    "PROCESSED_SUPPLIER",
                                    "RECEIVED",
                                    "REQUESTED",
                                    "REQUESTED_DIGISIGN_SUPPLIER",
                                    
                                ],
                                
                            ],
                            
                        },
                        "$qty",
                        0,
                        
                    ],
                    
                },
                
            },
            reserved: {
                $sum: {
                    $cond: [
                        {
                            $in: [
                                "$status",
                                [
                                    "DRAFT",
                                    "CREATED",
                                    "APPROVED_GM",
                                    "APPROVED_MSB",
                                    "APPROVED_SRM",
                                    "REQUESTED_DIGISIGN_GM",
                                    "REQUESTED_DIGISIGN_SRM",
                                    
                                ],
                                
                            ],
                            
                        },
                        "$qty",
                        0,
                        
                    ],
                    
                },
                
            },
            
        },
        
    },
    {
        $project: {
            _id: 0,
            "noAlokasi": "$_id.noAlokasi",
            "supplierName": "$_id.supplierName",
            "buyerName": "$_id.buyerName",
//             "Nomor Alokasi": "$_id.noAlokasi",
//             "Penyedia": "$_id.supplierName",
//             "Unit": "$_id.buyerName",
            "Penyedia": "$_id.supplierName",
            "Unit": "$_id.buyerName",
            "Reserved dari PO": "$reserved",
            "Realisasi dari PO": "$realisasi",
            "Reserved dari Alokasi": "$_id.reservedAlokasi",
            "Realisasi dari Alokasi": "$_id.realisasiAlokasi",
            hasil: {
                $cond: {
                    if : {
                        $and: [
                            
                            {
                                $eq: [{
                                    $toLong: "$realisasi"
                                }, {
                                    $toLong: "$_id.realisasiAlokasi"
                                }]
                            },
                            {
                                $eq: [{
                                    $toLong: "$reserved"
                                }, {
                                    $toLong: "$_id.reservedAlokasi"
                                }]
                            }
                        ]
                    },
                    then: "MATCH",
                    else : "NOT MATCH"
                }
            },
            poList: 1,
            
        }
    },
    {
        $sort: {
            //            supplierName: 1,
            hasil: 1
        }
    }
])

