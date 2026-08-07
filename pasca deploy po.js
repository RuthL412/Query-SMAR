db.t_purchase_order.aggregate([
    {
        $project: {
            _id: 0,
            "No PO PLN MP": "$_id",
            "No AMS": "$nopoAms",
            "Tanggal PO dibuat	":{
                $add: ["$createdDate", 7 * 60 * 60 * 1000]
            },
            "Tanggal PO dikirim": {
                
                $cond: {
                    if : {
                       $ifNull: ["$poSendSupplierDate", false]
                    },
                    then: {
                        $add: ["$poSendSupplierDate", 7 * 60 * 60 * 1000]
                    },
                    else : "-",
                    
                }
            },
            "Unit Induk": "$buyerName",
						Bidang:"$srmSubBidang",
						"Kategori":"$categoryName",
						"_created":"$_created"
            
        }
    },
    {
        $sort: {
//            "No PO PLN MP": - 1
            "_created": - 1
        }
    }
])

//db.t_purchase_order.find().sort({
//    _created:  - 1
//})