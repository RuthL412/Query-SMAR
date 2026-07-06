db.m_new_alokasi_bulanan_kontrak_unit.aggregate([
        {
            $match: {
//        supplierName: "PT Hexing Technology",
//buyerName: "UID Jawa Tengah & DIY",
noAlokasi: "NAB20250411-161503"
//                
            }
        },
    {
        $unwind: "$listBreakdown"
    },
    {
        $group: {
            _id: {
						_id:"$_id",
                "noAlokasi": "$noAlokasi",
                "supplierId": "$supplierId",
                "supplierName": "$supplierName",
                "buyerId": "$buyerId",
                "buyerName": "$buyerName",
                "quota": "$quota",
                "reservedQuota": "$reservedQuota",
                "availableQuota": "$availableQuota",
                "realisasi": "$realisasi",
                "sumQuota": "$sumQuota",
                
            },
            quotaDalam: {
                $sum: "$listBreakdown.quota"
            },
            realisasiDalam: {
                $sum: "$listBreakdown.realisasi"
            },
            reservedQuotaDalam: {
                $sum: "$listBreakdown.reservedQuota"
            },
            availableQuotaDalam: {
                $sum: "$listBreakdown.availableQuota"
            },
            sumQuotaDalam: {
                $sum: "$listBreakdown.sumQuota"
            },
            
        }
    },
    {
        $project: {
				_id:"$_id._id",
            "noAlokasi": "$_id.noAlokasi",
            "supplierId": "$_id.supplierId",
            "supplierName": "$_id.supplierName",
            "buyerId": "$_id.buyerId",
            "buyerName": "$_id.buyerName",
            "quota": "$_id.quota",
            "reservedQuota": "$_id.reservedQuota",
            "availableQuota": "$_id.availableQuota",
            "realisasi": "$_id.realisasi",
            "sumQuota": "$_id.sumQuota",
            quotaDalam: "$quotaDalam",
            reservedQuotaDalam: "$reservedQuotaDalam",
            availableQuotaDalam: "$availableQuotaDalam",
            sumQuotaDalam: "$sumQuotaDalam",
            "Hasil quota": {
                $cond: {
                    if : {
                        $and: [{
                            $eq: ["$_id.quota", "$quotaDalam"]
                        }]
                    },
                    then: "SESUAI",
                    else : "TIDAK SESUAI",
                    
                }
            },
            "Hasil sumQuota": {
                $cond: {
                    if : {
                        $and: [{
                            $eq: ["$_id.sumQuota", "$sumQuotaDalam"]
                        }]
                    },
                    then: "SESUAI",
                    else : "TIDAK SESUAI",
                    
                }
            },
            "Hasil realisasi": {
                $cond: {
                    if : {
                        $and: [{
                            $eq: ["$_id.realisasi", "$realisasiDalam"]
                        }]
                    },
                    then: "SESUAI",
                    else : "TIDAK SESUAI",
                    
                }
            },
            "Hasil availableQuota": {
                $cond: {
                    if : {
                        $and: [{
                            $eq: ["$_id.availableQuota", "$availableQuotaDalam"]
                        }]
                    },
                    then: "SESUAI",
                    else : "TIDAK SESUAI",
                    
                }
            },
            "Hasil reservedQuota": {
                $cond: {
                    if : {
                        $and: [{
                            $eq: ["$_id.reservedQuota", "$reservedQuotaDalam"]
                        }]
                    },
                    then: "SESUAI",
                    else : "TIDAK SESUAI",
                    
                }
            },
            
        }
    },
//		{
//		$match:{
//		"Hasil reservedQuota": "TIDAK SESUAI"
//		}
//		},
    {
        $sort: {
            "Hasil quota":  - 1,
            "Hasil sumQuota":  - 1,
            "Hasil realisasi":  - 1,
            "Hasil availableQuota":  - 1,
            "Hasil reservedQuota":  - 1,
            
        }
    }
])