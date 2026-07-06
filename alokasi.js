db.m_alokasi_kontrak.find({ "endDate":{$gt: ISODate("2024-02-26T16:59:00.000Z")}})

db.m_alokasi_kontrak.find({_id:"20240215-002638"},{details:1,"details.supplierNama":1,"details.realisasi":1,"details.noKontrak":1});



db.m_alokasi_kontrak.find({ _id:"20240215-002638"});





