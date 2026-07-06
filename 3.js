	db.m_new_alokasi_kontrak.find({"_id":{$in:[
"NA20230707-221757",
"NA20230707-221627",
"NA20230707-215027",
"NA20230707-210924",
"NA20230707-210414",
"NA20230707-203734"
]}, "continuedByNoAlokasi":{$exists:true}}
)
,{"endDate":1,"permanentlyNonactive":1}).sort({_created:-1})



db.m_new_alokasi_kontrak.find({_id:"NA20230707-221757"})

db.m_new_alokasi_kontrak.updateOne({_id:"NA20230707-221757"}, {$set:{"details.0.totalRealisasi": NumberLong("192"),"details.totalSPB": NumberLong("0"),"details.percentageRealisasi": 100,}})

