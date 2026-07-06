db.t_purchase_order.aggregate([
    {
        $match: {
            "skuType": {
                $nin: ["SUPPLY_ERECT"]
            },
            "details.qtyDiterimaSupplyErect": {
                $exists: true
            }
        }
    },
    {
        $lookup: {
            from: "t_delivery_order",
            let: {
               po: "$_id",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$nopo", "$$po"]
                            }]
                        },
												"detail.qtyTerimaSupplyErect":{$exists:true},
												"detail.status":"CREATED",
                    }
                },
                {
                    $project: {
										_id:0,
                        nodo: "$_id",
//												detail:1,
												"detail.qtyTerimaSupplyErect":1,
												"detail.status":1
                    }
                }
            ],
            as: "DO",
            
        }
    },
		{$project:{
		_id:1,
		DO:1,
		_created:1
		}},{$sort:{DO:-1}}
])