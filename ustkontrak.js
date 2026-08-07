//db.m_kontrak_pengadaan.find({status:"TIDAK_AKTIF"}).sort({noKontrak:-1});
//db.m_ust_request_elab.find().sort({_created:-1})
db.m_ust_request_elab.aggregate([
{$project:{
_id:1, noPengajuan:1,noKontrak:1,status:1,_created:1
}},
{$lookup:{
from:"m_kontrak_pengadaan",
let:{kontrak:"$noKontrak"},
pipeline:[
{
          $match: {
            $expr: { $eq: ["$noKontrak", "$$kontrak"] },
            latest: true
          }
        },
        { $project: { _id: 0, status: 1 } }
      ],

as:"kontrak"
}},
{
$unwind:"$kontrak"
},
{
$project:{
"nomor Pengajuan":"$noPengajuan",
"nomor kontrak":"$noKontrak",
"status ust":"$status",
"tanggal pembuatan ust":"$_created",
"status kontrak":"$kontrak.status",
}
},
{$sort:{
"tanggal pembuatan ust":-1
}}
])