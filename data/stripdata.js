onload = () => {
    {
        const tds = document.getElementsByTagName('td');
        for (let i = 0; i < tds.length; i++) {
            tds[i].id = 'td' + i;
            tds[i].innerHTML=tds[i].innerHTML.replaceAll('<br>','[***LINEBREAK***]');
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
            el.nodeValue.replaceAll(/(\n|\\n)/g,'[***LINEBREAK***]').replaceAll(/\s+/g,' '),
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
    let notagsoutput='';
    if(textnodes.toString().search(lineseparator)!=-1){alert("why is there "+lineseparator+" in the data?")}
    if(textnodes.toString().search(colseparator)!=-1){alert("why is there "+colseparator+" in the data?")}
    if(textnodes.toString().search(colencloser)!=-1){alert("why is there "+colencloser+" in the data?")}
    if(textnodes.toString().search(/\n/)!=-1){alert("why is there newline in the data?")}
    if(textnodes.toString().search(/<\/?[^>]*>/)!=-1){alert("why is there html tag in the data?")}
    let totalcolsepcount=0;
    let currentcolsepcount=1;//tracks number of colseparators added so far in a line, so that all the remaining ones are added at the end
    textnodes.forEach(v=>{
        //adding separators and notagsoutput column for a...
        if(v[3]!=lasttr){//...new row
            output+=colencloser+colseparator+colencloser+notagsoutput+colencloser+colseparator.repeat(totalcolsepcount-currentcolsepcount)+lineseparator;
            //adding the notags of the last not empty td of a row, then ending the line.
            //That colseparator above doesn't count towards currentcolsepcount or totalcolsepcount
            output+=colencloser+v[3]+colencloser+colseparator+colencloser;//starting newline with index
            notagsoutput='';
            lasttr=v[3];
            lasttd=v[2];
            currentcolsepcount=1;
        }else if(lasttd!=v[2]){//...new td 
            output+=colencloser+colseparator+colencloser+notagsoutput+colencloser+colseparator.repeat((2*(v[2]-lasttd)-1))+colencloser;
            notagsoutput='';
            currentcolsepcount+=1+(2*(v[2]-lasttd)-1);
            lasttd=v[2];
        }
        //adding the content for ...
        if(v[3]==0){ //...headers
            output+=v[0]
            notagsoutput+="notags"+v[0];
            totalcolsepcount=currentcolsepcount;
            /*the last th will 
            */
        }else{ //...normal cells
            output+='<span style="color:'+v[1]+'">'+v[0].replaceAll('[***LINEBREAK***]','<br>')+'</span>';
            notagsoutput+=v[0].replaceAll('[***LINEBREAK***]','');
        }
    })
    console.log(output.replaceAll(lineseparator,'\n').replaceAll(colseparator,',')+colencloser);
}