db.t_delivery_order.count({$expr: {
    $eq: [{ $year: "$_created" }, 2024]
  },
	 status:"FINISHED"
	})
	
	
	db.t_purchase_order.find({_id:/PO2024/i}).sort({_created:-1}).limit(1)
	
	
	db.t_purchase_order.aggregate([
	{$match:{status:"FINISHED",$expr: {
    $eq: [{ $year: "$_created" }, 2024]
  }}},
	{$unwind:"$details"},
	{$group:{
	_id:{$year:"$_created"},
	hargaTotal:{$sum:"$hargaTotal"},
	hargaKirimTotal:{$sum:"$hargaKirimTotal"},
	biayaKirimTotal:{$sum:"$details.hargaKirimTotal"},
	biayaKirimSatuan:{$sum:"$details.biayaKirimSatuan"},
	hargaJasaTotal:{$sum:"$details.hargaJasaTotal"},
	biayaJasaSatuan:{$sum:"$details.biayaJasaSatuan"},
	otherCostServiceValue:{$sum:"$details.otherCostServiceValue"},
	
	}}
	])