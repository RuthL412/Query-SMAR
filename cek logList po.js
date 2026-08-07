db.t_purchase_order.aggregate([
    {
        $match: {
//            "details.noAlokasi": /NAB/i,
//            status: /sys/i,
						_id:{$in:[
"PO202500002600",
"PO202500002667",
"PO202500002665",
"PO202500002607",
						]}
        }
    },
    {
        $project: {
            log: {
                $arrayElemAt:["$purchaseOrderLogList",-1]
            }
        }
    },
		{$unwind:"$log"},
		{$project:{
		status:"$log.status",
		createdDate:"$log.createdDate"
		}}
])

db.m_new_alokasi_bulanan_kontrak.find({})