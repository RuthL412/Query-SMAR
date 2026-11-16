db.sys_auth_user.aggregate([
    {
        $match: {
            status: "ACTIVATED",
            "companyLevel": "BUYER",
            
        }
    },
    {
        $lookup: 
        {
            from: "m_company",
            localField: "companyId",
            foreignField: "_id",
            as: "company"
        }
    },
    {
        $unwind: "$company"
    },
    {
        $project: {
            _id: 0,
						username:"$username",
						email:"$email",
						nip:"$nip",
           roles: {$arrayElemAt:["$roles",1]},
            fullName: "$fullName",
            companyCode: "$company.companyCode",
            companyName: "$companyName",
            status: "$status"
        }
    },
    {
        $sort: {
            companyName: 1,
						roles:1
        }
    }
])