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
            companyCode: "$company.companyCode",
            companyName: "$companyName",
						nip:"$nip",
//            companyLevel: "$companyLevel",
            fullName: "$fullName",
            status: "$status"
        }
    },
    {
        $sort: {
            companyName: -1
        }
    }
])