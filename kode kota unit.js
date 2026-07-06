db.m_unit.aggregate([
{
        $lookup: {
            from: "m_company",
            let: {
                companyId: "$companyId",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$companyId"]
                            },]
                        }
                    }
                },
                {
                    $project: {
                        companyName: "$companyName",
                        companyCode: "$companyCode",
                        
                    }
                }
            ],
            as: "UID",
            
        },
        
    },
		{$unwind:"$UID"},
		{$project:{
		_id:0,
		"Unit Induk":"$companyName",
		"Company Code":"$UID.companyCode",
		"UP3":"$unitName",
		"Plant Code":"$plantCode",
		"Kota":"$cityName",
		"Kode Kota":"$cityId",
		
		}}
])