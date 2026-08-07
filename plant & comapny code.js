db.m_unit.aggregate([
    {
        $match: 
        {
            
            companyId: {
                $in: [
                    "pln_kw_uiw_ntt",
                    "pln_kw_uiw_ntb",
                    "c3bdb087-24e8-4a99-8c94-d8a012b5ca10",
                    "e930bb6c-e93a-4d3a-816e-f33a2110d027",
                    "48126f14-0c55-4a3c-9e9c-2bc602a062fd",
                    "8d3dddb5-50a0-4619-a9f9-fed4bb3c343f",
                    "cfe3323c-d025-45d2-87a8-901eb9f4352d",
                    "a684bb8d-1a4e-45b0-b4ef-ab10122c86b6",
                    
                ]
            }
        }
    },
        {
            $lookup: {
                from: "m_company",
                localField: "companyId",
                foreignField: "_id",
                as: "company",
                
            }
        },
				{
				$unwind:"$company"
				},
    {$project:{
    _id:0,
    "Company Code":"$company.companyCode",
    "Nama Unit Induk":"$company.companyName",
    "Plant Code":"$plantCode",
    "Nama Up3":"$unitName",
    }}
])