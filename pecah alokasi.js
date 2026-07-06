

db.m_new_alokasi_bulanan_kontrak.aggregate([
    {
        $match: {
          _id:"NAB20250411-161503"
        }
    },
    {
        $unwind: {
            path: "$details",
            includeArrayIndex: "arrayIndex"
        }
    },
    {
        $project: {
            _id: 1,
            supplierName: 1,
            "supplierName": "$details.supplierName",
            "totalRealisasi": "$details.totalRealisasi",
            arrayIndex: 1
        }
    }
])

//db.m_new_alokasi_bulanan_kontrak.find({_id:"NAB20250417-172608"})