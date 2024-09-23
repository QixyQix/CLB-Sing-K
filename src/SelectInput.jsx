export function SelectInput({value, label, options, valueKey, displayKey, onChange}) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(optionItem => {
          return(
            <option key={optionItem[valueKey]} value={optionItem[valueKey]}>{optionItem[displayKey]}</option>
          )
        })}
      </select>
    </div>
  )
}