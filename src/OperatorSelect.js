import { MenuItem, Select } from '@material-ui/core'

function OperatorSelect({value,i,fieldObject,setOperator}) {
	const inputType = fieldObject.hasOwnProperty('inputType') ? fieldObject.inputType : '';
	const selectProps={
		id:('condition'+ i + 'operator'),
		value:value,
		onChange:e => setOperator(e.target.value)
	}
	switch (inputType) {
		case 'date':
			return (<Select {...selectProps}>
				<MenuItem value="=">on</MenuItem>
				<MenuItem value="<=">on or before</MenuItem>
				<MenuItem value=">=">on or after</MenuItem>
				<MenuItem value="<">before</MenuItem>
				<MenuItem value=">">after</MenuItem>
			</Select>)
		case 'number':
			return (<Select {...selectProps}>
				<MenuItem value="=">=</MenuItem>
				<MenuItem value="<=">&lt;=</MenuItem>
				<MenuItem value=">=">&gt;=</MenuItem>
				<MenuItem value="<">&lt;</MenuItem>
				<MenuItem value=">">&gt;</MenuItem>
			</Select>)
		default:
			return (<Select {...selectProps}>
				<MenuItem value="=">Matches Exactly</MenuItem>
				<MenuItem value="%LIKE%">Contains</MenuItem>
				<MenuItem value="LIKE%">Starts With</MenuItem>
				<MenuItem value="%LIKE">Ends With</MenuItem>
			</Select>)
	}
}
export default OperatorSelect