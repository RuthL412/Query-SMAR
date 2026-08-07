db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
            "materials.categoryName": {
                $in: [
                    'KWH METER',
                    'MCB',
                    'TIANG',
                    'TRAFO DISTRIBUSI',
                    'PHBTR',
                    'LBS',
                    'CUBICLE',
                    'LIGHTNING ARRESTER',
                    'FUSE CUT OUT (FCO)',
                    'ISOLATOR',
                    'CT',
                                'PT'
                ]
            },
            status: "AKTIF"
        }
    },
    {
        $unwind: "$materials"
    },
    {
        $group: {
            _id: {
                _id: "$materials.skuId",
                skuName: "$materials.skuName",
                contractPrice: "$materials.contractPrice",
                noKontrak: "$noKontrak",
                supplierName: "$supplierName"
            }
        }
    },
    {
        $project: {
            _id: "$_id._id",
            skuName: "$_id.skuName",
            contractPrice: {
                
                $cond: {
                    if : {
                        $ifNull: ["$_id.contractPrice", false]
                    },
                    then: "$_id.contractPrice",
                    else : 0,
                    
                }
            },
            //contractPrice: "$_id.contractPrice",
                noKontrak: "$_id.noKontrak",
            supplierName: "$_id.supplierName"
        }
    }
])

//db.m_kontrak_pengadaan.find({}).sort({_created:-1})