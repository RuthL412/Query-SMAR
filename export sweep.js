db.m_sweep_alokasi_kontrak_bulanan.aggregate([
    {
        $unwind: "$listSKU"
    },
    {
        $group: {
            _id: {
                "noAlokasi": "$noAlokasi",
                "categoryLv1Name": "$categoryLv1Name",
                "namaSku": "$listSKU.namaSku",
                "buyerName": "$buyerName",
                "bulan": "$bulan",
                "buyerId": "$buyerId",
                "supplierId": "$supplierId",
                "supplierName": "$supplierName",
                "alokasiAwal": "$alokasiAwal",
                "sweepingAlokasi": "$sweepingAlokasi",
                
            }
        }
    },
    {
        $project: {
            _id: 0,
            "noAlokasi": "$_id.noAlokasi",
            "categoryLv1Name": "$_id.categoryLv1Name",
            "namaSku": "$_id.namaSku",
            "buyerName": "$_id.buyerName",
            "bulan": "$_id.bulan",
            "buyerId": "$_id.buyerId",
            "supplierId": "$_id.supplierId",
            "supplierName": "$_id.supplierName",
            "alokasiAwal": "$_id.alokasiAwal",
            "sweepingAlokasi": "$_id.sweepingAlokasi",
            
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak_unit",
            let: {
                alokasi: "$noAlokasi",
                buyer: "$buyerId",
                supplier: "$supplierId",
                bulann: "$bulan",
                
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
                    $unwind: "$listBreakdown"
                },
                {
                    $project: {
                        _id: 0,
                        listBreakdown: 1
                    }
                },
                {
                    $match: {
                        
												$expr: {
                            $and: [{
                                $eq: ["$listBreakdown.bulan", "$$bulann"]
                            }]
                        }
                    }
                },
                //								{$unwind:"$listBreakdown"},
                {
                    $project: {
                        reservedQuota: "$listBreakdown.reservedQuota",
												bulan:"$$bulann"
                    }
                },
                
            ],
            as: "perbuan"
        }
    },
    {
        $unwind: "$perbuan"
        
    },
    {
        $project: {
//            _id: 0,
            "Nomor Alokasi": "$noAlokasi",
            "Kategori": "$categoryLv1Name",
            "Variant": "$namaSku",
            "Bulan": "$bulan",
            "Unit": "$buyerName",
            //            "buyerId": "$buyerId",
            //            "supplierId": "$supplierId",
            "Penyedia": "$supplierName",
            "Alokasi Awal": "$alokasiAwal",
            "Stok Reserved": "$perbuan.reservedQuota",
            "SweepingAlokasi": "$sweepingAlokasi",
        }
    },
    
])
//db.m_new_alokasi_bulanan_kontrak_unit.find({}).limit(1)
//db.m_sweep_alokasi_kontrak_bulanan.find().limit(1)