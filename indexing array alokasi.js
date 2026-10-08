db.m_new_alokasi_bulanan_kontrak.aggregate([
    {
        $match: {
            _id: {
                $in: [
                    "NAB20250411-161503"
                ]
            }
        }
    },
    {
        $unwind: {
            path: "$details",
            //             includeArrayIndex: "indexDetail" // <= menambahkan indeks
        }
    },
    {
        $unwind: "$listSKU"
    },
    {
        $group: {
            _id: {
                noAlokasi: "$_id",
                startDate: "$startDate",
                endDate: "$endDate",
                //                 supplierName: "$details.supplierName",
                noSku: "$listSKU.noSku",
                //                 totalRealisasi: "$details.totalRealisasi",
                //                 noKontrak: "$details.noKontrak",
                //                 index: "$indexDetail" // <= tambahkan indeks ke _id grup
            }
        }
    },
    {
        $project: {
            _id: 0,
            noAlokasi: "$_id.noAlokasi",
            startDate: "$_id.startDate",
            endDate: "$_id.endDate",
            supplierName: "$_id.supplierName",
            noSku: "$_id.noSku",
            totalRealisasi: "$_id.totalRealisasi",
            noKontrak: "$_id.noKontrak",
            index: "$_id.index" // <= tampilkan indeks
        }
    },
    {
        $lookup: {
            from: "m_product_sku",
            let: {
                sku: "$noSku"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$sku"]
                            }]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        noSap: 1,
                        satuanType: 1,
                        skuType: 1
                    }
                },
                
            ],
            as: "sku",
            
        }
    },
    {
        $unwind: "$sku"
    },
    {
        $project: {
            noAlokasi: "$noAlokasi",
            materialType: "$sku.skuType",
            materialNumber: "$sku.noSap",
            version: "1",
            UoM: "$sku.satuanType",
            startDate: {
                $dateToString: {
                    format: "%d-%m-%Y",
                    date: {
                        $add: ["$startDate", 7 * 60 * 60 * 1000]
                    }
                }
            },
            endDate: {
                $dateToString: {
                    format: "%d-%m-%Y",
                    date: {
                        $add: ["$endDate", 7 * 60 * 60 * 1000]
                    }
                }
            },
						allocationType:"P"
						}},
            {
                $sort: {
                    noAlokasi: 1,
                    index: 1
                }
            }])