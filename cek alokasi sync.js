db.m_new_alokasi_bulanan_kontrak_unit.find({noAlokasi:"NAB20260119-100127",availableQuota:{$gt:0},
listBreakdown: {
    $elemMatch: {
      availableQuota: { $gt: 0 },
      purchaseOrderAlokasiLog: { $exists: false }
    }
  }
})