const BookInput = ({label, value, setter}) => {
    return (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <label style={{ width: "100px", textAlign: "right" }}>{label}:</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setter(e.target.value)}
            style={{ flex: 1, padding: "8px", minWidth: "0" }}
          />
        </div>
    )
}

export default BookInput;