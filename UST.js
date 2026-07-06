// db.m_ust_request.find({noPengajuan:"20211203-1-4"})

// 
// db.m_ust_request.find({noPengajuan:"20231218-3-263"},{"supplierId":1,"sku":1,"stock":1, jumlahHasilUji:1 });


db.m_ust_request_elab.find({noPengajuan:"20231218-3-263"})

// db.m_ust_request_elab.find({noPengajuan:"20231219-8-264"})

// db.m_ust_request_elab.find({noPengajuan:"20231228-3-294"})

// db.m_ust_request_elab.find({noPengajuan:"20231228-1-293"})

// db.m_ust_request_elab.find({noPengajuan:"20231229-1-302"})

db.m_ust_request_elab.find({status:/resu/i})