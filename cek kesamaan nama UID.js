db.t_history_new_alokasi_kontrak.aggregate([
//{$match:{}},
{
    $lookup: {
      from: "m_company",
      localField: "buyerId",
      foreignField: "_id",
      as: "company",
    },
  },
	  {
    $unwind: "$company",
  },
	{$project:{
	_id:0,
	buyerId:"$buyerId",
	buyerName:"$buyerName",
	buyerNameCompany:"$company.companyName",
	status:{
        $cond: {
          if: { $eq: ["$buyerName", "$company.companyName"] },
          then: true,
          else: false
        }
      },
			_created:"$_created"
	}},
	{$match:{status:false}}
])