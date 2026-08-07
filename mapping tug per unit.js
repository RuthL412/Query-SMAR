db.t_delivery_order.aggregate([
    {
        $match: {
            
            buyerId: "pln_kw_uiw_suluttenggo",
            createdDate: {
                $gte: ISODate("2024-12-31T17:00:00.00Z"),
                
            },
						"digiSignStatus": {$nin:["OFF"]},
        }
    },
    {
        $unwind: "$detail"
    },
    {
        $group: {
            _id: {
                do: "$_id",
                buyerName: "$buyerName",
                up3: "$unitName",
                penyedia: "$supplierName",
                status: "$status",
                statusDalam: "$detail.status",
                skuId: "$detail.sku",
                skuName: "$detail.skuName",
                createdDate: "$createdDate",
                productId: "$detail.itemId",
                tanggalDiterima: {
                    //                    $concat: ["TUG 3 Persediaan - ", {
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.tanggalDiterima", false]
                        },
                        then: "$detail.tanggalDiterima",
                        else : 0,
                        
                    }
                },
                lastApproveDigisignTug3Karantina: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.lastApproveDigisignTug3Karantina", false]
                        },
                        then: "$detail.lastApproveDigisignTug3Karantina",
                        else : 0,
                        
                    }
                },
                lastApproveDigisignTug3Persediaan: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.lastApproveDigisignTug3Persediaan", false]
                        },
                        then: "$detail.lastApproveDigisignTug3Persediaan",
                        else : 0
                    }
                },
                lastApproveDigisignTug4Pemeriksaan: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.lastApproveDigisignTug4Pemeriksaan", false]
                        },
                        then: "$detail.lastApproveDigisignTug4Pemeriksaan",
                        else : 0
                    }
                },
                
            }
        }
    },
    {
        $project: {
            _id: 0,
            do: "$_id.do",
            "Unit Induk": "$_id.buyerName",
            "Up3": "$_id.up3",
            "Penyedia": "$_id.penyedia",
            "Status DO": "$_id.status",
            "Status per Material": "$_id.statusDalam",
						           "Tanggal DO": {
                
                $cond: {
                    
                    if : {
                        $ifNull: ["$_id.createdDate", false]
                    },
                    then: {
                        $add: ["$_id.createdDate", 7 * 60 * 60 * 1000] // +7 jam
                    },
                    else : "-",
                    
                }
            },
            SKU: "$_id.skuId"	,
            "Nama Material": "$_id.skuName",
            "Tanggal Diterima": {
                
                $cond: {
                    
                    if : {
                        $ifNull: ["$_id.tanggalDiterima", false]
                    },
                    then: {
                        $add: ["$_id.tanggalDiterima", 7 * 60 * 60 * 1000] // +7 jam
                    },
                    else : "-",
                    
                }
            },
						"TGL DigiSign Complete TUG 3 Persediaan": {
                
                $cond: {
                    
                    if : {
                        $ifNull: ["$_id.lastApproveDigisignTug3Persediaan", false]
                    },
                    then: {
                        $add: ["$_id.lastApproveDigisignTug3Persediaan", 7 * 60 * 60 * 1000] // +7 jam
                    },
                    else : "-",
                    
                }
            },
            "TGL DigiSign Complete TUG 3 Karantina": {
                
                $cond: {
                    
                    if : {
                        $ifNull: ["$_id.lastApproveDigisignTug3Karantina", false]
                    },
                    then: {
                        $add: ["$_id.lastApproveDigisignTug3Karantina", 7 * 60 * 60 * 1000] // +7 jam
                    },
                    else : "-",
                    
                }
            },
            "TGL DigiSign Complete TUG 4": {
                
                $cond: {
                    
                    if : {
                        $ifNull: ["$_id.lastApproveDigisignTug4Pemeriksaan", false]
                    },
                    then: {
                        $add: ["$_id.lastApproveDigisignTug4Pemeriksaan", 7 * 60 * 60 * 1000] // +7 jam
                    },
                    else : "-",
                    
                }
            },
            
        }
    },
		{$sort:{"Tanggal DO":1}},
//    {
//        $match: {
//            "Tanggal Diterima": {
//                $lte: ISODate("2025-10-31T00:00:00.000Z")
//            },
//            
//        }
//    }
]);
