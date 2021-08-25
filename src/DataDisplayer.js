
import { Button, TextField } from "@material-ui/core";
import { useRef } from "react";

export default function DataDisplayer({ data,extension="txt",dataMimeType="text/plain" }) {
    const downloadFile=useRef(null);
    return (<>
        <Button variant="contained" onClick={() => { navigator.clipboard.writeText(data) }}>Copy Data To Clipboard</Button>
        <a hidden ref={downloadFile} download={"findagravemiddleborough_data."+extension} href={URL.createObjectURL(new Blob([data], {type: dataMimeType}))}>This isn't a link</a>
        <Button variant="contained" onClick={(e)=>{e.preventDefault();downloadFile.current.click()}}>Download Datafile</Button><br />
        <TextField
            value={data}
            multiline
            fullWidth
            inputProps={{
                readOnly: true
            }}
        ></TextField>
    </>)
}