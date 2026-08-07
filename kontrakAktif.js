db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
            "status": "AKTIF",
            "latest": true
        }
    },
    {
        $unwind: "$materials"
    },
    {
        $group: {
            _id: "$materials.productId", // Kelompokkan berdasarkan productId
            noKontrak: { $push: "$noKontrak" } // Buat array noKontrak
        }
    },
    {
        $project: {
            _id: 0, // Hilangkan field _id default
            productId: "$_id", // Beri nama ulang _id menjadi productId
            noKontrak: 1 // Tetap sertakan array noKontrak
        }
    },
    {
        $addFields: {
            countNoKontrak: { $size: "$noKontrak" } // Hitung panjang array noKontrak
        }
    },
    {
        $sort: {
            countNoKontrak: -1, // Urutkan berdasarkan panjang array noKontrak secara descending
            productId: 1 // Jika panjang sama, urutkan berdasarkan productId secara ascending
        }
    },
//    {
//        $project: {
//            countNoKontrak: 0 // Hilangkan field countNoKontrak dari output akhir
//        }
//    }
])
