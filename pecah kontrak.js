db.sap_outline_agreement.find({agreementNo:"4500186781"})

db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
            noKontrak: '1818.PJ/DAN.01.01/F01020000/2024',
            _id: 1377
        }
    },
    {
        $unwind: {
            path: "$materials",
            includeArrayIndex: "arrayIndex"
        }
    },
    {
        $project: {
            _id: 1,
            supplierName: 1,
            "Nama Produk": "$materials.productName",
            "Jumlah Supply": "$materials.jumlahSuplai",
            arrayIndex: 1
        }
    }
])