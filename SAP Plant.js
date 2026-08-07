db.sap_plant_material.find({companyCode:/4E00/i})
db.sap_plant_material.find({plantCode:/5320/i}).sort({_created:-1})

db.sap_plant.find({companyCode:/4Q00/i})

db.sap_plant_material.find({companyCode:{$in:["4N00","4R00","4Q00"]}},{plantCode:1,plantDesc:1})
db.sap_plant_material.find({companyCode:{$in:[/4N/i]}})

db.sap_plant.find({_id:{$in:["5320"]}});
db.sap_plant_material.distinct("companyCode");

db.sap_plant_material.distinct("companyCode");



