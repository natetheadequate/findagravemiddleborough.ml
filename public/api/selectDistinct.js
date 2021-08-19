function returnUniqueVals(rawdata,cb=v=>v) {
    let selectOptions = [];
    let data = JSON.parse(rawdata);
    Object.values(data).forEach(row => {
        Object.values(row).forEach(cell => {
            cell.forEach(option => {
                if (selectOptions.indexOf(option) === -1) {
                    selectOptions.push(option);
                }
            })
        })
    })
    return cb(selectOptions);
}
async function selectDistinct(field) {
    await fetch('/api/getData.php?select='+field)
        .then(res => res.text())
        .then(data => returnUniqueVals(data));
}