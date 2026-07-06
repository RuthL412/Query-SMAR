db.t_purchase_order.aggregate([
    {
        $match: {
            _created:{
$gt:ISODate("2024-10-23T16:59:59.000Z"),
$lte:ISODate("2025-12-31T16:59:59.000Z")
},
digiSignStatus:{$in:["INTERNAL","EKSTERNAL"]},
status:{$nin:[
"REJECTED_MSB", // penolakan oleh MSB
  "REJECTED_SRM", // penolakan oleh SRM
  "REJECTED_PJPELDAN", // penolakan oleh Pejabat Peldan
  "REJECTED_GM", // penolakan oleh GM
	"REJECTED_SYS_INTERNAL",
  "REJECTED_SYS_POSEND",
]}
        }
    },
		{$project:{
		_id:1,
		status:1,
		digiSignStatus:1,
		_created:1
		}}
]);

