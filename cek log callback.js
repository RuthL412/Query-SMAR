db.sp_integration_in_out_log.find({
    name: {
        $in: ["POST /o/digi-sign-open-api/upload-file", ]
    },
    "req.noTrx": {$in:[
"PO202500013685",
"PO202500013687",
"PO202500013705",
"PO202500013725",
"PO202500013726",
"PO202500013728",
//"PO202500013727",
//"PO202500013699",
]}
}).sort({
    _created: - 1
}).limit(1);