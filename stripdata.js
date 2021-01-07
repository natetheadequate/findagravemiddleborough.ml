onload = () => {
    let tw = document.createTreeWalker(document.getElementsByTagName('table')[0], NodeFilter.SHOW_TEXT,
        { acceptNode: function (node) { if (/\S/.test(node.data)) { return NodeFilter.FILTER_ACCEPT } } })
    let el = tw.nextNode();
    let i=0;
    do {
        const rawcolor=el.parentElement?.style?.color || getComputedStyle(el.parentElement).getPropertyValue('color');
        let span=document.createElement("span");
        span.style.color=rawcolor;
        span.append(document.createTextNode(el.nodeValue));
        let oldel=el;
        if(!(el=tw.nextNode())){
            break;
        }
        oldel.parentElement.appendChild(span);
        oldel.parentElement.removeChild(oldel);
        console.log({rawcolor, span});
        i++;
    } while (true);
}