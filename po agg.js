db.t_purchase_order.aggregate([
    {
        $match: {
            supplierName: "PT MULYA UTAMA MANDIRI SENTOSA",
            "details.noAlokasi": "NA20230707-215027",
            status: {
                $in: ["REQUESTED", "APPROVED_SUPPLIER", "PROCESSED_BABG", "PROCESSED_SUPPLIER", "RECEIVED", "FINISHED"]
            }
        }
    },
    {
        $unwind: "$details"
    },
    {
        $group: {
            _id: {
                _id: "$_id",
                sku: "$details.sku",
                buyerName: "$buyerName",
                status: "$status"
            },
            qty: {
                $sum: "$details.qty"
            }
        }
    },
    {
        $group: {
            _id: {
                jmbt: "$_id.sku"
            },
            qty2: {
                $sum: "$qty"
            }
        }
    },
    {
        $project: {
            _id: 0,
            skuu: "$_id.jmbt",
            qty3: "$qty2"
        }
    },
    //{$project:{_id:"$_id._id",sku:"$_id.sku",buyerName:"$_id.buyerName",qty:"$qty",status:"$_id.status"}},
    {
        $sort: {
            skuu: 1
        }
    }
]);

db.t_purchase_order.find().sort({_id:-1})
//db.t_purchase_order.find({
//            supplierName: "PT MULYA UTAMA MANDIRI SENTOSA",
//            "details.noAlokasi": "NA20230707-215027",
//        },{status:1})

//db.m_new_alokasi_kontrak.find({_id:"NA20230707-215027"})