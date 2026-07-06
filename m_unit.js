// db.m_company.find({level:"BUYER"},{companyName:1,companyCode:1,});

db.m_unit.find({companyName:/UIP JBB/i},{_id:0,unitName:1,plantCode:1,address:1,kelurahanName:1,kecamatanName:1,cityName:1,provinceName:1, postalCode:1});

db.m_unit.find({plantCode:/7215/i});

db.ref_province.find({name:"Banten"})

db.ref_kelurahan.find({name:/sukajaya/i})