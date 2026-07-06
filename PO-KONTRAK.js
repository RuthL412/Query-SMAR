db.t_purchase_order.aggregate([
    {
        $match: {
            _id: {
                $in: ["PO202400007842"]
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
                unitName: "$details.unitName",
                skuName: "$details.skuName",
                noAlokasi: "$details.noAlokasi"
            }
        }
    },
    {
        $project: {
            _id: "$_id._id",
            unitName: "$_id.unitName",
            skuName: "$_id.skuName",
            noAlokasi: "$_id.noAlokasi"
        }
    },
    {
        $lookup: {
				from: "m_new_alokasi_kontrak",
            let: {
                alokasi: "$noAlokasi",
                supplier: "$supplierId",
                
            },
				}
    },
    
])

db.m_kontrak_pengadaan.find({noKontrak:/0015/i})