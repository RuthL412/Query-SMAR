db.m_new_alokasi_kontrak.find({"listSKU.noSku":{$in:["1582014656427",
"1582014622475",
"1582014701685",
"1582014819815",
"1582014352299",
"1582014732336"]}, "continuedByNoAlokasi":{$exists:true}},{"continuedByNoAlokasi":1}).sort({_created:-1})

db.m_new_alokasi_kontrak.find({})

db.m_new_alokasi_kontrak.find({_id:"NA20230707-203734"},{"details":1,"details.supplierName":1,"details.totalRealisasi":1});