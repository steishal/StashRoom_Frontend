const NavigationControls = () => (
  <div className="navigation-controls">
    <button className="nav-btn">
      <i className="icon-file"></i>
      Go to File
      <span className="shortcut">⌘O</span>
    </button>

    <button className="nav-btn">
      <i className="icon-history"></i>
      Recent Files
      <span className="shortcut">⌘E</span>
    </button>

    <button className="nav-btn">
      <i className="icon-navigation"></i>
      Navigation Bar
      <span className="shortcut">⌘↑</span>
    </button>
  </div>
);
