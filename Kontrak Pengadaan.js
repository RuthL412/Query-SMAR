db.t_delivery_order.find({_id:"DO202300018370"});


db.m_kontrak_pengadaan.find({noKontrak:"2022.PJ/DAN 01.01/F01020000/2023"});

//  Update
db.m_kontrak_pengadaan.update({id:342,noKontrak:"0663.PJ/DAN.01.03/C01040000/2022"},{$set:{"endDateKontrak": ISODate("2024-01-10T16:59:59.999Z"), status: "AKTIF" }});

db.m_kontrak_pengadaan.update({id:120,noKontrak:"0663.PJ/DAN.01.03/C01040000/2022"}, update, options)

