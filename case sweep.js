db.m_sweep_alokasi_kontrak.find({noAlokasi:"NA20220518-134234",
"supplierId": "pt_electra_inti_perkasa",
    "supplierName": "PT ELECTRA INTI PERKASA",
    "buyerId": "pln_kw_uiw_sulselrabar",
    "buyerName": "PLN KW UIW Sulselrabar",
}).sort({tanggalSweeping:-1})

db.m_sweep_alokasi_kontrak.find({noAlokasi:"NA20240829-103959"})

db.log_general.find({name:"SWEEP_ALOKASI_ACTION","details.request.noAlokasi":"NA20230707-203734"})

db.log_general.find({name:"SWEEP_ALOKASI_ACTION","details.request.sweepAlokasiDate": {$gte:ISODate("2024-06-29T17:00:00.000Z")}})


db.t_history_new_alokasi_kontrak.distinct("status")

db.t_history_new_alokasi_kontrak.find({event:"SWEEP_ALOKASI",noAlokasi:"NA20231013-101956"}).sort({_created:-1})







db.t_history_new_alokasi_kontrak.find({
event:"SWEEP_ALOKASI",
noAlokasi:"NA20220518-134234",
"supplierId": "pt_electra_inti_perkasa",
    "supplierName": "PT ELECTRA INTI PERKASA",
    "buyerId": "pln_kw_uiw_sulselrabar",
    "buyerName": "PLN KW UIW Sulselrabar",
}).sort({_created:-1})

db.m_setting_sla_minimum_history.find({
//categoryLv1Id": "plnmp074",
   "categoryLv1Id": "biz065",
    "categoryLv1Name": "CABLE POWER",
    "categoryLv2Id": "biz06518",
    "categoryLv2Name": "NA2XSEYBY;3X300mm2",
});