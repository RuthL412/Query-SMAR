db.m_company.aggregate([
    {
        $match: {
            "level": "SUPPLIER"
        }
    },
    
    {
        $lookup: {
            from: "sys_auth_user",
            let: {
                pic: "$picPenerimaanId"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$pic"]
                            }]
                        }
                    }
                },
                {
                    $project: {
										_id:0,
                        fullName: {
                            $cond: {
                                if : {
                                    $ifNull: ["$fullName", false],
                                    
                                },
                                then: "$fullName",
                                else : "-"
                            }
                        },
                        
                    }
                }
            ],
            as: "pic"
        }
    },
//            {
//                    $unwind: "$pic"
//            },
    {
        $project: {
            _id: 0,
            "Nama Penyedia": "$companyName",
            Alamat: "$address",
            "Nama Direktur": "$directorName",
            "Email Direktur": "$directorEmail",
            "No SK Penunjukkan": "$skDireksi",
            "PIC TUG": {
                $cond: {
                    if: { $gt: [{ $size: "$pic" }, 0] }, 
                    then: "$pic.fullName",
                    else : "-"
                }
            },digiSignStatus: "$digiSignStatus", 
            
        }
    },
		{$unwind:"$PIC TUG"}
])