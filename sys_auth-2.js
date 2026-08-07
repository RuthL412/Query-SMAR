db.m_company.aggregate([
    {
        $match: {
            "level": "BUYER",
            
        }
    },
    {
        $lookup: 
        {
            from: "sys_auth_user",
            let: {
                companyId2: "$_id"
            },
            //            localField: "_id",
            //            foreignField: "companyId",
            
            pipeline: [
                {
                    $match: {
//                        status: "ACTIVATED",
                        status: "DISABLED",
                        $expr: {
                            $and: [{
                                $eq: ["$companyId", "$$companyId2"]
                            }]
                        }
                    },
                    
                },
                {
                    $group: {
                        _id: "$$companyId2",
                        total: {
                            $sum: 1
                        },
												total: {
                            $sum: 1
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: "$total",
                        
                    }
                },
                
            ],
            as: "users",
            
        }
    },
    {
        $unwind: "$users"
    },
    {
        $project: {
            _id: 0,
            companyCode: "$companyCode",
            companyName: "$companyName",
            users: "$users.total",
        }
    },
    {
        $sort: {
            companyCode: -1
        }
    }
])

//db.sys_auth_s.find()