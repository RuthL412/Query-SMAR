db.t_delivery_order.aggregate([
    {
        $match: {
            _created: {
                $gte: ISODate("2025-12-31T16:59:59.999Z"),
                $lte: ISODate("2026-04-30T16:59:59.999Z")
                //                 $gte: ISODate("2024-10-31T16:59:59.000Z"),
                //                 $lte: ISODate("2025-12-31T16:59:59.000Z")
            },
            digiSignStatus: {
                $in: ["INTERNAL", "EKSTERNAL"]
            },
            
        }
    },
    {
        $unwind: "$detail"
    },
    {
        $group: {
            _id: {
                do: "$_id",
                nopo: "$nopo",
                _created: "$_created",
                status: "$status",
                noGrSAP: {
                    $ifNull: ["$detail.noGrSAP", "-"]
                },
                sku: "$detail.skuName",
                skuName: "$detail.skuName",
                statuspermaterial: "$detail.status",
                lastApproveDigisignTug3Karantina: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.lastApproveDigisignTug3Karantina", false]
                        },
                        then: "TUG 3 Karantina",
                        else : 0,
                        
                    }
                },
                lastApproveDigisignTug3Persediaan: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.lastApproveDigisignTug3Persediaan", false]
                        },
                        then: "TUG 3 Persediaan",
                        else : 0
                    }
                },
                lastApproveDigisignTug4Pemeriksaan: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.lastApproveDigisignTug4Pemeriksaan", false]
                        },
                        then: "TUG 4",
                        else : 0
                    }
                },
                
            }
        }
    },
    {
        $project: {
            _id: 0,
            nopo: "$_id.nopo",
            do: "$_id.do",
            status: "$_id.status",
            noGrSAP: "$_id.noGrSAP",
            statuspermaterial: "$_id.statuspermaterial",
            tglDO: {
                $dateToString: {
                    format: "%d-%m-%Y",
                    date: {
                        $add: ["$_id._created", 7 * 60 * 60 * 1000]
                    },
                    
                }
            },
            sku: "$_id.skuName",
            jenisDokumen: [
                "$_id.lastApproveDigisignTug3Persediaan",
                "$_id.lastApproveDigisignTug3Karantina",
                "$_id.lastApproveDigisignTug4Pemeriksaan",
                
            ],
            
        }
    },
    {
        $unwind: "$jenisDokumen"
    },
    {
        $project: {
            "do": "$do",
            "nopo": "$nopo",
            "sku": "$sku",
            "status do": "$status",
            "status per material": "$statuspermaterial",
            "noGrSAP": "$noGrSAP",
            "created": "$tglDO",
            "jenisDokumen": "$jenisDokumen",
            
        }
    },
		{
		$match:{
		jenisDokumen:{$nin:[0]},
// 		jenisDokumen:"TUG 3 Karantina"
		}
		}
]);
