Mas Ndaru
1. AIRBIZZ1584326054597797 (43) v
2. AIRBIZZ1584327472128828 (92) v
3. PLNMP1686714724097197		(21) v
4. PLNMP16867151262088			(15) done
5. AIRBIZZ1583920382809409  (13) done
6. AIRBIZZ1583986667967567	(11) done
7. PLNMP1690282262657857		(37) done
8.
9.
10.

Kontrak:
db.m_kontrak_pengadaan.find({noKontrak:"1990.Pj/DAN.01.01/F01020000/2024"})
db.m_kontrak_pengadaan.find({noKontrak:/0014/i})


db.m_kontrak_pengadaan.find({"materials.productId":"PLNMP1637049518361261"})

db.m_product.find({_id:"PLNMP1637049518361261"})
db.m_product.updateOne({_id:"PLNMP1637049518361261"},{$set:{ "volumeKHS": NumberLong("1740"),}})

db.m_ust_request_elab_summary.find({"noKontrak": "0014.PJ/DAN.01.01/F01020000/2024",})

db.m_company.find({companyName:"PT GLOBALNINE INDONESIA"})


db.collection.find(query)