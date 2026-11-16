db.t_purchase_order.aggregate([
    {
        $match: {
            digiSignResBuyer: {
                $exists: true
            },
            "digiSignStatus": {
                $nin: ["OFF"]
            },
            
        }
    },
    {
        $unwind: "$digiSignResBuyer.sign"
    },
    {
        $group: {
            _id: {
                prifyId: "$digiSignResBuyer.sign.id_user",
                email: "$digiSignResBuyer.sign.email",
                
            }
        }
    },
    {
        $project: {
            _id: 0,
            email: "$_id.email",
            prifyId: "$_id.prifyId",
            
        }
    },
    {
        $lookup: {
            from: "sys_auth_user",
            let: {
                imel: "$email"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$email", "$$imel"]
                        }
                    }
                },
                {
                    $project: {
                        companyName: "$companyName",
                        name: "$fullName",
                        roles: {
                            $arrayElemAt: ["$roles", 1]
                        },
                        
                    }
                }
            ],
            as: "user"
        }
    },
    {
        $unwind: {path:"$user",
				preserveNullAndEmptyArrays: true}
    },
    {
        $project: {
            name: "$user.name",
            company: "$user.companyName",
            role: "$user.roles",
            email: "$email",
            prifyId: "$prifyId",
            
        }
    }
])

// "digiSignResBuyer": {
//         "ref_id": "awlBIJbiCjBN6D0N",
//         "sign": [
//             {
//                 "id_user": "dpue9189",
//                 "email": "deri.prasetio@pln.co.id",
//                 "url": "https://dcid.io/8d653bef18"
//             }
//         ],
//         "stamp": [ ],
//         "id": "3e66950aad5234429fd34ced6d18e98f"
//     },


// db.m_archived_user.find({email:"setiyawan@pln.co.id"})