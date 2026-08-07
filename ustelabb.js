db.m_ust_request_elab.find({"noKontrak": " 0595.PJ/DAN.01.01/F01020000/2023 ","supplierId": "pt_asata_utama_electrical_industries","supplierName": "PT ASATA UTAMA ELECTRICAL INDUSTRIES","sku": "1582013469466",});

db.m_ust_request.find({"noKontrak": " 0595.PJ/DAN.01.01/F01020000/2023 ","supplierId": "pt_asata_utama_electrical_industries","supplierName": "PT ASATA UTAMA ELECTRICAL INDUSTRIES","sku": "1582013469466",});

db.m_ust_request_elab.find({productId:"AIRBIZZ1583986667967567"},{noKontrak:1,status:1,jumlahPengajuan:1,hasilUjiDate:1,jumlahHasilUji:1,approvalDate:1,_created:1,jumlahProduksi:1}).sort({approvalDate:1})