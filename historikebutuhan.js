db.t_history_kebutuhan_material_up3.aggregate([
    {
        $match: {
            "buyerName": {
                $in: ["PLN UID Jawa Timur", /s2jb/i]
            },
            "categoryLv1Name": "CUBICLE",
            "tahun": NumberLong("2024"),
            bulan: {
                $in: [
                    6,
                    7,
                    8
                ]
            }
        }
    },
    {
        $lookup: {
            from: "sys_auth_user",
            let: {
                userId: "$_updatedBy"
            },
            //            localField: "_updatedBy",
            //            foreignField: "_id",
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$userId"]
                            }]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        fullName: 1,
                        email: 1
                    }
                }
            ],
            as: "user"
        }
    },
    {
        $unwind: "$user"
    },
    {
        $project: {
            _id: 0,
            Company: "$buyerName",
            Category: "$categoryLv1Name",
            sku: "$sku",
            skuName: "$skuName",
            bulan: "$bulan",
						status:"$status",
            ApprovedBy: "$user.fullName",
            email: "$user.email",
            approval: "$_updated"
        }
    }
]);