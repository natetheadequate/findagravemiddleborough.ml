onload = () => {
    let tw = document.createTreeWalker(document.getElementsByTagName('table')[0], NodeFilter.SHOW_TEXT,
        { acceptNode: function (node) { if (/\S/.test(node.data)) { return NodeFilter.FILTER_ACCEPT } } })
    let el = tw.nextNode();
    let i = 0;
    do {
        const rawcolor = el.parentElement?.style?.color || getComputedStyle(el.parentElement).getPropertyValue('color');
        let span = document.createElement("span");
        span.style.color = rawcolor;
        span.append(document.createTextNode(el.nodeValue));
        let oldel = el;
        if (!(el = tw.nextNode())) {
            break;
        }
        oldel.parentElement.appendChild(span);
        oldel.parentElement.removeChild(oldel);
        i++;
    } while (true);
    const data = document.getElementsByTagName('tbody')[0].innerHTML
        .replaceAll(/\n/g, " ").replaceAll('|', '-')
        .replaceAll(/<\/tr>\s*<tr[^>]*>/g, '@#@#@#@#')
        .replaceAll(/<\/td>\s*<td[^>]*>/g, '|,|')
        .replaceAll(/<\/?td[^>]*>/g, '|')
        .replaceAll(/<\/?tr[^>]*>/g, '')
        .replaceAll(/\|[^|]*<span style="color: rgb\(([^>]+)>\s*<\/span>[^|]*\|/g, '||') //clears out any blank good spans + their extraneous elements
        .replaceAll(/\|[^|]*<span style="color: rgb\(([^<]*)<\/span>[^|]*\|/g, '|<span style="color: rgb($1</span>|') //clears out any extraneous elements of good spans with content
        .replaceAll(/ +/g,' ')
        .replaceAll(/\|\s*@#@#@#@#\s*\|/g,'|@#@#@#@#|');
    const dataarr=data.split('@#@#@#@#');
    const csvarr=[dataarr[0].replaceAll(/<[^>]*>/g,'')];
    for(let i=1;i<dataarr.length;i++){
        csvarr[i]=dataarr[i];
    }
    console.log(csvarr.join('\n'));
}