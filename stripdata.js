onload = () => {
    {
        const tds = document.getElementsByTagName('td');
        for (let i = 0; i < tds.length; i++) {
            tds[i].id = 'td' + i;
            tds[i].innerHTML=tds[i].innerHTML.replaceAll('<br>',' | ');
        }
        const trs = document.getElementsByTagName('tr');
        for (let i = 0; i < trs.length; i++) {
            trs[i].id = 'tr' + i;
        }
    }
    let tw = document.createTreeWalker(document.getElementsByTagName('table')[0], NodeFilter.SHOW_TEXT,
        { acceptNode: function (node) { if (/\S/.test(node.data)) { return NodeFilter.FILTER_ACCEPT } } })
    let textnodes = [];
    let i = 0;
    while (el = tw.nextNode()) {
        let td=el;
        while (td = td.parentElement) {
            if (td.tagName == "TD") { break; }
        }
        let tr = td;
        while (tr = tr.parentElement) {
            if (tr.tagName == "TR") { break; }
        }
        textnodes[i] = [
            el.nodeValue.replaceAll(/(\n|\\n)/g,' | ').replaceAll(/\s+/g,' '),
            (el.parentElement?.style?.color || getComputedStyle(el.parentElement).getPropertyValue('color')),
            +td.id.replaceAll(/\D/g, ''),
            +tr.id.replaceAll(/\D/g, '')
        ]
        i++;
    }
    
    let lasttd=0;
    let lasttr=0;
    let lineseparator='¶';
    let colseparator='¿';
    let colencloser='¤';
    let output=colencloser+'i'+colencloser+colseparator+colencloser;
    if(textnodes.toString().search(lineseparator)!=-1){alert("why is there "+lineseparator+" in the data?")}
    if(textnodes.toString().search(colseparator)!=-1){alert("why is there "+colseparator+" in the data?")}
    if(textnodes.toString().search(colencloser)!=-1){alert("why is there "+colencloser+" in the data?")}
    if(textnodes.toString().search(/\n/)!=-1){alert("why is there newline in the data?")}
    if(textnodes.toString().search(/<\/?[^>]*>/)!=-1){alert("why is there html tag in the data?")}
    textnodes.forEach(v=>{
        if(v[3]!=lasttr){
            output+=colencloser+lineseparator+colencloser+v[3]+colencloser+colseparator+colencloser;
            lasttr=v[3];
            lasttd=v[2];
        }else if(lasttd!=v[2]){
            output+=colencloser+colseparator.repeat(v[2]-lasttd)+colencloser;
            lasttd=v[2];
        }
        if(v[3]==0){
            output+=v[0];
        }else{
            output+='<span style="color:'+v[1]+'">'+v[0]+'</span>';
        }
    })
    console.log(output.replaceAll(lineseparator,'\n').replaceAll(colseparator,',')+colencloser);
}