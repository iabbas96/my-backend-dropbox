import './Breadcrumbs.css';

export default function Breadcrumbs({ currentPath, onNavigate }) {
  //To split the path into parts, ignoring empty strings
  const parts = currentPath.split('/').filter(part => part !== '');

  return (
    <div className="breadcrumbs">
      <button
        className={`breadcrumb-item ${parts.length === 0 ? 'active' : ''}`}
        onClick={() => onNavigate('')}
      >
        Home
      </button>
      {parts.map((part, index) => {
        //To build the cumulative path up to this part
        const pathSoFar = parts.slice(0, index + 1).join('/') + '/';
        const isLast = index === parts.length - 1;
        return (
          <span key={index} className="breadcrumb-segment">
            <span className="breadcrumb-separator"> / </span>
            <button
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              onClick={() => onNavigate(pathSoFar)}
              disabled={isLast}
            >
              {part}
            </button>
          </span>
        );
      })}
    </div>
  );
}