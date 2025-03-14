const Card = ({ children, className }) => (
  <div className={`border p-4 rounded shadow ${className}`}>{children}</div>
);

export default Card;
