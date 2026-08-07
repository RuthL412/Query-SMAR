db.t_purchase_order.aggregate([
    {
        $match: {
            _id: {
                $in: [
								"PO202500000454",
"PO202500003372",
"PO202500003370",
"PO202500003367",
"PO202500003365",
"PO202500003363",
"PO202500003361",
"PO202500003091",
"PO202500003089",
"PO202500003087",
"PO202500002678",
"PO202500002677",
"PO202500003090",

								]
            }
        }
    },
    {
        $project: {
            _id: "$_id",
						status:"$status",
            noOA: "$noOA",
            "noPoSAP Lama": "$noPoSAP",
            "QUERY BACKUP": {
                $concat: [
                    "db.t_purchase_order.find({_id:'",
                    "$_id",
                    "'});"
                ]
            },
						"QUERY UPDATE": {
                $concat: [
                    "db.t_purchase_order.updateOne({_id:'",
                    "$_id",
                    "'},{$set:{noOA:'","$noOA","'}});"
                ]
            },
        }
    },
		{$sort:{status:1}}
])