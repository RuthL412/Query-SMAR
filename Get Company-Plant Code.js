db.m_unit.aggregate([
//{$match:{"level": "BUYER",}},
  {
    $group: {
      _id: {
        companyCode: "$plantCode",
        companyName: "$unitName"
      }
      }
    },{
    $project: {
		_id:0,
      companyCode: "$_id.companyCode",
      companyName: "$_id.companyName"
    }
  },
	{$sort:{companyCode:1}}
])