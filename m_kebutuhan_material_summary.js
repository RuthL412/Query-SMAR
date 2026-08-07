db.m_kebutuhan_material_summary.find({buyerName:"PLN UID Jawa Timur",sku:{$in:[
	"1636856028618"
	]},tahun:2024});


	db.m_kebutuhan_material_summary.find({buyerName:"PLN UID Kalimantan Timur dan Utara",sku:{$in:[
	"1574759561557","1574759784993","1582009868781","1582009921773","1582012397266"
	]},tahun:2024,isTahunan:false}).sort({sku:1});
	
		db.m_kebutuhan_material_summary.updateMany({buyerName:"PLN UID Jawa Barat",sku:{$in:[
	"1582014701685","1582014656427","1582014352299"
	]},tahun:2024,isTahunan:false},{$set:{statusApril:"APPROVED_SRM"}});

db.m_kebutuhan_material_summary.find({buyerName:/banten/i,tahun:2024,april:{$gt:0}},{sku:1,statusApril:1}).sort({sku:1})



db.m_kebutuhan_material_summary.updateOne({buyerName:"PLN UID Kalimantan Selatan dan Tengah",sku:,tahun:2024,isTahunan:false},{$set:{maret:,summary:,maretApproved:,summaryApproved:}});

