db.m_new_alokasi_kontrak.aggregate([
    {
        $match: {
//            "categoryLv1Id": "biz071",
//            "categoryLv1Name": "CUBICLE",
							_id:"NA20240126-102324"
        }
    },
    {
        $lookup: 
        {
            from: 't_purchase_order',
            let: {
                idAlokasi: "$_id"
            },
            //		 			 	localField: '_id',
            //		 			 	foreignField: 'noAlokasi',
            pipeline: [
                {
                    $unwind: "$details"
                },
                {
                    $match: { status:{$not:/reject/i},
                        $expr: {
                            $and: [{
                                $eq: ["$details.noAlokasi", "$$idAlokasi"]
                            }]
                        }
                    },
                    
                },
                {
                    $group: {
                        _id: {
                            po: "$_id",
                            _id: "$buyerName",
                            supplierName: "$supplierName",
                            noAlokasi: "$details.noAlokasi",
                            
                        },
                        qty: {
                            $sum: "$details.qty"
                        },
                        qtyDikirim: {
                            $sum: "$details.qtyDikirim"
                        },
                        qtyDiterima: {
                            $sum: "$details.qtyDiterima"
                        },
                        
                    }
                },
                {
                    $group: {
                        _id: {
                            _id: "$_id._id",
														supplierName: "$_id.supplierName",
                            noAlokasi: "$_id.noAlokasi",
                            
                        },
                        qty: {
                            $sum: "$qty"
                        },
                        qtyDikirim: {
                            $sum: "$qtyDikirim"
                        },
                        qtyDiterima: {
                            $sum: "$qtyDiterima"
                        },
                        
                    }
                }
            ],
            as: "detail"
        },
        
    },
    {
        $unwind: "$detail"
    },
    {
        $project: {
            _id: "$detail._id._id",
            supplierName: "$detail._id.supplierName",
            noAlokasi: "$detail._id.noAlokasi",
						"qtyPo":"$detail.qty",
						"qtyDikirim":"$detail.qtyDikirim",
						"qtyDiterima":"$detail.qtyDiterima",
        }
    },
//		{$sort:{""}}
])

