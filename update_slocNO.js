
db.m_company.find({companyName:"PT Alum Central Mandiri Lestari"});

db.m_unit.updateOne(
  { unitName: "PLN UP3 Bandung" },
  {
    $set: {
      "slocNo": "2022",
      "slocNoOld": [
        { sloc: "2090", created: new Date() }
      ]
    }
  }
);

db.m_unit.updateOne(
  { unitName: "PLN UP3 Bandung" },
  {
    $set: {
      "slocNo": "2022",
      "slocNoOld": [
        { sloc: "2090", created: new Date() }
      ]
    }
  }
);
