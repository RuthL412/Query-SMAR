db.m_ust_request_elab.find()


db.m_ust_request_elab_summary.aggregate([
    {
        $lookup: {
            from: "m_ust_request_elab",
            let: {
                sku: "$sku",
                noKontrak: "$noKontrak",
                categoryLv1Id: "$categoryLv1Id",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$sku", "$$sku"]
                            }, {
                                $eq: ["$noKontrak", "$$noKontrak"]
                            }]
                        }
                    }
                }
            ],
            as: "ust"
        }
    },
    {
        $project: {
            totalProses: 1,
            ust: 1,
            size: {
                $size: "$ust"
            },
            keterangan: {
                $cond: {
                    if : {
                        $eq: ["$totalProses", {
                            $arrayElemAt: ["$ust.ustKe", - 1]
                        }]
                    },
                    then: "AMAN",
                    else : "Perlu dicek"
                }
            }
        }
    },
		{$sort:{keterangan:-1}},
]);